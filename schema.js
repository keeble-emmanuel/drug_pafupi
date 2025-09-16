const { z } = require('zod');

// Schema for creating a new user
const newUserSchema = z.object({
  name: z.string().min(1, "Name is required."),
  city: z.string().optional(),
  phone: z.string().optional(),
  locationOfUser: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters long."),
  password: z.string().min(3, "Password must be at least 6 characters long."),
});

// Schema for creating a new drug
const newDrugSchema = z.object({
  user_id: z.union([
    z.number().int().positive("User ID must be a positive integer if a number."),
    z.string().min(1, "User ID must be a non-empty string.")
  ]),
  genericName: z.string().min(1, "Generic name is required."),
  tradeName: z.string().min(1, "Trade name is required."),
  drugStrength: z.string().optional(),
  drugCategory: z.string().optional(),
  drugStockstatus: z.string().optional(),
  route: z.string().optional(),
  dosageForm: z.string().optional(),
  expiryDate: z.string().optional(), // You might want a more specific date validation
  price: z.string()
    .transform((val, ctx) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'price must be a number.',
        });
        return z.NEVER;
      }
      return parsed;
    })
    .refine(val => val > 0, { message: "price must be a positive number." }),
});

module.exports = {
  newUserSchema,
  newDrugSchema,
};