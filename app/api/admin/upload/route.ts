import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const maxDuration = 30;

// Max accepted upload size. The client downsizes/compresses before sending,
// so anything larger than this is almost certainly an un-optimized original.
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

// Allowed image content-types -> file extension used in storage.
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "A kép túl nagy (max 8 MB). Optimalizálás kötelező feltöltés előtt." },
        { status: 413 }
      );
    }

    // Trust the actual blob type (set by the client's canvas encoder), not a
    // hardcoded value, so the stored content-type and extension always match
    // the real bytes. A mismatch is a common cause of images failing to render.
    const contentType = file.type || "image/jpeg";
    const ext = ALLOWED_TYPES[contentType];
    if (!ext) {
      return NextResponse.json(
        { error: `Nem támogatott képformátum: ${contentType}` },
        { status: 415 }
      );
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const filePath = `car-images/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await getSupabaseAdmin().storage
      .from(STORAGE_BUCKET)
      .upload(filePath, arrayBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    const { data: publicUrlData } = getSupabaseAdmin().storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrlData.publicUrl, path: filePath });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
