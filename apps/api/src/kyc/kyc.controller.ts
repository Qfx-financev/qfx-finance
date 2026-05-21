// kyc.controller.ts
import { Controller, Post, Get, Body, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { KycService } from './kyc.service';

@ApiTags('KYC')
@ApiBearerAuth()
@Controller('kyc')
export class KycController {
  constructor(private kycService: KycService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        return cb(new Error('Only JPEG/PNG allowed'), false);
      }
      cb(null, true);
    },
  }))
  async uploadDocument(
    @Request() req,
    @Body('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // In production: upload to S3/Cloudinary, use URL
    const fileUrl = `uploads/${file.originalname}`;
    return this.kycService.uploadDocument(req.user.id, type, fileUrl);
  }

  @Get('documents')
  getMyDocuments(@Request() req) {
    return this.kycService.getMyDocuments(req.user.id);
  }

  @Get('status')
  getStatus(@Request() req) {
    return this.kycService.getStatus(req.user.id);
  }
}
