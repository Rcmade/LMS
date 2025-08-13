import { object, string } from "zod/v4";

export const selectChooserSchema = object({
  // oidcUid: string(),
  userId: string(),
});
