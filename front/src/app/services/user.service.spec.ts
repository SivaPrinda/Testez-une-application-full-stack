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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

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

    service.getById('1').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should delete a user by ID', () => {
    const userId = '1';

    service.delete(userId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Assuming the DELETE request has no response body
  });

  afterEach(() => {
    httpMock.verify(); // Ensures there are no outstanding requests
  });
});
