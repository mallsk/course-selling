import e from "express";
import dotenv from "dotenv";
dotenv.config({ path: '.././.env' });
import jwt from "jsonwebtoken"
import brypt from "bcrypt"
import z, { string } from "zod";
import userModel from "../db/db.js";
import { userMiddleware } from "./userMiddleware.js";
const userRouter = e.Router();
const JWT_SECRET = process.env.JWT_SECRET;

userRouter.post("/signup", async (req, res) => {
    // Zod validation schema for user input
    const rawData = z.object({
        name: z.string().max(16),
        email: z.string().email(),
        password: z.string().min(6).max(16),
    });

    // Parsing and validating the input
    const safeParsed = rawData.safeParse(req.body);

    if (!safeParsed.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            errors: safeParsed.error.errors, // Provide more details about the validation errors
        });
    }

    const { name, email, password } = safeParsed.data;

    // Check if the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            message: "Email already exists. Please login or use a different email.",
        });
    }

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // Using 10 salt rounds for better security

        // Create new user using the create() method
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // Return success message
        return res.status(201).json({
            message: "Account Created Successfully",
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        return res.status(500).json({
            message: "Something went wrong. Please try again later.",
        });
    }
});
userRouter.post("/signin", async (req,res) =>{
    const rawData = z.object({
        email : z.string().email(),
        password : z.string().min(6).max(16)
    })
    const safeParsed = rawData.safeParse(req.body);
    if(safeParsed.success){
        const { email , password } = safeParsed.data;
        const userEmail = await userModel.findOne({
            email : email
        })
        if(userEmail){
            const userPassword = await brypt.compare( password , userEmail.password);
            if(userPassword){
                const token = await jwt.sign({
                    userId : userEmail._id
                }, JWT_SECRET , {
                    expiresIn : '4h'
                });
                res.json({
                    token : token
                })
            }
            if(!userPassword){
                res.status(200).json({
                    message : "Invalid Password"
                })
            }
        }
        if(!userEmail){
            res.status(200).json({
                message : "Invalid Email"
            })
        }
    }
    if(!safeParsed.success){
        res.json({
            message : "Invalid Formats"
        })
    }
})

userRouter.get("/home", userMiddleware ,(req,res)=>{
    const userId = req.userId;
    res.status(200).json({
        message : "Home Page",
        userId : userId
    })
})

export default userRouter;