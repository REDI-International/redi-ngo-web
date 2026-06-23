import { LoadingSkeleton } from "@/components/admin/ui";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="admin-skeleton h-10 w-64" />
      <div className="admin-skeleton h-5 w-96" />
      <LoadingSkeleton rows={6} />
    </div>
  );
}
