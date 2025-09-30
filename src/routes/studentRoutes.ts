import { Router, type Request , type Response } from "express";

// import database
import { students , courses , meIN } from "../db/db.js";
import {
  zStudentId,
} from "../schemas/studentValidator.js";
import type { Student , Course } from "../libs/types.js";

const router = Router();

// GET /api/v2/students/{studentId}/courses
router.get("/students/:studentId/courses",(req:Request,res:Response) => {
     try {
    const studentId = req.params.studentId;
    const result = zStudentId.safeParse(studentId);

    // validate req.body with predefined validator
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    //check duplicate studentId
    const student = students.find(
      (student) => student.studentId === studentId
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student does not exists",
      });
    }

    // filter
    const filCourse = courses
            .filter((c) => student.courses?.includes(c.courseId))
            .map(({ courseId, courseTitle }) => ({ courseId, courseTitle }));

    // add response header 'Link'
    res.set("Link", `/students/${studentId}`);

    return res.status(200).json({
      success: true,
      message: `Get courses detail of student ${studentId}`,
      data: {
        studentId: student.studentId,
        courses: filCourse,
      }
    });
  } catch (err) { 
    return res.status(400).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});




export default router;
