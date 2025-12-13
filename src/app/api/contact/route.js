import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';
import nodemailer from 'nodemailer';

const resolveMx = promisify(dns.resolveMx);

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message)
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 },
      );

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });

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
        { success: false, error: 'Disposable emails are not allowed' },
        { status: 400 },
      );

    try {
      const addresses = await resolveMx(domain);
      if (!addresses || addresses.length === 0)
        return NextResponse.json(
          { success: false, error: 'Email domain does not exist' },
          { status: 400 },
        );
    } catch {
      return NextResponse.json(
        { success: false, error: 'Email domain does not exist' },
        { status: 400 },
      );
    }

    const username = email.split('@')[0];
    if (/^\d+$/.test(username) || username.length < 2 || username.length > 64)
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aitezazsikandar@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <aitezazsikandar@gmail.com>`,
      to: 'aitezazsikandar@gmail.com',
      replyTo: email,
      subject: `New message from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}
