const { z } = require('zod');

// Regex for strictly allowing letters, spaces, dots, and commas only (no numbers)
const nameRegex = /^[a-zA-Z\s.,]+$/;

// Phone format validation (PH: 09 / +639 / 639 followed by 9 digits)
const phoneRegex = /^(09|\+639|639)\d{9}$/;

const signupSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address format" }),
  username: z.string().trim().min(3, { message: "Username must be at least 3 characters long" }),
  phone: z.string().trim().regex(phoneRegex, { message: "Please enter a valid Philippine mobile number (e.g. 09171234567)" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .regex(nameRegex, { message: "Name must only contain letters, spaces, dots, and commas (no numbers allowed)" }),
  requestedRole: z.string().optional(),
  department: z.string().optional(),
  departmentId: z.string().optional(),
  dataConsentAccepted: z.literal(true, {
    message: "Data privacy consent is required to register"
  }),
  dataConsentSignature: z.string()
    .trim()
    .min(1, { message: "Data privacy consent signature is required" }),
});

const loginSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" })
});

module.exports = {
  signupSchema,
  loginSchema
};
