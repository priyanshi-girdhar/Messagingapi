import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { ContactsModule } from '../contacts/contacts.module'; // To check contact status

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ContactsModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
