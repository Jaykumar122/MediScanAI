import CreatePrescriptionForm from '@/components/create-prescription-form';
import { AppSidebar } from "@/components/ui/app-sidebar1"
import { SiteHeader } from "@/components/site-header1"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


export default function Home() {
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
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="font-headline text-2xl font-bold tracking-tighter sm:text-5xl md:text-3xl">
          Create a New Prescription
        </h1>
      </div>
      <CreatePrescriptionForm />
    </div>
    </SidebarInset>
    </SidebarProvider>
  );
}
