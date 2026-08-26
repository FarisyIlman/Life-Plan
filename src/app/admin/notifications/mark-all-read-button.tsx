"use client";

import { useRouter } from "next/navigation";
import { markAllNotificationsRead } from "@/lib/actions/notification";

export default function MarkAllReadButton() {
  const router = useRouter();

  const handleClick = async () => {
    await markAllNotificationsRead();
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      className="text-accent hover:underline text-sm"
    >
      Mark all as read
    </button>
  );
}
