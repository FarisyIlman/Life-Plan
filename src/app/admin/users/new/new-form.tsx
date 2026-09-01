"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminUser } from "@/lib/actions/admin-user";

export default function NewAdminForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors({});

    const res = await createAdminUser(formData);

    setLoading(false);

    if (res?.error) {
      setErrors(res.error);
      return;
    }

    router.push("/admin/users");
  };

  return (
    <form action={handleSubmit} className="max-w-lg space-y-4">
      {errors._form && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded p-3">
          {errors._form[0]}
        </p>
      )}

      <div>
        <label className="block text-text-muted text-sm mb-1">Name</label>
        <input
          name="name"
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-1">Email</label>
        <input
          name="email"
          type="email"
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-1">Username</label>
        <input
          name="username"
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        />
        {errors.username && (
          <p className="text-red-400 text-sm mt-1">{errors.username[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-text-muted text-sm mb-1">Password</label>
        <input
          name="password"
          type="password"
          className="w-full p-2 rounded bg-bg-secondary border border-border text-text-primary"
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-white px-6 py-2 rounded font-heading hover:opacity-90"
      >
        {loading ? "Creating..." : "Create Admin"}
      </button>
    </form>
  );
}
