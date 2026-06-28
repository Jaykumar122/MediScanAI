import QrScanner from '@/components/qr-scanner';
import { AppSidebar } from "@/components/ui/app-sidebar2"
import { SiteHeader } from "@/components/site-header2"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function ScanPage() {
  return (
    <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Scan Prescription
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
          Position the QR code within the frame to securely view the prescription details.
        </p>
      </div>
      <QrScanner />
    </div>
    </SidebarInset>
    </SidebarProvider>
  );
}
