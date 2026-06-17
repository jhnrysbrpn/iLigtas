const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    // Zod issues are stored in result.error.issues
    const errors = (result.error.issues || []).map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    return res.status(400).json({ status: 'error', errors });
  }
  req.validatedBody = result.data;
  next();
};

module.exports = validate;
