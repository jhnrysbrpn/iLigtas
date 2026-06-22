const { z } = require('zod');
const {
  USERNAME_REGEX,
  E164_PHONE_REGEX,
  allowedDepartments,
  allowedRoles,
  containsProfanity,
  isStrongPassword,
  normalizePhone,
  passwordContainsIdentity,
  stripHtml,
  validateFullNameParts
} = require('../utils/validation');

const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .email({ message: "Invalid email address format" })
  .max(254, { message: "Email must be 254 characters or fewer" });

const signupSchema = z.object({
  email: emailSchema,
  username: z.string()
    .trim()
    .toLowerCase()
    .regex(USERNAME_REGEX, { message: "Username must be 3-30 characters and use only letters, numbers, and underscores" }),
  phone: z.preprocess(normalizePhone, z.string()
    .regex(E164_PHONE_REGEX, { message: "Phone must use E.164 format with country code, e.g. +639171234567" })),
  password: z.string()
    .refine(isStrongPassword, { message: "Password must be at least 8 characters and include uppercase, lowercase, digit, and special character" }),
  confirmPassword: z.string().optional(),
  name: z.preprocess(stripHtml, z.string()
    .trim()
    .min(1, { message: "Full name is required" })
    .max(121, { message: "Full name is too long" })
    .refine(validateFullNameParts, { message: "First and last name must use letters, hyphens, or apostrophes only, 2-60 characters each" })
    .refine((value) => !containsProfanity(value), { message: "Name contains blocked language" })),
  requestedRole: z.enum(allowedRoles).optional(),
  department: z.enum(allowedDepartments).optional(),
  departmentId: z.preprocess(stripHtml, z.string().trim().max(40).optional()),
  termsAccepted: z.literal(true, { message: "Terms and privacy consent is required" }),
}).superRefine((data, ctx) => {
  if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'Confirm password must match exactly'
    });
  }

  const identityValues = [data.username, data.email, data.name, ...String(data.name || '').split(/\s+/)];
  if (passwordContainsIdentity(data.password, identityValues)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['password'],
      message: 'Password cannot contain your username, email address, or name'
    });
  }
});

const loginSchema = z.object({
  username: z.string().trim().toLowerCase().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" })
});

module.exports = {
  signupSchema,
  loginSchema
};
