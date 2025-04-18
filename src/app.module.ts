import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { MessagesModule } from './messages/messages.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/messaging-api'), // Change if needed
    AuthModule,ContactsModule, MessagesModule
  ],
 
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}


