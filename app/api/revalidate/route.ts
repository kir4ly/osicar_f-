import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  revalidatePath("/", "page");
  revalidatePath("/autok", "page");
  return NextResponse.json({ revalidated: true });
}
