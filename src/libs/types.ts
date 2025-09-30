interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  program: "CPE" | "ISNE";
  courses?: number[];
}
export type { Student };

interface Course {
  courseId: number;
  courseTitle: string;
  instructors: string[];
}
export type { Course };

interface Me {
  studentId: string;
  firstName: string;
  lastName: string;
  program: "CPE" | "ISNE";
  courses?: number[];
  section: string;
}
export type { Me };
