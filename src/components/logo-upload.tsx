'use client';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';

interface LogoUploadProps {
  logo: string | null;
  setLogo: (logo: string | null) => void;
}

export function LogoUpload({ logo, setLogo }: LogoUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setLogo(dataUri);
        setIsLoading(false);
        toast({
            title: "Success",
            description: "Logo uploaded successfully!",
            className: "bg-accent text-accent-foreground",
        });
      };
      reader.onerror = () => {
        setIsLoading(false);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to read file.',
          });
      }
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>Company Logo</Label>
      <Card className="border-dashed">
        <CardContent className="p-4 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Uploading logo...</p>
            </div>
          ) : logo ? (
            <div className="relative group w-fit mx-auto">
              <Image src={logo} alt="Company Logo" width={100} height={100} className="mx-auto object-contain h-24" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
                onClick={handleClear}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 h-24">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Upload your company logo</p>
              <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
                Browse file
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={handleFileChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
