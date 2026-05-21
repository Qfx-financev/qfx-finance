// transactions.controller.ts
import { Controller, Post, Get, Body, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private txService: TransactionsService) {}

  @Post('deposit')
  deposit(@Request() req, @Body() body: { amount: number; currency?: string }) {
    return this.txService.deposit(req.user.id, body.amount, body.currency);
  }

  @Post('withdraw')
  withdraw(@Request() req, @Body() body: { amount: number; currency?: string }) {
    return this.txService.withdraw(req.user.id, body.amount, body.currency);
  }

  @Get()
  getAll(@Request() req, @Query() query: { page?: number; limit?: number; type?: string; status?: string }) {
    return this.txService.getTransactions(req.user.id, query);
  }
}
