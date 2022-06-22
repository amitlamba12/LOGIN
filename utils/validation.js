const Joi = require("@hapi/joi");
const registrationValidation = (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required()
      .error(new Error("Email can not be empty.")),
      password: Joi.required(),
      phoneNumber:Joi.optional(),
      roles:Joi.required(),
      isVerified:Joi.boolean().default(false),
      
    });
  
    const value = schema.validate(req.body);
    if (value.error) {
      return res.status(422).json({ message: value.error.message });
    }
    next();
  };

  module.exports = {
    registrationValidation
  };