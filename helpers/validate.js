const validate = function validate(schema, reqPart = 'body') {
  return (req, res, next) => {
    const validationResult = schema.validate(req[reqPart]);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details[0].message);
    }
    next();
  };
};

module.exports = validate;
