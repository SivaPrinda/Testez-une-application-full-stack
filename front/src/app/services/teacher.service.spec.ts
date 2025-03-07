import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Teacher } from '../interfaces/teacher.interface';

import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Correction ici
      providers: [TeacherService],
    });

    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes non traitées
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all teachers', () => {
    const dummyTeachers: Teacher[] = [
      {
        id: 1,
        lastName: 'Doe',
        firstName: 'John',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: 2,
        lastName: 'Doremi',
        firstName: 'Johna',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
    ];

    service.all().subscribe((teachers) => {
      expect(teachers.length).toBe(2);
      expect(teachers).toEqual(dummyTeachers);
    });

    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTeachers);
  });

  it('should fetch teacher details', () => {
    const dummyTeacher: Teacher = {
      id: 1,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    service.detail('1').subscribe((teacher) => {
      expect(teacher).toEqual(dummyTeacher);
    });

    const req = httpMock.expectOne('api/teacher/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTeacher);
  });

  it('should handle error when fetching teacher details', () => {
    service.detail('999').subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error) => {
        expect(error.status).toBe(404);
      },
    });

    const req = httpMock.expectOne('api/teacher/999');
    expect(req.request.method).toBe('GET');
    req.flush(
      { message: 'Not Found' },
      { status: 404, statusText: 'Not Found' }
    );
  });
});
