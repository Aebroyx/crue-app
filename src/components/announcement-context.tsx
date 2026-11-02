"use client";

import { createContext, useContext } from "react";
import { announcementFallback, type Announcement } from "@/lib/announcement";

const AnnouncementContext = createContext<Announcement | null>(null);

export function AnnouncementProvider({
  announcement,
  children,
}: {
  announcement: Announcement;
  children: React.ReactNode;
}) {
  return <AnnouncementContext.Provider value={announcement}>{children}</AnnouncementContext.Provider>;
}

export function useAnnouncement() {
  return useContext(AnnouncementContext) ?? announcementFallback;
}
