import type { Metadata } from "next";
import { PreferencesPage } from "@/components/preferences-page";

export const metadata: Metadata = {
  title: "Newsletter Preferences — Rounds of a Lifetime",
  description:
    "Manage your newsletter subscription — subscribe, unsubscribe, or update your email.",
  robots: { index: false, follow: false },
};

export default function PreferencesRoute() {
  return <PreferencesPage />;
}
