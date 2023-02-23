import bcrypt from "bcrypt";
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  getUserEmailFromDB,
  getUserIDFromDB,
  getUsernameFromDB,
  registerUser,
  resetPasswordById,
} from "../services/user.service.js";
import { sendPasswordResetMail } from "../middleware/PasswordResetMail.js";
import {
  forgotPasswordvalidation,
  loginValidation,
  resetPasswordValidation,
  signUpValidation,
} from "../Middleware/auth.js";

dotenv.config();
const router = express.Router();

async function generateHashedPassword(password) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(salt);
  console.log(hashedPassword);
  return hashedPassword;
}

router.post(
  "/signup",
  signUpValidation(),
  express.json(),
  async function (request, response) {
    const { username, email, password } = request.body;
    const userNameFromDB = await getUsernameFromDB(username);
    const userEmailFromDB = await getUserEmailFromDB(email);
    if (userEmailFromDB) {
      response.status(400).send({ message: "Email already exists" });
    } else if (userNameFromDB) {
      response.status(400).send({ message: "Username already exists" });
    } else if (password.length < 8) {
      response
        .status(400)
        .send({ message: "Password should be atleast 8 characters!" });
    } else {
      const hashedPassword = await generateHashedPassword(password);
      const result = await registerUser({
        username: username,
        email: email,
        password: hashedPassword,
      });
      response.send(result);
    }
  }
);

router.post(
  "/login",
  loginValidation(),
  express.json(),
  async function (request, response) {
    const { email, password } = request.body;
    const userEmailFromDB = await getUserEmailFromDB(email);
    console.log(userEmailFromDB);
    if (!userEmailFromDB) {
      response.status(401).send({ message: "Invalid Credentials" });
    } else {
      const storedDBPassword = userEmailFromDB.password;
      const isPasswordMatch = await bcrypt.compare(password, storedDBPassword);
      if (isPasswordMatch) {
        const token = jwt.sign(
          { id: userEmailFromDB._id },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );
        response.send({ message: "Sucessful login", token: token });
      } else {
        response.status(401).send({ message: "Invalid Credentials" });
      }
    }
  }
);

router.post(
  "/forgot-password",
  express.json(),
  forgotPasswordvalidation(),
  async (request, response, next) => {
    const { email } = request.body;
    const userEmailFromDB = await getUserEmailFromDB(email);

    if (userEmailFromDB === null) {
      response
        .status(400)
        .send({ message: "Please enter the registered email" });
    } else {
      const storedDBPassword = userEmailFromDB.password;
      const userId = userEmailFromDB._id;
      const secret = process.env.SECRET_KEY + storedDBPassword;
      const payload = {
        email: userEmailFromDB.email,
        id: userId,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "10m" });

      const sendMail = await sendPasswordResetMail(email, userId, token);
      if (sendMail) {
        response.send({
          message: `Reset mail has been sent successfully to ${email}. Kindly check your spam folder also.`,
        });
      } else {
        response.status(400).send({ message: "An error occured" });
      }
    }
  }
);

router.get("/reset-password/:_id/:token", async (request, response, next) => {
  const { _id, token } = request.params;

  const userIdFromDB = await getUserIDFromDB(_id);
  const userId = userIdFromDB._id.toString();
  const storedDBPassword = userIdFromDB.password;
  if (userId !== _id) {
    response.status(404).send({ message: "Invalid id" });
    return;
  } else {
    const secret = process.env.SECRET_KEY + storedDBPassword;
    try {
      const payload = jwt.verify(token, secret);
      response.send({ email: userIdFromDB.email });
    } catch (error) {
      console.log(error.message);
      response.send({ message: error.message });
    }
  }
});

router.post(
  "/reset-password/:_id/:token",
  express.json(),
  resetPasswordValidation(),
  async (request, response, next) => {
    const { _id, token } = request.params;
    console.log(_id, token);
    const { password } = request.body;
    console.log("pass", password);
    const userIdFromDB = await getUserIDFromDB(_id);
    const userId = userIdFromDB._id.toString();
    const storedDBPassword = userIdFromDB.password;
    if (userId !== _id) {
      response.status(404).send({ message: "Invalid id" });
      return;
    } else {
      const secret = process.env.SECRET_KEY + storedDBPassword;
      try {
        const payload = jwt.verify(token, secret);
        const hashedPassword = await generateHashedPassword(password);
        const updatedResult = await resetPasswordById({
          userId: userId,
          password: hashedPassword,
        });
        response.send({
          message: "Password Reset Successful!! Go Back to Login👍",
        });
      } catch (error) {
        console.log(error.message);
        response.send({ message: error.message });
      }
    }
  }
);

export default router;
