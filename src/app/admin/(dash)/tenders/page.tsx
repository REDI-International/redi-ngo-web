import { redirect } from "next/navigation";

export default function TendersRedirect() {
  redirect("/admin/opportunities?type=tender");
}
