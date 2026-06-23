"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { signIn, type AuthState } from "@/lib/admin/auth-actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<AuthState | undefined, FormData>(
    signIn,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#1d1d1f]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="admin-input mt-1.5"
          placeholder="you@redi-ngo.eu"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#1d1d1f]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="admin-input mt-1.5"
        />
      </div>
      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <button type="submit" disabled={pending} className="admin-btn-primary w-full py-3">
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Continue"
        )}
      </button>
    </form>
  );
}
