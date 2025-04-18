

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Logger, 
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RequestContactDto } from './dto/request-contact.dto.ts';
import { AcceptContactDto } from './dto/accept-contact.dto.ts';

@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name); 

  constructor(private readonly contactsService: ContactsService) {}

  @Post('request')
 
  request(@Body() dto: RequestContactDto) {
    this.logger.log(`Contact request: ${dto.senderId} -> ${dto.receiverId}`); 
    return this.contactsService.requestContact(dto);
  }

  @Post('accept')
  accept(@Body() dto: AcceptContactDto) {
    this.logger.log(`Contact accepted: ${dto.senderId} by ${dto.receiverId}`); 
    return this.contactsService.acceptContact(dto);
  }

  @Get()
  list(@Body('userId') userId: string) {
    this.logger.log(`List accepted contacts for user: ${userId}`); 
    return this.contactsService.getAcceptedContacts(userId);
  }
  @Post('test-log')
testLog() {
  this.logger.log('This is a test log message');
  this.logger.warn('This is a test warning');
  this.logger.error('This is a test error');
  return { message: 'Log test triggered' };
}
}
