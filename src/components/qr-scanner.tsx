'use client';

import { useEffect, useState, useTransition, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { getPrescription } from '@/lib/actions';
import type { Prescription } from '@/lib/definitions';
import PrescriptionDisplay from './prescription-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ScanLine, AlertCircle, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';


const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
    const minEdgePercentage = 0.7;
    const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    return {
        width: qrboxSize,
        height: qrboxSize,
    };
};


export default function QrScanner() {
  const [scanResult, setScanResult] = useState<Prescription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerId = "reader";
  const processing = useRef(false);

  const onScanSuccess = (decodedText: string) => {
    if (processing.current) return;
    processing.current = true;
    
    if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
    }

    startTransition(async () => {
      try {
        const result = await getPrescription(decodedText);
        if (result.success && result.data) {
          setScanResult(result.data);
        } else {
          setError(result.error || 'Failed to retrieve prescription.');
        }
      } catch (e: any) {
        setError(e.message || 'An unexpected error occurred.');
      } finally {
        // processing.current is reset on "Scan Again"
      }
    });
  };

  const onScanFailure = (errorMessage: string) => {
    // This is called frequently, so we can ignore it to avoid spamming logs.
    // The library handles drawing the viewfinder, etc.
  };

  useEffect(() => {
    if (hasCameraPermission === null) {
      Html5Qrcode.getCameras()
        .then(cameras => {
          if (cameras && cameras.length) {
            setHasCameraPermission(true);
          } else {
            setHasCameraPermission(false);
          }
        })
        .catch(() => {
          setHasCameraPermission(false);
        });
    }

    if (hasCameraPermission) {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(readerId, false);
      }
      
      const scanner = scannerRef.current;

      if (scanner && !scanner.isScanning && !scanResult && !error) {
        scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: qrboxFunction },
          onScanSuccess,
          onScanFailure
        ).catch(err => {
            setError('Failed to start scanner. Please ensure camera permissions are granted and try again.');
            console.error("Scanner start error:", err);
            setHasCameraPermission(false);
        });
      }
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
          // This can sometimes fail on component unmount, it's safe to ignore.
        });
      }
    };
  }, [hasCameraPermission, scanResult, error]);

  const handleScanAgain = () => {
    setScanResult(null);
    setError(null);
    processing.current = false;
    // The useEffect will handle restarting the scanner.
  };

  if (hasCameraPermission === null) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="font-semibold">Initializing Scanner...</p>
        <p className="text-sm text-muted-foreground">Checking for camera access.</p>
      </div>
    );
  }

  if (hasCameraPermission === false) {
    return (
      <Alert variant="destructive">
        <Camera className="h-4 w-4" />
        <AlertTitle>Camera Access Required</AlertTitle>
        <AlertDescription>
          Camera access is required to scan QR codes. Please grant permission in your browser settings and refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden bg-background" style={{ display: scanResult || isPending || error ? 'none' : 'block' }}>
            <div id={readerId} className="w-full h-full"></div>
        </div>

        {isPending && (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="font-semibold">Decrypting and Verifying...</p>
                <p className="text-sm text-muted-foreground">Please wait a moment.</p>
            </div>
        )}

        {error && !isPending && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Scan Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button variant="secondary" onClick={handleScanAgain} className="mt-4">
                    Scan Again
                </Button>
            </Alert>
        )}

        {scanResult && !isPending && (
            <>
                <PrescriptionDisplay prescription={scanResult} />
                <Button onClick={handleScanAgain} className="w-full mt-6">
                    <ScanLine className="mr-2 h-4 w-4" />
                    Scan Another QR Code
                </Button>
            </>
        )}
    </div>
  );
}
