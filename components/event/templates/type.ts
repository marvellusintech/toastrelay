import { ReactNode, Dispatch, SetStateAction } from "react";
import { EventDetails } from "@/types/response";

export interface EventTemplateProps {
  event: EventDetails;
  activeTab: "toasts" | "moments" | "thread";
  setActiveTab: Dispatch<SetStateAction<"toasts" | "moments" | "thread">>;
  children: ReactNode;
}