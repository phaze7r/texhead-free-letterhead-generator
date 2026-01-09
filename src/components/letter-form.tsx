'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { LetterDetails } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { LogoUpload } from './logo-upload';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';

const SignaturePad = dynamic(() => import('./signature-pad').then(mod => mod.SignaturePad), {
  ssr: false,
  loading: () => (
    <div className="space-y-2">
      <Label>Your Signature</Label>
      <Skeleton className="h-56 w-full" />
    </div>
  ),
});


import { Button } from './ui/button';
import { Download, Loader2, RefreshCw } from 'lucide-react';
import { placeholderTemplates } from '@/lib/placeholders';

interface LetterFormProps {
  details: LetterDetails;
  setDetails: React.Dispatch<React.SetStateAction<LetterDetails>>;
  signature: string | null;
  setSignature: React.Dispatch<React.SetStateAction<string | null>>;
  handleDownload: () => Promise<void>;
  isDownloading: boolean;
}

export function LetterForm({ details, setDetails, signature, setSignature, handleDownload, isDownloading }: LetterFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setLogo = (logo: string | null) => {
    setDetails(prev => ({ ...prev, companyLogo: logo }));
  }

  const handleRegen = () => {
    const randomTemplate = placeholderTemplates[Math.floor(Math.random() * placeholderTemplates.length)];
    setDetails(prev => ({ 
      ...prev, 
      employerName: randomTemplate.employerName,
      employerDesignation: randomTemplate.employerDesignation,
      letterBody: randomTemplate.letterBody 
    }));
  };

  return (
    <Card className='border-none shadow-none'>
      <CardHeader className="px-0 pt-0">
        <CardTitle className="font-headline">Letter Content</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
            <div className="space-y-6">
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-medium">Company Details</h3>
                    <LogoUpload logo={details.companyLogo} setLogo={setLogo} />
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name <span className="text-destructive">*</span></Label>
                        <Input id="companyName" name="companyName" value={details.companyName} onChange={handleChange} placeholder="e.g. Texodus Tech Solutions" required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyAddress">Company Address <span className="text-destructive">*</span></Label>
                        <Input id="companyAddress" name="companyAddress" value={details.companyAddress} onChange={handleChange} placeholder="e.g. 123 Business Rd, Suite 100, City" required/>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-medium">Your Details (Sender)</h3>
                   <div className="space-y-2">
                    <Label htmlFor="employeeName">Your Name <span className="text-destructive">*</span></Label>
                    <Input id="employeeName" name="employeeName" value={details.employeeName} onChange={handleChange} placeholder="e.g. John Doe" required />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="employeeTitle">Your Title <span className="text-destructive">*</span></Label>
                    <Input id="employeeTitle" name="employeeTitle" value={details.employeeTitle} onChange={handleChange} placeholder="e.g. CEO / Manager" required />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="employeeEmail">Your Email <span className="text-destructive">*</span></Label>
                    <Input id="employeeEmail" name="employeeEmail" value={details.employeeEmail} onChange={handleChange} placeholder="e.g. youremail@example.com" required />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="employeePhone">Your Phone</Label>
                    <Input id="employeePhone" name="employeePhone" value={details.employeePhone} onChange={handleChange} placeholder="e.g. (123) 456-7890" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="employeeWebsite">Your Website</Label>
                    <Input id="employeeWebsite" name="employeeWebsite" value={details.employeeWebsite} onChange={handleChange} placeholder="e.g. www.your-website.com" />
                    </div>
                </div>

                <Separator />

                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-medium">Recipient Details</h3>
                   <div className="space-y-2">
                    <Label htmlFor="employerName">Recipient Name <span className="text-destructive">*</span></Label>
                    <Input id="employerName" name="employerName" value={details.employerName} onChange={handleChange} placeholder="e.g. Jane Smith" required />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="employerDesignation">Recipient Designation <span className="text-destructive">*</span></Label>
                    <Input id="employerDesignation" name="employerDesignation" value={details.employerDesignation} onChange={handleChange} placeholder="e.g. Software Engineer" required />
                    </div>
                </div>

                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="letterBody">Letter Body <span className="text-destructive">*</span></Label>
                    <Button variant="ghost" size="sm" onClick={handleRegen} className="h-8 text-xs flex items-center gap-1 hover:bg-primary/10">
                      <RefreshCw className="h-3 w-3" />
                      Shuffle Template Versions
                    </Button>
                  </div>
                  <Textarea id="letterBody" name="letterBody" value={details.letterBody} onChange={handleChange} rows={10} placeholder="Type your letter content here... Use [Recipient Name] as a placeholder." required />
                </div>
                
                <SignaturePad signature={signature} setSignature={setSignature} employeeName={details.employeeName} />

                <Button 
                    onClick={handleDownload} 
                    disabled={isDownloading} 
                    size="lg" 
                    className="w-full h-14 text-lg font-bold shadow-lg"
                >
                    {isDownloading ? (
                        <Loader2 className="animate-spin mr-2" />
                    ) : (
                        <Download className="mr-2" />
                    )}
                    Generate & Download PDF
                </Button>
            </div>
      </CardContent>
    </Card>
  );
}
