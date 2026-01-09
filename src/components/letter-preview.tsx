'use client';

import { forwardRef } from 'react';
import Image from 'next/image';

import type { LetterDetails } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';

interface LetterPreviewProps {
  details: LetterDetails;
  signature: string | null;
}

export const LetterPreview = forwardRef<HTMLDivElement, LetterPreviewProps>(
  ({ details, signature }, ref) => {

    return (
      <div
        ref={ref}
        className="w-full h-full bg-white text-slate-900 overflow-hidden flex flex-col font-serif"
      >
        <ScrollArea className="flex-grow">
          <div className="min-h-full flex flex-col p-6 md:p-12">
            {/* Header */}
            <header className="flex items-start justify-between pb-6 md:pb-8 border-b-2 border-primary gap-4">
                <div className="flex items-center gap-6">
                  {details.companyLogo && (
                    <Image
                      src={details.companyLogo}
                      alt="Company Logo"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  )}
                  <div>
                    <h2 className="font-sans text-3xl md:text-4xl font-bold text-slate-900">{details.companyName || "Your Company"}</h2>
                    <p className="font-sans text-sm md:text-base text-slate-500 mt-1">{details.companyAddress || "123 Business Rd, Business City"}</p>
                  </div>
                </div>
            </header>
            
            {/* Body */}
            <main className="flex-grow pt-8 md:pt-10">
              <div className="whitespace-pre-wrap leading-relaxed text-slate-800 font-sans text-sm md:text-base">
                {details.letterBody
                  .replace(/\[Recipient Name\]/g, details.employerName || "[Recipient Name]")
                  .replace(/\[Recipient Designation\]/g, details.employerDesignation || "[Recipient Designation]")
                  || "Start writing your letter body here."}
              </div>
            </main>
          
            {/* Footer */}
            <footer className="pt-10 md:pt-12 mt-auto">
              <div className='flex justify-between items-end'>
                <div>
                  {signature && (
                    <div className="mb-4 h-16 md:h-20 w-36 md:w-48 relative">
                        <Image src={signature} alt="Signature" fill style={{objectFit: 'contain', left: 0}} />
                    </div>
                  )}
                  <p className="font-sans font-bold text-sm md:text-base">{details.employeeName || "Your Name"}</p>
                  <p className="font-sans text-xs md:text-sm text-slate-500">{details.employeeTitle || "Your Title"}</p>
                </div>
                 <div className="text-right font-sans text-xs text-slate-500 space-y-1 flex-shrink-0">
                  <p>{details.employeeEmail || "youremail@example.com"}</p>
                  <p>{details.employeePhone || "(123) 456-7890"}</p>
                  <p>{details.employeeWebsite || "www.your-website.com"}</p>
                </div>
              </div>
            </footer>
          </div>
        </ScrollArea>
      </div>
    );
  }
);
LetterPreview.displayName = 'LetterPreview';
