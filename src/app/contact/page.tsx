import { ContactForm } from '@/components/contact-form';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-headline font-bold text-center">Contact Us</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Have a question or want to work with us? Fill out the form below.
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
