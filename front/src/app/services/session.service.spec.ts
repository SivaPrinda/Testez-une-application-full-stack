import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should start with isLogged as false', () => {
    expect(service.isLogged).toBeFalsy();
  });

  it('should update isLogged to true on logIn', () => {
    const mockUser: SessionInformation = {
      token: 'test',
      id: 1,
      username: 'testUser',
      type: 'admin',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    };
    service.logIn(mockUser);
    expect(service.isLogged).toBeTruthy();
    expect(service.sessionInformation).toEqual(mockUser);
  });

  it('should update isLogged to false on logOut', () => {
    service.logOut();
    expect(service.isLogged).toBeFalsy();
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit correct values on $isLogged()', () => {
    const mockUser: SessionInformation = {
      token: 'test',
      id: 1,
      username: 'testUser',
      type: 'admin',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    };

    service.logIn(mockUser);

    service.$isLogged().subscribe((value) => {
      expect(value).toBe(true);
    });
  });
});
