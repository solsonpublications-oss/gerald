import type { Metadata } from "next";
import { SpeakingPage } from "@/components/speaking-page";

export const metadata: Metadata = {
  title: "Speaking Engagements — Robert Y. Wright, MD",
  description:
    "Invite Robert Y. Wright, MD to speak at your medical school, conference, or book club. Keynotes on resilience, medicine, and the call to healing.",
};

export default function SpeakingRoute() {
  return <SpeakingPage />;
}
