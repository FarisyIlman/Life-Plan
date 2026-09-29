import { NextResponse } from "next/server";
import { generateDeadlineNotifications } from "@/lib/notifications";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await generateDeadlineNotifications();
  return NextResponse.json(result);
}
