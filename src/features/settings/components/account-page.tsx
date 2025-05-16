import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { ChangeNameForm } from "@/features/settings/components/change-name-form";

export async function SettingsAccountPage() {
  return (
    <>
      <SettingsPageHeader
        title="Account"
        description="Update your account settings."
      />

      <ChangeNameForm />
    </>
  );
}

