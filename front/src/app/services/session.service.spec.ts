import { TestBed } from '@angular/core/testing'; 
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    // Setup the testing module and inject the SessionService
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    // Test to ensure the SessionService is created successfully
    expect(service).toBeTruthy();
  });
  
  it('should start with isLogged as false', () => {
    // Test to verify the initial state of isLogged is set to false
    expect(service.isLogged).toBeFalsy();
  });

  it('should update isLogged to true on logIn', () => {
    // Mock session data representing a logged-in user
    const mockUser: SessionInformation = {
      token: 'test',
      id: 1,
      username: 'testUser',
      type: 'admin',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    };
    // Log in with mock data and assert that isLogged is true
    service.logIn(mockUser);
    // Verify the session information is correctly updated
    expect(service.isLogged).toBeTruthy();
    expect(service.sessionInformation).toEqual(mockUser);
  });

  it('should update isLogged to false on logOut', () => {
    // Test to ensure isLogged becomes false after calling logOut
    service.logOut();
    // Verify that session information is cleared
    expect(service.isLogged).toBeFalsy();
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit correct values on $isLogged()', () => {
    // Mock session data representing a logged-in user
    const mockUser: SessionInformation = {
      token: 'test',
      id: 1,
      username: 'testUser',
      type: 'admin',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    };

    // Log in with mock data
    service.logIn(mockUser);

    // Subscribe to the $isLogged observable and verify emitted values
    service.$isLogged().subscribe((value) => {
      expect(value).toBe(true);
    });
  });
});
