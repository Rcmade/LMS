import { boolean, email, enum as enum_, object, string } from "zod";
import type { z } from "zod/v4";
import { genderArr } from "../constants";

// Gender enum schema
const genderEnum = enum_(genderArr);

export const emailSchema = object({
  email: email({ message: "Please enter a valid email address." }),
});

export type EmailSchemaT = z.infer<typeof emailSchema>;

export const otpSchema = object({
  code: string().optional(),
  otp: string().min(4),
});

export type OtpSchemaT = z.infer<typeof otpSchema>;

// Full profile info schema
export const fullInfoSchema = object({
  first_name: string().min(2, {
    message: "First name must be at least 2 characters long.",
  }),
  last_name: string().optional(),
  password: string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  // .regex(/[A-Z]/, {
  //   message: "Password must contain at least one uppercase letter.",
  // })
  // .regex(/[0-9]/, { message: "Password must contain at least one number." })
  // .regex(/[\W_]/, {
  //   message: "Password must contain at least one special character.",
  // })
  //
  dob: string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date of birth must be in the format YYYY-MM-DD.",
    })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "Invalid date provided.",
      }
    ),
  gender: genderEnum,
  terms: boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

export type FullInfoSchemaT = z.infer<typeof fullInfoSchema>;

export const signInSchema = object({
  email: email({ message: "Please enter a valid email address." }),
  password: string().min(1, {
    message: "Password must be at least 1 characters.",
  }),
});

export type SignInSchemaT = z.infer<typeof signInSchema>;
