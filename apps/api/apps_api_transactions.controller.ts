import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { TransactionsService } from './transactions.service'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('transfer')
  transfer(@Body() body:any) {
    return this.transactionsService.transfer(body)
  }

  @Get(':userId')
  getByUser(@Param('userId') userId:string) {
    return this.transactionsService.getByUser(userId)
  }
}
