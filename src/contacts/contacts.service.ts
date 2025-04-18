import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schema/contact.schema';
import { RequestContactDto } from './dto/request-contact.dto.ts';
import { AcceptContactDto } from './dto/accept-contact.dto.ts';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  // Send a contact request
  async requestContact(dto: RequestContactDto) {
    const { senderId, receiverId } = dto;

    // Prevent duplicate requests
    const existing = await this.contactModel.findOne({ senderId, receiverId });
    if (existing) {
      throw new ConflictException('Contact request already sent');
    }

    const request = new this.contactModel({ senderId, receiverId });
    await request.save();

    return { message: 'Contact request sent' };
  }

  // Accept a contact request
  async acceptContact(dto: AcceptContactDto) {
    const { senderId, receiverId } = dto;

    const contact = await this.contactModel.findOne({
      senderId,
      receiverId,
      status: 'pending',
    });

    if (!contact) {
      throw new NotFoundException('Contact request not found');
    }

    contact.status = 'accepted';
    await contact.save();

    return { message: 'Contact request accepted' };
  }

  // Get all accepted contacts for a user
  async getAcceptedContacts(userId: string) {
    const contacts = await this.contactModel.find({
      $or: [
        { senderId: userId, status: 'accepted' },
        { receiverId: userId, status: 'accepted' },
      ],
    });

    return contacts;
  }

  // Check if a user is in contact with another (used in messaging logic)
  async isContactAccepted(userId: string, otherUserId: string): Promise<boolean> {
    const contact = await this.contactModel.findOne({
      $or: [
        { senderId: userId, receiverId: otherUserId, status: 'accepted' },
        { senderId: otherUserId, receiverId: userId, status: 'accepted' },
      ],
    });

    return !!contact;
  }
}
