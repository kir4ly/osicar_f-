import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

// Max size for an already-optimized upload (client downsized + compressed it).
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
// Max size for a raw original the client could not process (e.g. a big HEIC
// from a desktop browser). The server resizes/compresses it, so we accept more.
const MAX_RAW_BYTES = 40 * 1024 * 1024; // 40 MB

// Final stored image: longest side, WebP quality. Mirrors the client optimizer
// so a server-converted image is the same size/format as a client-converted one.
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 75;

// Allowed content-types for the already-optimized path -> stored extension.
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function isHeic(type: string, name: string): boolean {
  const n = name.toLowerCase();
  return (
    type === "image/heic" ||
    type === "image/heif" ||
    n.endsWith(".heic") ||
    n.endsWith(".heif")
  );
}

// Store a buffer in Supabase Storage and return its public URL.
async function store(buffer: Buffer | ArrayBuffer, ext: string, contentType: string) {
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const filePath = `car-images/${fileName}`;

  const { error: uploadError } = await getSupabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .upload(filePath, buffer, { contentType, upsert: false });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data } = getSupabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return { url: data.publicUrl, path: filePath };
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    // The client sets this when its own in-browser optimization failed (typically
    // a large HEIC on a desktop browser): the server then decodes + resizes.
    const serverOptimize = formData.get("mode") === "server-optimize";

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }

    const fileName = file instanceof File ? file.name : "";

    // --- Server-side optimization path (raw original) ---------------------
    if (serverOptimize) {
      if (file.size > MAX_RAW_BYTES) {
        return NextResponse.json(
          { error: "A kép túl nagy (max 40 MB)." },
          { status: 413 }
        );
      }

      const inputBuffer = Buffer.from(await file.arrayBuffer());

      // HEIC/HEIF: decode to JPEG first (sharp's prebuilt binary cannot decode
      // HEIC), then let sharp resize/compress the JPEG below.
      let decoded = inputBuffer;
      if (isHeic(file.type, fileName)) {
        const convert = (await import("heic-convert")).default;
        const jpeg = await convert({
          buffer: inputBuffer as unknown as ArrayBufferLike,
          format: "JPEG",
          quality: 0.92,
        });
        decoded = Buffer.from(jpeg);
      }

      const sharp = (await import("sharp")).default;
      const webp = await sharp(decoded)
        .rotate() // honour EXIF orientation
        .resize({
          width: MAX_DIMENSION,
          height: MAX_DIMENSION,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();

      const result = await store(webp, "webp", "image/webp");
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json(result);
    }

    // --- Already-optimized path (client downsized + compressed) -----------
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "A kép túl nagy (max 8 MB). Optimalizálás kötelező feltöltés előtt." },
        { status: 413 }
      );
    }

    // Trust the actual blob type (set by the client's canvas encoder) so the
    // stored content-type and extension always match the real bytes.
    const contentType = file.type || "image/jpeg";
    const ext = ALLOWED_TYPES[contentType];
    if (!ext) {
      return NextResponse.json(
        { error: `Nem támogatott képformátum: ${contentType}` },
        { status: 415 }
      );
    }

    const result = await store(await file.arrayBuffer(), ext, contentType);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
