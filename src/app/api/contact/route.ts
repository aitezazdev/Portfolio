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

// Memory-backed IP rate limiter (5 requests per 15 minutes)
const ipCache = new Map<string, { count: number; expires: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipCache.get(ip);
  if (!record || now > record.expires) {
    ipCache.set(ip, { count: 1, expires: now + 15 * 60 * 1000 });
    return false;
  }
  if (record.count >= 5) {
    return true;
  }
  record.count += 1;
  return false;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanHeader(input: string): string {
  return input.replace(/[\r\n]/g, '').trim();
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please try again later.',
      },
      { status: 429 }
    );
  }

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

    const parts = email.split('@');
    if (parts.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const domain = parts[1].toLowerCase();
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

    const username = parts[0];
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

    // Message validations
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 30) {
      return NextResponse.json(
        { success: false, error: 'Please enter a meaningful message (at least 30 characters)' },
        { status: 400 }
      );
    }

    const escapedName = escapeHtml(trimmedName);
    const cleanReplyEmail = cleanHeader(email.trim());
    const escapedMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br>');

    if (!process.env.GMAIL_APP_PASSWORD) {
      console.error('SMTP Error: GMAIL_APP_PASSWORD env variable is not configured!');
      return NextResponse.json(
        {
          success: false,
          error: 'Server email configuration error.',
        },
        {
          status: 500,
        },
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'aitezazsikandar@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
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
      replyTo: cleanReplyEmail,
      subject: `New message from ${cleanHeader(trimmedName)}`,
      html: `<p><strong>Name:</strong> ${escapedName}</p><p><strong>Email:</strong> ${escapeHtml(cleanReplyEmail)}</p><p><strong>Message:</strong></p><p>${escapedMessage}</p>`,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error: any) {
    console.error('Contact form SMTP error:', error);

    if (process.env.NODE_ENV === 'development') {
      try {
        const logDir = process.cwd();
        const logFile = path.join(logDir, 'messages.txt');
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
        const logEntry = `\n======================================\nDate: ${timestamp} PKT\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n======================================\n`;
        fs.appendFileSync(logFile, logEntry, 'utf8');
        console.log('Saved message to messages.txt fallback successfully.');

        return NextResponse.json({
          success: true,
          message: 'Message saved locally!',
        });
      } catch (fsError) {
        console.error('Failed to write message to fallback file:', fsError);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message. Please try again later.',
      },
      {
        status: 500,
      },
    );
  }
}
