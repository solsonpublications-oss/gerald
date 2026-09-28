"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Reads a `?unsubscribed=` query param (set by the unsubscribe API redirect)
 * and surfaces a toast, then cleans the URL.
 */
export function UnsubscribeHandler() {
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("unsubscribed");
    if (!status) return;

    if (status === "success") {
      toast({
        title: "Unsubscribed",
        description:
          "You've been removed from the newsletter. We're sorry to see you go.",
      });
    } else if (status === "invalid") {
      toast({
        title: "Invalid link",
        description: "The unsubscribe link was invalid. Please contact us.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Something went wrong",
        description: "Please try unsubscribing again or contact us.",
        variant: "destructive",
      });
    }

    // Clean the URL
    const url = new URL(window.location.href);
    url.searchParams.delete("unsubscribed");
    window.history.replaceState({}, "", url.toString());
  }, [toast]);

  return null;
}
