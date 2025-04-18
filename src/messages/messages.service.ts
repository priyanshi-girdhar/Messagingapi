import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  Logger,                      
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { ContactsService } from '../contacts/contacts.service';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);  

  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    private contactsService: ContactsService,
  ) {}

  async sendMessage(dto: SendMessageDto) {
    const { senderId, receiverId, content } = dto;

    this.logger.log(`SendMessage attempt: from ${senderId} to ${receiverId}`);  

    // Check if contact is accepted
    const allowed = await this.contactsService.isContactAccepted(senderId, receiverId);
    if (!allowed) {
      this.logger.warn(`Blocked message: ${senderId} is not connected to ${receiverId}`);  
      throw new ForbiddenException('You are not connected to this user');
    }

    // Rate limit: max 5 messages/min
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentMessages = await this.messageModel.countDocuments({
      senderId,
      createdAt: { $gt: oneMinuteAgo },
    });

    if (recentMessages >= 5) {
      this.logger.warn(`Rate limit hit by ${senderId}`); 
      throw new BadRequestException('Rate limit exceeded. Max 5 messages/minute.');
    }

    const message = new this.messageModel({ senderId, receiverId, content });

    await message.save();  
    this.logger.debug(`Message saved: ${message._id}`);  

    return { message: 'Message sent' };
  }

  async getMessages(userId: string, contactId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    this.logger.log(
      `GetMessages called by ${userId} for contact ${contactId} (page: ${page}, limit: ${limit})`
    );  
    const messages = await this.messageModel
      .find({
        $or: [
          { senderId: userId, receiverId: contactId },
          { senderId: contactId, receiverId: userId },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    this.logger.debug(`Fetched ${messages.length} messages`);  
    console.log(messages);

    return messages.reverse(); // So oldest is first
  }
}
