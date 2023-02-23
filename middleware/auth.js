import { check, validationResult } from "express-validator";

export const signUpValidation = () => {
  return [
    check("username")
      .notEmpty()
      .isLength({ min: 4 })
      .withMessage("Username must be longer!")
      .trim(),
    check("email", "Provide a valid mail id").isEmail(),
    check("password")
      .notEmpty()
      .withMessage("Password is mandatory!")
      .isLength({ min: 8 })
      .withMessage("Password must be above 8 chars!")
      .matches(/\d/)
      .withMessage("must contain a number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("must include a special character"),
    check("confirmPassword")
      .notEmpty()
      .withMessage("Password is mandatory!")
      .isLength({ min: 8 })
      .withMessage("Password must be above 8 chars!")
      .matches(/\d/)
      .withMessage("must contain a number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("must include a special character")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password mismatch!");
        }
        return true;
      }),

    (request, response, next) => {
      const errors = validationResult(request);
      if (errors.isEmpty()) {
        return next();
      }
      const extractedErrors = [];
      errors
        .array()
        .map((err) => extractedErrors.push({ [err.param]: err.msg }));

      return response.status(422).json({ errors: extractedErrors });
    },
  ];
};

export const loginValidation = () => {
  return [
    check("email", "Provide a valid mail id").isEmail(),
    check("password")
      .notEmpty()
      .withMessage("Password is mandatory!")
      .isLength({ min: 8 })
      .withMessage("Password must be above 8 chars!")
      .matches(/\d/)
      .withMessage("must contain a number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("must include a special character"),
    (request, response, next) => {
      const errors = validationResult(request);
      if (errors.isEmpty()) {
        return next();
      }
      const extractedErrors = [];
      errors
        .array()
        .map((err) => extractedErrors.push({ [err.param]: err.msg }));

      return response.status(422).json({ errors: extractedErrors });
    },
  ];
};

export const forgotPasswordvalidation = () => {
  return [
    check("email", "Provide a valid mail id").isEmail(),
    (request, response, next) => {
      const errors = validationResult(request);
      if (errors.isEmpty()) {
        return next();
      }
      console.log(errors);
      return response.status(401).json({ message: "Provide a valid mail id" });
    },
  ];
};

export const resetPasswordValidation = () => {
  return [
    check("password")
      .notEmpty()
      .withMessage("Password is mandatory!")
      .isLength({ min: 8 })
      .withMessage("Password must be above 8 chars!")
      .matches(/\d/)
      .withMessage("must contain a number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("must include a special character"),
    check("confirmPassword")
      .notEmpty()
      .withMessage("Password is mandatory!")
      .isLength({ min: 8 })
      .withMessage("Password must be above 8 chars!")
      .matches(/\d/)
      .withMessage("must contain a number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("must include a special character")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password mismatch!");
        }
        return true;
      }),

    (request, response, next) => {
      const errors = validationResult(request);

      if (errors.isEmpty()) {
        return next();
      } else {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));
        return response.status(422).json({ errors: extractedErrors });
      }
    },
  ];
};
