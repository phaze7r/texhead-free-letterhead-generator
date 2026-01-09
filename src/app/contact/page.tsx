import { ContactForm } from '@/components/contact-form';
import { Mail, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-headline font-bold">Get in Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions about our letterhead generator? We're here to help. Reach out to us via the form or through our direct contact channels.
          </p>
          
          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-sm text-muted-foreground">Email us at</p>
                <p className="text-lg">faizan@texodus.tech</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-sm text-muted-foreground">Call us at</p>
                <p className="text-lg">+92 302 98811396</p>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-md">
                <a 
                  href="https://wa.me/923029811396" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-5 w-5 fill-current" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card p-8 rounded-xl border shadow-sm">
          <h2 className="text-2xl font-headline font-semibold mb-6">Send a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
