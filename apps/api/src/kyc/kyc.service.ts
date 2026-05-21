// kyc.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KycService {
  constructor(private prisma: PrismaService) {}

  async uploadDocument(userId: string, type: string, fileUrl: string) {
    return this.prisma.kycDocument.create({ data: { userId, type, fileUrl } });
  }

  async getMyDocuments(userId: string) {
    return this.prisma.kycDocument.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async getStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true },
    });
    return user;
  }
}
