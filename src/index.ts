
import express, { type Request, type Response } from "express";
import morgan from 'morgan';

import  studentRouter  from "./routes/studentRoutes.js";
import  coursesRouter  from "./routes/courseRoutes.js";

// import database
import { students , courses , meIN } from "./db/db.js";


const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));

// GET /me
app.get("/me",(req:Request,res:Response) => {
     try {
    const program = req.query.program;

    if (program) {
      let filtered_students = meIN.filter(
        (student) => student.program === program
      );
      return res.status(200).json({
        success: true,
        data: filtered_students,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Student Information",
        data: meIN,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

// GET /api/v2/students
app.use("/api/v2",studentRouter);

// GET /api/v2/courses
app.use("/api/v2",coursesRouter);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);


export default app;
