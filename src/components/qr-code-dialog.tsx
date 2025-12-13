'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Download, Loader2 } from 'lucide-react';

interface QrCodeDialogProps {
  token: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QrCodeDialog({
  token,
  open,
  onOpenChange,
}: QrCodeDialogProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      QRCode.toDataURL(token, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0D1B2A',
          light: '#E0E1DD',
        },
      })
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [token]);

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `MediScan_Ai-Prescription-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">
            Secure Prescription QR Code
          </DialogTitle>
          <DialogDescription>
            This QR code is ready for your patient. It can be scanned a limited
            number of times.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4 bg-background rounded-md">
          {qrCodeUrl ? (
            <Image
              src={qrCodeUrl}
              alt="Generated QR Code"
              width={300}
              height={300}
            />
          ) : (
            <div className="h-[300px] w-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            onClick={handleDownload}
            disabled={!qrCodeUrl}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
