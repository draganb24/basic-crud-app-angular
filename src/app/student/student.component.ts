import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService, Student } from './student.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  imports: [FormsModule, ReactiveFormsModule],
  standalone: true
})
export class StudentComponent implements OnInit {

  studentForm: FormGroup;
  students: Student[] = [];
  isStudentsDataLoaded = false;
  currentStudent: Student | null = null;
  isUpdating: boolean = false;

  constructor(private fb: FormBuilder, private studentService: StudentService) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getAllStudents();
  }

  getAllStudents() {
    this.studentService.getAllStudents().subscribe({
      next: (resultData: Student[]) => {
        this.students = resultData;
        this.isStudentsDataLoaded = true;
      },
      error: (error) => {
        console.error("Error fetching students:", error);
      }
    });
  }

  saveOrUpdate() {
    if (this.currentStudent) {
      this.updateStudent();
    } else {
      this.registerStudent();
    }
  }

  registerStudent() {
    this.studentService.registerStudent(this.studentForm.value).subscribe({
      next: () => {
        alert("Student registered successfully");
        this.isUpdating = false;
        this.resetForm();
        this.getAllStudents();
      },
      error: (error) => {
        console.error("Error registering student:", error);
        this.isUpdating = false;
      }
    });
  }

  updateStudent() {
    if (!this.currentStudent) return;
    this.isUpdating = true;
    this.studentService.updateStudent(this.currentStudent.id, this.studentForm.value).subscribe({
      next: () => {
        alert("Student updated successfully");
        this.isUpdating = false;
        this.resetForm();
        this.getAllStudents();
      },
      error: (error) => {
        console.error("Error updating student:", error);
        this.isUpdating = false;
      }
    });
  }

  setUpdate(student: Student) {
    this.currentStudent = student;
    this.studentForm.patchValue({
      name: student.name,
      address: student.address,
      phone: student.phone
    });
  }

  setDelete(student: Student) {
    if (!confirm("Are you sure you want to delete this student?")) return;
    this.studentService.deleteStudent(student.id).subscribe({
      next: () => {
        alert("Student deleted successfully");
        this.getAllStudents();
      },
      error: (error) => {
        console.error("Error deleting student:", error);
      }
    });
  }

  resetForm() {
    this.studentForm.reset();
    this.currentStudent = null;
  }
}

