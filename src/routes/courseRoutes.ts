import { Router, type Request , type Response } from "express";

// import database
import { students , courses , meIN } from "../db/db.js";
import {
  zCourseId,
  zCoursePostBody,
  zCoursePutBody,
  zCourseDeleteBody
} from "../schemas/courseValidator.js";
import type { Student , Course } from "../libs/types.js";


const router: Router = Router();

// READ all
router.get("/courses", (req:Request,res:Response) => {
  try {
    const program = req.query.program;

    if (program) {
      let filtered_courses = courses.filter(
        (c) => c.courseTitle === program
      );
      return res.status(200).json({
        success: true,
        data: filtered_courses,
      });
    } else {
      return res.status(200).json({
        success: true,
        data: courses,
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

// Params URL 

// GET /courses/{courseId}
router.get("/courses/:courseId", (req:Request,res:Response) => {
    try {
    const courseId = Number(req.params.courseId);
    const result = zCourseId.safeParse(courseId);
    

    // validate req.body with predefined validator
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    //check duplicate coursesID
    const course = courses.find(
      (c) => c.courseId === courseId
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course does not exist",
      });
    }


    // add response header 'Link'
    res.set("Link", `/courses/${courseId}`);

    return res.status(200).json({
      success: true,
      message: `Get courses ${courseId} successfully`,
      data: {
        courseId: course.courseId,
        courseTitle: course.courseTitle,
        instructors: course.instructors,
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

//POST
router.post("/courses", (req:Request,res:Response) => {
  try {
    const body = req.body as Course;

    // validate req.body with predefined validator
    const result = zCoursePostBody.safeParse(body); // check zod
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    //check duplicate studentId
    const found = courses.find(
      (c) => c.courseId === body.courseId
    );
    if (found) {
      return res.status(409).json({
        success: false,
        message: "Course Id already exists",
      });
    }

    // add new student
    const new_courses = body;
    courses.push(new_courses);

    // add response header 'Link'
    res.set("Link", `/students/${new_courses.courseId}`);

    return res.status(201).json({
      success: true,
      message: `Get courses ${found} successfully`,
      data: new_courses,
    });
    // return res.json({ ok: true, message: "successfully" });
  } catch (err) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

//PUT
router.put("/courses", (req:Request,res:Response) => {
  try {
    const body = req.body as Course;

    // validate req.body with predefined validator
    const result = zCoursePutBody.safeParse(body); // check zod
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    //check duplicate studentId
    const foundIndex = courses.findIndex(
      (c) => c.courseId === body.courseId
    );

    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id does not exists",
      });
    }

    // update student data
    courses[foundIndex] = { ...courses[foundIndex], ...body };

    // add response header 'Link'
    res.set("Link", `/students/${body.courseId}`);

    return res.status(200).json({
      success: true,
      message: `course ${body.courseId} has been updated successfully`,
      data: courses[foundIndex],
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

// DELETE
router.delete("/courses",(req:Request,res:Response) => {
  try {
    const body = req.body;
    const parseResult = zCourseDeleteBody.safeParse(body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: parseResult.error.issues[0]?.message,
      });
    }

    const foundIndex = courses.findIndex(
      (c: Course) => c.courseId === body.courseId
    );

    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id does not exists",
      });
    }

    // delete found student from array
    courses.splice(foundIndex, 1);

    res.status(200).json({
      success: true,
      message: `Course ${body.studentId} has been deleted successfully`,
    }); 

    //return res.status(204).send();
  } 
  
  catch (err) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

export default router;

