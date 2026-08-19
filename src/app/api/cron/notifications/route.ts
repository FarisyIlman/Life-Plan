import { NextResponse } from "next/server";
import { generateDeadlineNotifications } from "@/lib/actions/notification";

export async function GET(request: Request) {
  // Simple protection: require a secret in the query/header
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await generateDeadlineNotifications();
  return NextResponse.json(result);
}
