'use client';
import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Trash2, Upload, Sparkles, Pencil, RefreshCw, Save } from 'lucide-react';
import Image from 'next/image';

interface SignaturePadProps {
  signature: string | null;
  setSignature: (signature: string | null) => void;
  employeeName: string;
}

export function SignaturePad({ signature, setSignature, employeeName }: SignaturePadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setSignature(dataUri);
        setIsLoading(false);
        toast({
            title: "Success",
            description: "Signature uploaded successfully!",
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

  const handleGenerateSignature = () => {
    if (!employeeName) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter your name before generating a signature.',
      });
      return;
    }
    setIsLoading(true);
    
    setTimeout(() => {
        try {
            const canvas = document.createElement('canvas');
            const canvasWidth = 400;
            const canvasHeight = 150;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                // Keep background transparent for the PNG
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#063970'; // Blue ink color
                
                const randomAngle = (Math.random() - 0.5) * 0.1;
                const randomSize = 50 + (Math.random() - 0.5) * 10;
                const randomYOffset = (Math.random() - 0.5) * 10;

                ctx.font = `italic ${randomSize}px 'Caveat', cursive`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(randomAngle);
                
                ctx.fillText(employeeName, 0, randomYOffset);

                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            
            const dataUri = canvas.toDataURL('image/png');
            setSignature(dataUri);

            toast({
                title: "Success",
                description: "Signature generated successfully!",
                className: "bg-accent text-accent-foreground",
            });

        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to generate signature. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }, 50);
  }

  const handleClear = () => {
    setSignature(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (sigCanvas.current) {
        sigCanvas.current.clear();
    }
  };

  const saveSignature = () => {
    if (sigCanvas.current) {
      if (sigCanvas.current.isEmpty()) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please draw your signature before saving.',
        });
        return;
      }
      const dataUri = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      setSignature(dataUri);
      toast({
        title: "Success",
        description: "Signature saved!",
        className: "bg-accent text-accent-foreground",
    });
    }
  }

  return (
    <div className="space-y-2">
      <Label>Your Signature</Label>
      <Card className="border-dashed">
        <CardContent className="p-4 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Please wait...</p>
            </div>
          ) : signature ? (
            <div className="relative group w-fit mx-auto">
              <Image src={signature} alt="Signature" width={200} height={100} className="mx-auto object-contain h-24" />
              <div className="absolute -top-2 -right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100">
                <Button
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={handleClear}
                    title="Remove Signature"
                  >
                    <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={handleGenerateSignature}
                    title="Regenerate Signature"
                  >
                    <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="draw" className="w-full">
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value="draw"><Pencil className="h-4 w-4 mr-2" /> Draw</TabsTrigger>
                    <TabsTrigger value="type"><Sparkles className="h-4 w-4 mr-2" /> Type</TabsTrigger>
                    <TabsTrigger value="upload"><Upload className="h-4 w-4 mr-2" /> Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="draw" className="mt-4">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor='#063970'
                            canvasProps={{ className: 'bg-white border rounded-md w-full h-[150px]' }}
                        />
                         <div className="flex gap-2">
                            <Button type="button" size="sm" onClick={() => sigCanvas.current?.clear()}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                            <Button type="button" size="sm" variant="secondary" onClick={saveSignature}>
                                <Save className="mr-2 h-4 w-4" />
                                Save
                            </Button>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="type" className="mt-4">
                    <div className="flex flex-col items-center justify-center space-y-2 h-[182px]">
                        <p className="text-sm text-muted-foreground text-center mb-2">Auto-generate a signature from your name below.</p>
                        <Button type="button" size="sm" variant="secondary" onClick={handleGenerateSignature}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Signature
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                    <div className="flex flex-col items-center justify-center space-y-2 h-[182px]">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload your signature image</p>
                      <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Browse file
                      </Button>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                      />
                    </div>
                </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
