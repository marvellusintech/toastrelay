
import { EventDetails } from "@/types/response";

export interface TemplateProps {
  event: EventDetails;
  formattedDate?: string;
  isCoverVideo: boolean;
  borderRadiusClass: string;
  customStyles: React.CSSProperties;
}