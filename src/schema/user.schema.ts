import { z } from "zod";

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type userLoginInput = z.TypeOf<typeof userLoginSchema>;

export const userSignUpSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(8, "Password should be at least 8 characters"),
});

export type userSignUpInput = z.TypeOf<typeof userSignUpSchema>;
