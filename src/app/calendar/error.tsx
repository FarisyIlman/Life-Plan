"use client";

export default function CalendarError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary px-6 pt-24 pb-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="font-heading text-3xl mb-3">Calendar unavailable</h1>
        <p className="text-text-muted mb-6">
          We could not load the public calendar right now. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="bg-accent text-white px-4 py-2 rounded hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
