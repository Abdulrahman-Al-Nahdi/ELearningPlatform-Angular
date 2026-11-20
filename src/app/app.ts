import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App {
  brandName: string = 'EduVerse';
  studentName: string = 'abdulrahman';
  courseCode: string = 'Advance Software Design & Development';
}
