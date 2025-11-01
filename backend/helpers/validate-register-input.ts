import { body } from "express-validator";

const validateRegisterInput = [
  body("nickname").notEmpty().withMessage("O nickname é obrigatório!").trim(),
  body("email").isEmail().withMessage("Email inválido").trim(),
  body("password")
    .notEmpty()
    .withMessage("A senha é obrigatória!")
    .isLength({ min: 8 })
    .withMessage("A senha deve ter pelo menos 8 caracteres")
    .trim(),
  body("confirmPassword")
    .notEmpty()
    .withMessage("A confirmação da senha é obrigatória")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(
          "A senha e a confirmação de senha precisam ser iguais!"
        );
      }
      return true;
    }),
];

export { validateRegisterInput };
