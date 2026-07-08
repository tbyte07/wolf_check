// Shape of a row in the Supabase `final_results` table.
export type Platform = "instagram" | "tiktok" | "youtube";

export type Status = "open" | "accepted" | "declined" | "decrease";

export interface FinalResult {
  link: string; // unique — the video URL
  plattform: Platform;
  titel: string;
  hypothese: string; // the specific false claim (main summary per card)
  views: number;
  likes: number;
  status: Status;
  gefunden_am: string; // timestamptz (ISO string)
}

export type SortKey = "views" | "likes" | "gefunden_am";

export const STATUS_LABELS: Record<Status, string> = {
  open: "Offen",
  accepted: "Angenommen",
  declined: "Abgelehnt",
  decrease: "Zu oft verwendet",
};

export const SORT_LABELS: Record<SortKey, string> = {
  views: "Views",
  likes: "Likes",
  gefunden_am: "Neueste",
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
};

// Brand-neutral dot colors used to identify platforms without reproducing
// any third-party logo (per the WolfCheck design guidelines).
export const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "#E1306C",
  tiktok: "#111111",
  youtube: "#FF0000",
};
