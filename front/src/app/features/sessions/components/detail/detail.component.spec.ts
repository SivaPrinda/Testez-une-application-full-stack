import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailComponent } from './detail.component';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let router: Router;
  let matSnackBar: any;

  const mockSession = {
    id: '1',
    name: 'Test Session',
    users: [1],
    date: '2025-02-01',
    description: 'Test Description',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-30',
    teacher_id: 1,
  };

  const mockTeacher = {
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockSessionService = {
    sessionInformation: { admin: true, id: 1 },
  };

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    delete: jest.fn().mockReturnValue(of({})),
    participate: jest.fn().mockReturnValue(of({})),
    unParticipate: jest.fn().mockReturnValue(of({})),
  };

  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of(mockTeacher)),
  };

  beforeEach(async () => {
    // Setup the testing module with mock services, dependencies, and component creation
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } },
          },
        },{
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    // Test to ensure the component is created successfully
    expect(component).toBeTruthy();
  });

  it('should fetch session details on init', () => {
    // Test to verify session and teacher details are fetched on component initialization
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(mockTeacherService.detail).toHaveBeenCalledWith('1');
  });

  it('should delete the session when delete is called', () => {
    // Mock the MatSnackBar and Router for navigation
    const matSnackBarSpy = jest.spyOn(matSnackBar, 'open');
    const routerSpy = jest.spyOn(router, 'navigate');

    // Call the delete method
    component.delete();
    
    // Verify that the snackbar displays the correct message
    expect(matSnackBarSpy).toHaveBeenCalledWith('Session deleted !', 'Close', {
      duration: 3000,
    });
    // Ensure navigation occurs to the 'sessions' route
    expect(routerSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should participate in the session when participate is called', () => {
    // Assign mock sessionId and userId
    component.sessionId = '1';
    component.userId = '1';
    
    // Call the participate method
    component.participate();
    
    // Verify the participate method is called with correct parameters
    expect(sessionApiService.participate).toHaveBeenCalledWith('1', '1');
    // Ensure the session details are refreshed
    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
  });

  it('should unParticipate from the session when unParticipate is called', () => {
    // Assign mock sessionId and userId
    component.sessionId = '1';
    component.userId = '1';
    
    // Call the unParticipate method
    component.unParticipate();
    
    // Verify the unParticipate method is called with correct parameters
    expect(sessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
    // Ensure the session details are refreshed
    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
  });

  it('should navigate back when back is called', () => {
    // Mock the window history's back method
    const backSpy = jest.spyOn(window.history, 'back');
    
    // Call the back method
    component.back();
    
    // Verify that the back method is triggered
    expect(backSpy).toHaveBeenCalled();
  });
});
