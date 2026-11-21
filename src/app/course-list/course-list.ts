import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Course, CourseSyllabus, Enrollment, Instructor, Student } from '../models/course.model';
import { CourseApiService } from '../services/course-api.service';

@Component({
  selector: 'app-course-list',
  standalone: false,
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  sectionTitle: string = 'Academic Courses & Relationships Hub';
  activeTab: 'course' | 'enroll' | 'instructor' | 'student' = 'course';
  viewMode: 'cards' | 'table' = 'cards';
  toastMessage: string = '';

  courses: Course[] = [];
  instructors: Instructor[] = [];
  students: Student[] = [];
  searchKeyword: string = '';
  pageIndex: number = 1;
  pageSize: number = 6;

  newCourse: Course = {
    courseId: 0,
    title: '',
    price: 99,
    startDate: new Date().toISOString().split('T')[0],
    isPublished: false,
    instructorId: 1,
  };

  syllabusForm: CourseSyllabus = {
    topicsSummary: '',
    durationHours: 24,
  };

  newEnrollment: Enrollment = {
    studentId: 1,
    courseId: 1,
    enrollmentOrder: 1,
  };

  newInstructor = { fullName: '', email: '' };
  newStudent = { name: '' };

  constructor(
    private apiService: CourseApiService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAllData();
    }
  }

  get publishedCount(): number {
    return this.courses.filter((c) => c.isPublished).length;
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => (this.toastMessage = ''), 3500);
  }

  loadAllData(): void {
    this.apiService.getCourses().subscribe((data) => {
      this.courses = data;
      if (data.length > 0 && !this.newEnrollment.courseId) {
        this.newEnrollment.courseId = data[0].courseId;
      }
    });

    this.apiService.getInstructors().subscribe((data) => {
      this.instructors = data;
      if (data.length > 0) this.newCourse.instructorId = data[0].instructorId;
    });

    this.apiService.getStudents().subscribe((data) => {
      this.students = data;
      if (data.length > 0) this.newEnrollment.studentId = data[0].studentId;
    });
  }

  createCourse(): void {
    const payload: Course = {
      ...this.newCourse,
      instructorId: Number(this.newCourse.instructorId),
      syllabus: { ...this.syllabusForm },
    };

    this.apiService.addCourse(payload).subscribe(() => {
      this.newCourse.title = '';
      this.newCourse.price = 99;
      this.syllabusForm = { topicsSummary: '', durationHours: 24 };
      this.showToast('Course & 1:1 Syllabus created successfully!');
      this.loadAllData();
    });
  }

  createInstructor(): void {
    this.apiService.addInstructor(this.newInstructor).subscribe(() => {
      this.newInstructor = { fullName: '', email: '' };
      this.showToast('Instructor added successfully!');
      this.loadAllData();
    });
  }

  createStudent(): void {
    this.apiService.addStudent(this.newStudent).subscribe(() => {
      this.newStudent = { name: '' };
      this.showToast('Student registered successfully!');
      this.loadAllData();
    });
  }

  enroll(): void {
    const payload: Enrollment = {
      studentId: Number(this.newEnrollment.studentId),
      courseId: Number(this.newEnrollment.courseId),
      enrollmentOrder: Number(this.newEnrollment.enrollmentOrder),
    };

    this.apiService.enrollStudent(payload).subscribe({
      next: (msg) => {
        this.showToast(msg);
        this.loadAllData();
      },
      error: () => this.showToast('Student is already enrolled in this course!'),
    });
  }

  onSearch(): void {
    if (!this.searchKeyword.trim()) {
      this.loadAllData();
      return;
    }
    this.apiService.searchCourses(this.searchKeyword).subscribe({
      next: (data) => (this.courses = data),
      error: () => this.showToast('Search accepts English letters only (alpha constraint).'),
    });
  }

  loadPage(step: number): void {
    const targetPage = this.pageIndex + step;
    if (targetPage < 1) return;
    this.pageIndex = targetPage;
    this.apiService.getPagedCourses(this.pageIndex, this.pageSize).subscribe((data) => {
      this.courses = data;
    });
  }

  publish(id: number): void {
    this.apiService.publishCourse(id).subscribe(() => {
      this.showToast('Course published live!');
      this.loadAllData();
    });
  }

  remove(id: number): void {
    this.apiService.deleteCourse(id).subscribe(() => {
      this.showToast('Course & related syllabus deleted.');
      this.loadAllData();
    });
  }
}
