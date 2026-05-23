import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-auth";

// Defense-in-depth validation mirroring the client-side guard, so a car can
// never be persisted without at least one image (the cause of blank
// placeholder cards on the public site).
function validateCarPayload(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return "Érvénytelen adat";
  const car = data as Record<string, unknown>;

  if (typeof car.brand !== "string" || car.brand.trim() === "")
    return "A márka megadása kötelező";
  if (typeof car.model !== "string" || car.model.trim() === "")
    return "A modell megadása kötelező";

  if (!Array.isArray(car.images) || car.images.length === 0)
    return "Legalább egy kép kötelező";
  if (!car.images.every((u) => typeof u === "string" && u.trim() !== ""))
    return "Érvénytelen kép URL";

  return null;
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const carData = await request.json();

    const validationError = validateCarPayload(carData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("cars")
      .insert([carData])
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
