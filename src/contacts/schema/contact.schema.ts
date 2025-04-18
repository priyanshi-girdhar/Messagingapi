import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ default: 'pending' })
  status: 'pending' | 'accepted';
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
