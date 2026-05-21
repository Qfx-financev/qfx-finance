// investments.controller.ts
import { Controller, Post, Get, Body, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InvestmentsService } from './investments.service';
import { InvestmentPlan } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Investments')
@Controller('investments')
export class InvestmentsController {
  constructor(private investmentsService: InvestmentsService) {}

  @Public()
  @Get('plans')
  getPlans() {
    return this.investmentsService.getPlans();
  }

  @ApiBearerAuth()
  @Post('activate')
  activate(@Request() req, @Body() body: { plan: InvestmentPlan; amount: number }) {
    return this.investmentsService.activate(req.user.id, body.plan, body.amount);
  }

  @ApiBearerAuth()
  @Get('my')
  getMyInvestments(@Request() req) {
    return this.investmentsService.getMyInvestments(req.user.id);
  }
}
