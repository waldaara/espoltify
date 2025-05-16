import { z } from "zod";

import { changeNameFormSchema } from "@/features/settings/schemas/change-name-form-schema";

export type ChangeNameFormValues = z.infer<typeof changeNameFormSchema>;

