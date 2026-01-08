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


interface LetterFormProps {
  details: LetterDetails;
  setDetails: React.Dispatch<React.SetStateAction<LetterDetails>>;
  signature: string | null;
  setSignature: React.Dispatch<React.SetStateAction<string | null>>;
}

export function LetterForm({ details, setDetails, signature, setSignature }: LetterFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setLogo = (logo: string | null) => {
    setDetails(prev => ({ ...prev, companyLogo: logo }));
  }

  return (
    <Card className='border-none shadow-none'>
      <CardHeader>
        <CardTitle className="font-headline">Letter Content</CardTitle>
      </CardHeader>
      <CardContent className="pl-0 pr-2">
        <ScrollArea className="h-auto md:h-[calc(100vh-20rem)] pr-4">
            <div className="space-y-6">
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-medium">Company Details</h3>
                    <LogoUpload logo={details.companyLogo} setLogo={setLogo} />
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" name="companyName" value={details.companyName} onChange={handleChange} placeholder="Your Company"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyAddress">Company Address</Label>
                        <Input id="companyAddress" name="companyAddress" value={details.companyAddress} onChange={handleChange} placeholder="123 Business Rd, Suite 100"/>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-medium">Your Details</h3>
                   <div className="space-y-2">
                    <Label htmlFor="employeeName">Your Name</Label>
                    <Input id="employeeName" name="employeeName" value={details.employeeName} onChange={handleChange} placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="employeeTitle">Your Title</Label>
                    <Input id="employeeTitle" name="employeeTitle" value={details.employeeTitle} onChange={handleChange} placeholder="Your Title" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="employeeEmail">Your Email</Label>
                    <Input id="employeeEmail" name="employeeEmail" value={details.employeeEmail} onChange={handleChange} placeholder="youremail@example.com" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="employeeWebsite">Your Website</Label>
                    <Input id="employeeWebsite" name="employeeWebsite" value={details.employeeWebsite} onChange={handleChange} placeholder="www.your-website.com" />
                    </div>
                </div>

                <Separator />
                
                <div className="space-y-2">
                <Label htmlFor="letterBody">Body</Label>
                <Textarea id="letterBody" name="letterBody" value={details.letterBody} onChange={handleChange} rows={10} placeholder="Dear Recipient Name,..." />
                </div>
                
                <SignaturePad signature={signature} setSignature={setSignature} employeeName={details.employeeName} />
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
