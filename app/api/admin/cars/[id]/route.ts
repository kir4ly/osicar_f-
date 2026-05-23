import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

// Public storage URLs look like
// `<project>/storage/v1/object/public/<bucket>/car-images/<file>`.
// Extract the in-bucket path (`car-images/<file>`) so it can be removed.
// Returns null for anything that isn't an uploaded image in our bucket
// (e.g. the relative `/placeholder-car.jpg` fallback), so we never try to
// delete files we don't own.
function storagePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  try {
    return decodeURIComponent(url.slice(idx + marker.length));
  } catch {
    return url.slice(idx + marker.length);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    const updates = await request.json();
    const { data, error } = await getSupabaseAdmin()
      .from("cars")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ car: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid request" },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  // Read the image URLs before deleting the row so we know which storage
  // objects to clean up afterwards.
  const { data: existing } = await supabase
    .from("cars")
    .select("images")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("cars").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Best-effort: remove the car's uploaded images from Storage. A failure
  // here leaves orphaned files but must not fail the (already done) deletion.
  const images: string[] = existing?.images ?? [];
  const paths = images
    .map(storagePathFromUrl)
    .filter((p): p is string => p !== null);
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(paths);
    if (storageError) {
      console.error("Failed to remove car images from storage:", storageError.message);
    }
  }

  return NextResponse.json({ success: true });
}
