"use client";

import { useRouter } from "next/navigation";
import { markNotificationRead } from "@/lib/actions/notification";

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();

  const handleClick = async () => {
    await markNotificationRead(id);
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      className="text-accent text-sm hover:underline whitespace-nowrap ml-4"
    >
      Mark as read
    </button>
  );
}
