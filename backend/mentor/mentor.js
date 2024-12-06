import e from "express";
import z from "zod";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import secretKey from "./secret.js";
import  mentorModel  from "../db/db.js";

const mentorRouter = e.Router();

mentorRouter.post("/signup", async (req, res) => {
  const rawData = z.object({
    name: z.string().max(16),
    email: z.string().email(),
    password: z.string().min(6).max(16),
  });
  const safeParsed = rawData.safeParse(req.body);
  if (safeParsed.success) {
    const { name, email, password } = safeParsed.data;
    const hashedPassword = await bcrypt.hash(password, 5);
    const secret = secretKey();
    const hashedSecretKey = await bcrypt.hash(secret , 5);

    try {
      const emailCheck = await mentorModel.findOne({
        email: email
      });
      if(emailCheck) {
        res.status(200).json({
          message: "Email Exists!",
        });
      }
      if(!emailCheck) {
        const mentor = await mentorModel.create({
          name: name,
          email: email,
          password: hashedPassword,
          secretKey: hashedSecretKey,
        });
        if (mentor) {
          res.status(200).json({
            message: "Account Created",
            secretKey: secretKey,
          });
        } else {
          res.status(200).json({
            message: "Try Again",
          });
        }
      }
    } catch (e) {
        console.log(e);
      res.status(200).json({
        message: "Something Went Wrong",
      });
    }
  } else {
    res.status(200).json({
      message: "Incorrect Formats",
    });
  }
});

export default mentorRouter;