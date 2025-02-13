import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom de famille est requis"),
  email: z.string().email("L'email doit être valide"),
  phone: z
    .string()
    .regex(
      /^\d{10}$/,
      "Le numéro de téléphone doit être un nombre de 10 chiffres"
    ),
  bio: z.string().optional(),
});
