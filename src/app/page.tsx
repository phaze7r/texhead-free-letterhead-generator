'use client';

import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { LetterForm } from '@/components/letter-form';
import { LetterPreview } from '@/components/letter-preview';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import type { LetterDetails } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const initialDetails: LetterDetails = {
  companyName: 'Texodus',
  companyAddress: '123 Business Rd, Suite 100, Business City, 12345',
  companyLogo: null,
  letterBody: `This is to certify that [Employee Name] is an employee at our company.

This is a sample letter body. You can edit this text to suit your needs. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.

Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.

Sincerely,`,
  employeeName: 'Your Name',
  employeeTitle: 'Your Title',
  employeeEmail: 'youremail@example.com',
  employeeWebsite: 'www.texodus.tech',
};

export default function LetterGeneratorPage() {
  const [details, setDetails] = useState<LetterDetails>(initialDetails);
  const [signature, setSignature] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const element = letterRef.current;
    if (!element) return;
    
    setIsDownloading(true);
    
    try {
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
      <Card>
          <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
              <CardTitle className="font-headline text-center md:text-left">Letterhead Generator</CardTitle>
              <Button onClick={handleDownload} disabled={isDownloading} size="lg">
                {isDownloading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Download />
                )}
                Download PDF
              </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-2">
                <LetterForm
                  details={details}
                  setDetails={setDetails}
                  signature={signature}
                  setSignature={setSignature}
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
    </div>
  );
}
