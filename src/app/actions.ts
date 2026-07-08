"use server";

import { getSupabase } from "@/lib/supabase";
import type { Status } from "@/lib/types";

// Update a row's review status. Called from the swipe deck (accept / decline /
// decrease + undo) and from the review-grid detail modal. The caller decides
// how to refresh its own view (the deck manages its queue client-side; the
// review grid calls router.refresh()), so this action stays a pure write.
export async function updateStatus(link: string, status: Status) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("final_results")
    .update({ status })
    .eq("link", link);

  if (error) {
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const };
}
