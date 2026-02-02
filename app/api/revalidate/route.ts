import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  revalidatePath("/", "page");
  revalidatePath("/autok", "page");
  return NextResponse.json({ revalidated: true });
}
