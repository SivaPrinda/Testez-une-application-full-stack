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

  // Setup the testing module with mock services, dependencies, and component creation
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Correction ici
      providers: [TeacherService],
    });

    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Ensure there are no outstanding HTTP requests after each test
  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes non traitées
  });

  // Test to ensure the TeacherService is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all teachers', () => {
    // Mock teacher data for testing
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

    // Subscribe to the service's all() method and verify the response
    service.all().subscribe((teachers) => {
      expect(teachers.length).toBe(2);
      expect(teachers).toEqual(dummyTeachers);
    });

    // Verify the correct HTTP GET method and endpoint are used
    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTeachers);
  });

  it('should fetch teacher details', () => {
    // Mock data for a single teacher
    const dummyTeacher: Teacher = {
      id: 1,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    // Subscribe to the service's detail() method and verify the response
    service.detail('1').subscribe((teacher) => {
      expect(teacher).toEqual(dummyTeacher);
    });

    // Verify the correct HTTP GET method and endpoint are used
    const req = httpMock.expectOne('api/teacher/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTeacher);
  });

  // Test to verify error handling when requesting a non-existent teacher
  it('should handle error when fetching teacher details', () => {
    service.detail('999').subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error) => {
        expect(error.status).toBe(404);
      },
    });

    // Verify the correct HTTP GET method and endpoint are used
    const req = httpMock.expectOne('api/teacher/999');
    expect(req.request.method).toBe('GET');
    // Mock a 404 error response and ensure the error handling logic is triggered
    req.flush(
      { message: 'Not Found' },
      { status: 404, statusText: 'Not Found' }
    );
  });
});
