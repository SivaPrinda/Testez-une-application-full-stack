import { expect } from '@jest/globals';

import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  // Setup the testing module with mock services, dependencies, and component creation
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Test to ensure the UserService is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Mock data for a sample user
  it('should retrieve a user by ID', () => {
    const mockUser: User = {
      id: 1,
      email: 'john.doe@example.com',
      lastName: 'Doe',
      firstName: 'John',
      admin: true,
      password: 'test',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    // Call the getById method and verify the response
    service.getById('1').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    // Verify the correct HTTP GET method and endpoint are used
    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  // Mock data for a sample user ID
  it('should delete a user by ID', () => {
    const userId = '1';

    // Call the delete method and verify the response is null
    service.delete(userId).subscribe((response) => {
      expect(response).toBeNull();
    });

    // Verify the correct HTTP DELETE method and endpoint are used
    const req = httpMock.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Assuming the DELETE request has no response body
  });

  // Ensure there are no outstanding HTTP requests after each test
  afterEach(() => {
    httpMock.verify(); // Ensures there are no outstanding requests
  });
});
