"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import type { Status } from "@/lib/types";

// Update a row's review status. Called from the detail modal's three action
// buttons (Annehmen / Ablehnen / Zu oft verwendet). After the update the
// inbox is revalidated so the row leaves the current (open) queue.
export async function updateStatus(link: string, status: Status) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("final_results")
    .update({ status })
    .eq("link", link);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/");
  return { ok: true as const };
}
