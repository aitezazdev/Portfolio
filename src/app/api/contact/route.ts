import { NextResponse } from 'next/server';
import dns from 'dns';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

interface ContactRequestBody {
  name?: string;
  email?: string;
  message?: string;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  let name = '';
  let email = '';
  let message = '';

  try {
    const body = (await request.json()) as ContactRequestBody;
    name = body.name || '';
    email = body.email || '';
    message = body.message || '';
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid JSON request body',
      },
      {
        status: 400,
      },
    );
  }

  try {
    if (!name || !email || !message)
      return NextResponse.json(
        {
          success: false,
          error: 'All fields are required',
        },
        {
          status: 400,
        },
      );

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        {
          status: 400,
        },
      );

    const disposableDomains = [
      'tempmail.com',
      'guerrillamail.com',
      '10minutemail.com',
      'mailinator.com',
      'yopmail.com',
      'throwaway.email',
      'fakeinbox.com',
      'maildrop.cc',
      'temp-mail.org',
      'getnada.com',
      'trashmail.com',
      'sharklasers.com',
      'grr.la',
      'mintemail.com',
      'test.com',
      'example.com',
      'fake.com',
      'spam4.me',
      'emailondeck.com',
    ];
    const domain = email.split('@')[1].toLowerCase();
    if (disposableDomains.includes(domain))
      return NextResponse.json(
        {
          success: false,
          error: 'Disposable emails are not allowed',
        },
        {
          status: 400,
        },
      );

    const username = email.split('@')[0];
    if (username.length < 1 || username.length > 64)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        {
          status: 400,
        },
      );

    // Name validations
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }
    if (!/[a-zA-Z]/.test(trimmedName)) {
      return NextResponse.json(
        { success: false, error: 'Name must contain at least one letter' },
        { status: 400 }
      );
    }
    const fakeNames = ['test', 'abc', 'xyz', 'asdf', 'qwerty', 'john doe', 'test user'];
    if (fakeNames.includes(trimmedName.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid name' },
        { status: 400 }
      );
    }
    if (/^\d+$/.test(trimmedName)) {
      return NextResponse.json(
        { success: false, error: 'Name cannot be only numbers' },
        { status: 400 }
      );
    }
    if (/(.)\1{4,}/.test(trimmedName)) {
      return NextResponse.json(
        { success: false, error: 'Please avoid repeating characters in your name' },
        { status: 400 }
      );
    }

    // Message validations
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 30) {
      return NextResponse.json(
        { success: false, error: 'Please enter a meaningful message (at least 30 characters)' },
        { status: 400 }
      );
    }
    const words = trimmedMessage.split(/\s+/);
    if (words.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please enter a meaningful message (at least 5 words)' },
        { status: 400 }
      );
    }
    const spamPhrases = ['test message', 'testing', 'asdf', 'qwerty'];
    if (spamPhrases.some((p) => trimmedMessage.toLowerCase().includes(p))) {
      return NextResponse.json(
        { success: false, error: 'Please avoid test/spam phrases in your message' },
        { status: 400 }
      );
    }
    if (/(.)\1{10,}/.test(trimmedMessage)) {
      return NextResponse.json(
        { success: false, error: 'Please avoid repeating characters in your message' },
        { status: 400 }
      );
    }

    const escapedName = escapeHtml(trimmedName);
    const escapedEmail = escapeHtml(email.trim());
    const escapedMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br>');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'aitezazsikandar@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      // Force IPv4 lookup to prevent timeouts in serverless/hosting environments
      lookup: (
        hostname: string,
        options: dns.LookupOneOptions,
        callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void
      ) => {
        dns.lookup(hostname, { family: 4 }, callback);
      },
    } as any);

    await transporter.sendMail({
      from: `"Portfolio Contact" <aitezazsikandar@gmail.com>`,
      to: 'aitezazsikandar@gmail.com',
      replyTo: escapedEmail,
      subject: `New message from ${escapedName}`,
      html: `<p><strong>Name:</strong> ${escapedName}</p><p><strong>Email:</strong> ${escapedEmail}</p><p><strong>Message:</strong></p><p>${escapedMessage}</p>`,
    });
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error: any) {
    console.error('Contact form SMTP error:', error);

    // Save message to messages.txt locally as a backup/fallback
    try {
      const logDir = process.cwd();
      const logFile = path.join(logDir, 'messages.txt');
      const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
      const logEntry = `\n======================================\nDate: ${timestamp} PKT\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n======================================\n`;
      fs.appendFileSync(logFile, logEntry, 'utf8');
      console.log('Saved message to messages.txt fallback successfully.');

      // Return a successful response in local development to allow testing form submission UI
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          message: 'Message saved locally (SMTP connection timed out, check messages.txt)!',
        });
      }
    } catch (fsError) {
      console.error('Failed to write message to fallback file:', fsError);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message',
      },
      {
        status: 500,
      },
    );
  }
}
