"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-primary">
      <form
        onSubmit={handleSubmit}
        className="bg-bg-secondary border border-border rounded-lg p-8 w-full max-w-sm"
      >
        <h1 className="font-heading text-2xl text-text-primary mb-6">
          Admin Login
        </h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <label className="block text-text-muted text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-bg-primary border border-border text-text-primary"
          required
        />

        <label className="block text-text-muted text-sm mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 rounded bg-bg-primary border border-border text-text-primary"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-2 rounded font-heading hover:opacity-90 transition"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </main>
  );
}
