
import { SidebarProvider } from "@/components/ui/sidebar"; // Adjust imports based on your setup
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layouts/navbar";
import { AppSidebar } from "@/components/layouts/appSidebar";
import { MarketingAuthWrapper } from "@/components/MarketingAuthWrapper";


export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    // bg-gradient-to-b from-[#f4fbf9] to-[#ffffff]
    <div className="min-h-screen bg-[#FAF9F6]  antialiased text-neutral-900 flex flex-col">
      <MarketingAuthWrapper>

      {/* <TooltipProvider delayDuration={0}>
        <SidebarProvider defaultOpen={false}>
          <div className="flex flex-1 w-full">
            {/* Sidebar stays on the left on desktop*/}
            {/* <AppSidebar /> */}
   
            
            <main className="flex-1 w-full overflow-y-auto">
              {children}
            </main>
          {/* </div>
        </SidebarProvider>
      </TooltipProvider> */}
      </MarketingAuthWrapper>
    </div>
  );
}