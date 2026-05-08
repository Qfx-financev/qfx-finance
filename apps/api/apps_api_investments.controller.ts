import { Body, Controller, Post } from '@nestjs/common'
import { InvestmentsService } from './investments.service'

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post('subscribe')
  subscribe(@Body() body:any) {
    return this.investmentsService.subscribe(body)
  }
}
