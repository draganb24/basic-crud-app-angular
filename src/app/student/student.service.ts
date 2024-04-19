import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: number;
  name: string;
  address: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {

  private baseUrl = 'http://localhost:8000/api/student';

  constructor(private http: HttpClient) { }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  registerStudent(studentData: Student): Observable<any> {
    return this.http.post(this.baseUrl, studentData);
  }

  updateStudent(studentId: number, studentData: Student): Observable<any> {
    return this.http.put(`${this.baseUrl}/${studentId}`, studentData);
  }

  deleteStudent(studentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${studentId}`);
  }
}
