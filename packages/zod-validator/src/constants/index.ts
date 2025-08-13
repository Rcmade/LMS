import { CreateAccountStage } from "../types";

export const genderArr = [
  "female",
  "male",
  "other",
  "prefer_not_to_say",
] as const;

// // This type extracts only the values of the enum
type CreateAccountStageEnumValues = `${CreateAccountStage}`;

export const createAccountStages = Object.keys(
  CreateAccountStage
) as CreateAccountStageEnumValues[];
