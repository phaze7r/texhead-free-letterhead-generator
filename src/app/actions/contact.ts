'use server';

import { z } from 'zod';

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

    // Honeypot check for spam
    if (parsedData.data.honeypot) {
        // This is likely a bot. Silently fail.
        console.log('Bot submission detected.');
        return { success: true };
    }
    
    const { name, whatsapp, message } = parsedData.data;

    // Here you would typically use a service like Nodemailer, SendGrid, or Resend
    // to send an email. For this example, we'll just log it to the console.
    console.log('--- New Contact Message ---');
    console.log(`To: faizan@texodus.tech`);
    console.log(`From: ${name}`);
    console.log(`WhatsApp: ${whatsapp}`);
    console.log('Message:');
    console.log(message);
    console.log('---------------------------');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would handle potential errors from the email service
    // and throw an error if the email failed to send.
    
    return { success: true };
}
