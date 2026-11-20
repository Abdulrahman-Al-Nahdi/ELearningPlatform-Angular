export interface Instructor {
  instructorId: number;
  fullName: string;
  email: string;
  courses?: Course[];
}

export interface CourseSyllabus {
  courseSyllabusId?: number;
  topicsSummary: string;
  durationHours: number;
}

export interface Course {
  courseId: number;
  title: string;
  price: number;
  startDate: string;
  isPublished: boolean;
  instructorId: number;
  instructor?: Instructor;
  syllabus?: CourseSyllabus | null;
  enrollments?: Enrollment[];
}

export interface Student {
  studentId: number;
  name: string;
  enrollments?: Enrollment[];
}

export interface Enrollment {
  studentId: number;
  courseId: number;
  enrollmentOrder: number;
  student?: Student;
  course?: Course;
}
