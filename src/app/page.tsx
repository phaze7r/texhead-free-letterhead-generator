'use client';

import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { LetterForm } from '@/components/letter-form';
import { LetterPreview } from '@/components/letter-preview';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import type { LetterDetails } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getSeoSettings } from '@/app/actions/seo';
import { incrementCounter } from '@/app/actions/stats';
import { StatsBanner } from '@/components/stats-banner';
import { useToast } from '@/hooks/use-toast';

const initialDetails: LetterDetails = {
  companyName: '',
  companyAddress: '',
  companyLogo: null,
  letterBody: '',
  employeeName: '',
  employeeTitle: '',
  employeeEmail: '',
  employeePhone: '',
  employeeWebsite: '',
  employerName: '',
  employerDesignation: '',
};

export default function LetterGeneratorPage() {
  const [details, setDetails] = useState<LetterDetails>(initialDetails);
  const [signature, setSignature] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);
  
  // Fetch stats on client side or pass as prop
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSeoSettings().then(setSettings);
  }, []);

  const { toast } = useToast();

  const handleDownload = async () => {
    // Validation
    const requiredFields = [
      { key: 'companyName', label: 'Company Name' },
      { key: 'companyAddress', label: 'Company Address' },
      { key: 'employeeName', label: 'Your Name' },
      { key: 'employeeTitle', label: 'Your Title' },
      { key: 'employeeEmail', label: 'Your Email' },
      { key: 'letterBody', label: 'Letter Body' },
      { key: 'employerName', label: 'Recipient Name' },
      { key: 'employerDesignation', label: 'Recipient Designation' },
    ];

    const missingFields = requiredFields.filter(field => !details[field.key as keyof LetterDetails]);

    if (missingFields.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: `Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`,
      });
      return;
    }

    if (!signature) {
      toast({
        variant: 'destructive',
        title: 'Signature Required',
        description: 'Please add your signature before downloading.',
      });
      return;
    }

    const element = letterRef.current;
    if (!element) return;
    
    setIsDownloading(true);
    
    try {
        await incrementCounter(details);
        const canvas = await html2canvas(element as HTMLElement, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#ffffff',
            height: element.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasAspectRatio = canvas.width / canvas.height;
        let finalWidth = pdfWidth;
        let finalHeight = finalWidth / canvasAspectRatio;

        if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = finalHeight * canvasAspectRatio;
        }

        const xOffset = (pdfWidth - finalWidth) / 2;
        const yOffset = 0;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
        pdf.save('letterhead.pdf');
    } catch (error) {
        console.error("Failed to generate PDF", error);
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-4xl mx-auto text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-headline">
            Free Online Letterhead Generator
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Create professional, customized business letterheads in minutes. 
            Upload your logo, add your details, and download a print-ready PDF—completely for free.
        </p>
      </div>

      <Card>
          <CardHeader>
              <CardTitle className="font-headline text-center md:text-left">Configure Your Letterhead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-2">
                <LetterForm
                  details={details}
                  setDetails={setDetails}
                  signature={signature}
                  setSignature={setSignature}
                  handleDownload={handleDownload}
                  isDownloading={isDownloading}
                />
              </div>
              <div className="md:col-span-3 flex justify-center md:justify-start">
                <div className="w-full max-w-full md:max-w-3xl aspect-[210/297] shadow-lg">
                    <LetterPreview ref={letterRef} details={details} signature={signature} />
                </div>
              </div>
            </div>
          </CardContent>
      </Card>

      {settings?.showCounter && (
        <StatsBanner total={settings.totalGenerated} />
      )}
    </div>
  );
}
