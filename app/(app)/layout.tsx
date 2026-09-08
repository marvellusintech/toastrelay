
import { MarketingAuthWrapper } from "@/components/MarketingAuthWrapper";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] antialiased text-neutral-900 flex flex-col">
      <MarketingAuthWrapper>{children}</MarketingAuthWrapper>
    </div>
  );
}