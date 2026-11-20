import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, Enrollment, Instructor, Student } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseApiService {
  private baseUrl = 'https://localhost:7182/api';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/Course`);
  }

  getPagedCourses(pageIndex: number, pageSize: number): Observable<Course[]> {
    return this.http.get<Course[]>(
      `${this.baseUrl}/Course/paged?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    );
  }

  searchCourses(keyword: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/Course/search/${keyword}`);
  }

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/Course`, course);
  }

  publishCourse(id: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/Course/${id}/publish`, {}, { responseType: 'text' });
  }

  deleteCourse(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/Course/${id}`, { responseType: 'text' });
  }

  getInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.baseUrl}/Instructor`);
  }

  addInstructor(instructor: Partial<Instructor>): Observable<Instructor> {
    return this.http.post<Instructor>(`${this.baseUrl}/Instructor`, instructor);
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/Student`);
  }

  addStudent(student: Partial<Student>): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/Student`, student);
  }

  enrollStudent(enrollment: Enrollment): Observable<string> {
    return this.http.post(`${this.baseUrl}/Course/enroll`, enrollment, { responseType: 'text' });
  }
}
