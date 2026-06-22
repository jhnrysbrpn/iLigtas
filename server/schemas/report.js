const { z } = require('zod');
const {
  E164_PHONE_REGEX,
  containsProfanity,
  incidentCategories,
  priorityLevels,
  normalizePhone,
  stripHtml,
  validateFullNameParts
} = require('../utils/validation');

const requiredText = (field, max) =>
  z.preprocess(stripHtml, z.string()
    .min(1, { message: `${field} is required` })
    .max(max, { message: `${field} must be ${max} characters or fewer` })
    .refine((value) => !containsProfanity(value), { message: `${field} contains blocked language` }));

const createReportSchema = z.object({
  category: z.enum(incidentCategories, { message: 'Select a valid incident category' }),
  title: requiredText('Title', 100),
  description: requiredText('Description', 1000),
  reporterName: z.preprocess(stripHtml, z.string()
    .min(1, { message: 'Reporter name is required' })
    .max(121, { message: 'Reporter name is too long' })
    .refine(validateFullNameParts, { message: 'First and last name must use letters, hyphens, or apostrophes only, 2-60 characters each' })
    .refine((value) => !containsProfanity(value), { message: 'Reporter name contains blocked language' })),
  reporterPhone: z.preprocess(normalizePhone, z.string()
    .regex(E164_PHONE_REGEX, { message: 'Phone must use E.164 format, e.g. +639171234567' })),
  locationName: requiredText('Location', 180),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  priority: z.enum(priorityLevels).default('Medium')
});

const updateReportSchema = z.object({
  status: z.enum(['Pending', 'Verified', 'Dispatched', 'Resolved']).optional(),
  priority: z.enum(priorityLevels).optional(),
  assignedResponder: z.preprocess(stripHtml, z.string().max(100).optional()),
  affectedFamiliesCount: z.coerce.number().int().min(0).max(100000).optional(),
  damageCostEstimated: z.coerce.number().min(0).max(1000000000).optional()
}).refine((value) => Object.keys(value).length > 0, { message: 'At least one update field is required' });

const createCommentSchema = z.object({
  text: requiredText('Comment', 500),
  role: z.enum(['Resident', 'Responder', 'Admin', 'SuperAdmin'], { message: 'Invalid role' })
});

module.exports = {
  createReportSchema,
  updateReportSchema,
  createCommentSchema
};
