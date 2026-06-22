const { z } = require('zod');
const { alertSeverities, containsProfanity, stripHtml } = require('../utils/validation');

const safeText = (field, max) =>
  z.preprocess(stripHtml, z.string()
    .min(1, { message: `${field} is required` })
    .max(max, { message: `${field} must be ${max} characters or fewer` })
    .refine((value) => !containsProfanity(value), { message: `${field} contains blocked language` }));

const createAlertSchema = z.object({
  title: safeText('Title', 100),
  severity: z.enum(alertSeverities, { message: 'Select a valid alert severity' }),
  message: safeText('Message', 1000),
  affectedArea: safeText('Affected area', 180),
  broadcastSMS: z.boolean().optional().default(false)
});

const toggleAlertSchema = z.object({
  isActive: z.boolean()
});

module.exports = {
  createAlertSchema,
  toggleAlertSchema
};
