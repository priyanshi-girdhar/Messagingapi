import { Controller, Post, Body, UseGuards, Req, Get, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(@Body() dto: SendMessageDto) {
    return this.messagesService.sendMessage(dto);
  }

  @Get(':contactId')
  async getMessages(
    @Req() req,
    @Param('contactId') contactId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    console.log(req.user.userId, contactId);
    return this.messagesService.getMessages(req.user.userId, contactId, +page, +limit);
  }
}
