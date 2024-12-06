import e from "express";
import userRouter from "./user/user.js";
import dotenv from "dotenv";
import mentorRouter from "./mentor/mentor.js";
dotenv.config({ path: '../.env' });
const app = e();
const PORT = process.env.PORT;

app.use(e.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/mentor", mentorRouter);


app.listen(PORT, ()=>{
    console.log(`Server started on PORT ${PORT}`);
})