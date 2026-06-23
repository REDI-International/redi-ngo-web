"use client";

import { useActionState } from "react";
import Image from "next/image";
import { changePassword, type AuthState } from "@/lib/admin/auth-actions";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<AuthState | undefined, FormData>(changePassword, undefined);

  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-[#1d1d1f]">New password</span>
        <input
          type="password"
          name="password"
          required
          minLength={10}
          autoComplete="new-password"
          className="admin-input mt-1.5"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-[#1d1d1f]">Confirm password</span>
        <input
          type="password"
          name="confirm"
          required
          minLength={10}
          autoComplete="new-password"
          className="admin-input mt-1.5"
        />
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="admin-btn-primary w-full justify-center">
        {pending ? "Updating…" : "Set new password"}
      </button>
    </form>
  );
}
