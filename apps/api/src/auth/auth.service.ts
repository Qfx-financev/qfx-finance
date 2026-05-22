import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { RegisterDto, LoginDto, TwoFactorDto } from './dto/auth.dto';
import { createClient } from 'redis';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private redis: ReturnType<typeof createClient>;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.redis = createClient({ url: this.config.get('REDIS_URL') });
    this.redis.connect().catch(err => this.logger.error('Redis connection failed', err));
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    });

    this.logger.log(`New user registered: ${user.email}`);
    return { message: 'Registration successful', user };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('Account suspended');

    if (user.twoFactorEnabled) {
      return { requires2fa: true, userId: user.id };
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  async verify2fa(dto: TwoFactorDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user || !user.twoFactorSecret) throw new UnauthorizedException();

    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: dto.token,
      window: 2,
    });

    if (!valid) throw new UnauthorizedException('Invalid 2FA code');
    return this.generateTokens(user.id, user.email, user.role);
  }

  async setup2fa(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const secret = speakeasy.generateSecret({ name: `QFX Finance (${user.email})` });

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
    return { qrCode: qrCodeUrl, secret: secret.base32 };
  }

  async enable2fa(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2,
    });
    if (!valid) throw new BadRequestException('Invalid code');
    await this.prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
    return { message: '2FA enabled successfully' };
  }

  async refreshToken(token: string) {
    const stored = await this.redis.get(`refresh:${token}`);
    if (!stored) throw new UnauthorizedException('Invalid refresh token');

    const payload = JSON.parse(Buffer.isBuffer(stored) ? stored.toString('utf8') : stored);
    await this.redis.del(`refresh:${token}`);
    return this.generateTokens(payload.userId, payload.email, payload.role);
  }

  async logout(userId: string, token: string) {
    await this.redis.del(`refresh:${token}`);
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    await this.redis.setEx(
      `refresh:${refreshToken}`,
      7 * 24 * 60 * 60,
      JSON.stringify({ userId, email, role }),
    );

    return { accessToken, refreshToken, tokenType: 'Bearer' };
  }
}
