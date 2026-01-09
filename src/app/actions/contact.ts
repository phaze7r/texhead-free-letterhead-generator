'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const contactSchema = z.object({
  name: z.string(),
  whatsapp: z.string(),
  message: z.string(),
  honeypot: z.string().optional(),
});

export async function sendContactMessage(formData: z.infer<typeof contactSchema>) {
    const parsedData = contactSchema.safeParse(formData);

    if (!parsedData.success) {
        throw new Error('Invalid form data.');
    }

    if (parsedData.data.honeypot) {
        return { success: true };
    }
    
    const { name, whatsapp, message } = parsedData.data;

    try {
        // 1. Save to Database
        await prisma.contactMessage.create({
            data: {
                name,
                whatsapp,
                message,
            }
        });

        // 2. Send Email via Resend if API key exists
        if (resend) {
            await resend.emails.send({
                from: 'Letterhead Gen <onboarding@resend.dev>',
                to: 'faizan@texodus.tech',
                subject: `New Contact Message from ${name}`,
                html: `
                    <h1>New Contact Message</h1>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>WhatsApp:</strong> ${whatsapp}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                `,
            });
        } else {
            console.warn('RESEND_API_KEY not found. Email not sent, but message saved to database.');
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to process contact message:', error);
        throw new Error('Failed to send message. Please try again later.');
    }
}

export async function getContactMessages() {
    return prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });
}
