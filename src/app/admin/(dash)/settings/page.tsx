import { listSettings } from "@/db/queries";
import { PageHeader } from "@/components/admin/ui";
import { SettingsPanel } from "@/components/admin/SettingsPanel";

export default async function SettingsAdminPage() {
  const settings = await listSettings();
  return (
    <>
      <PageHeader
        title="Site settings"
        description="Hero text, social links, and custom configuration."
      />
      <SettingsPanel settings={settings} />
    </>
  );
}
