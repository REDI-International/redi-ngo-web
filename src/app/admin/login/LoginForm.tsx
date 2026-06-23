"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/lib/admin/auth-actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<AuthState | undefined, FormData>(
    signIn,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 w-full rounded-lg border border-surface-dark bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-lg border border-surface-dark bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
