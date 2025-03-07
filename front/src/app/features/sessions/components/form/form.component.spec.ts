import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { of } from 'rxjs';
import { TeacherService } from 'src/app/services/teacher.service';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ParamMap,
  Router,
} from '@angular/router';
import { Session } from '../../interfaces/session.interface';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: jest.Mocked<SessionApiService>;
  let router: jest.Mocked<Router>;
  let matSnackBar: jest.Mocked<MatSnackBar>;
  let activatedRoute: Partial<ActivatedRoute>;

  const mockSessionService = {
    sessionInformation: { admin: true },
  };

  beforeEach(async () => {
    sessionApiService = {
      detail: jest.fn().mockReturnValue(
        of({
          name: 'Test Session',
          date: new Date('2023-01-01'),
          teacher_id: '1',
          description: 'Desc',
          users: [],
        })
      ),
      create: jest.fn(),
      update: jest.fn(),
    } as any;
    router = { navigate: jest.fn(), url: '/sessions/create' } as any;
    matSnackBar = { open: jest.fn() } as any;
    activatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('123'),
          has: jest.fn().mockReturnValue(true),
          getAll: jest.fn().mockReturnValue(['123']),
          keys: [],
        } as unknown as ParamMap,
        url: [],
        params: {},
        queryParams: {},
        fragment: null,
        data: {},
      } as unknown as ActivatedRouteSnapshot,
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [FormComponent],
      providers: [
        FormBuilder,
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: sessionApiService },
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: TeacherService, useValue: { all: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if user is not admin', () => {
    mockSessionService.sessionInformation.admin = false;
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should initialize form when creating a session', () => {
    Object.defineProperty(router, 'url', { get: () => '/sessions/create' });
    component.ngOnInit();
    expect(component.sessionForm).toBeDefined();
    expect(component.onUpdate).toBe(false);
  });

  it('should initialize form when updating a session', () => {
    Object.defineProperty(router, 'url', { get: () => '/sessions/update/123' });
    jest.spyOn<any, any>(component, 'initForm');
    sessionApiService.detail.mockReturnValue(
      of({
        name: 'Test Session',
        date: new Date('2023-01-01'),
        teacher_id: 1,
        description: 'Desc',
        users: [],
      })
    );
    component.ngOnInit();
    expect(component.onUpdate).toBe(true);
    expect(sessionApiService.detail).toHaveBeenCalledWith('123');
    expect(component['initForm']).toHaveBeenCalled();
  });

  it('should call create on submit if creating', () => {
    component.onUpdate = false;
    component.sessionForm = new FormBuilder().group({
      name: 'Test',
      date: '2023-01-01',
      teacher_id: '1',
      description: 'Desc',
    });
    sessionApiService.create.mockReturnValue(
      of({
        name: 'New Session',
        date: new Date('2023-02-01'),
        teacher_id: 2,
        description: 'New Description',
        users: [],
      } as Session)
    );
    component.submit();
    expect(sessionApiService.create).toHaveBeenCalled();
    expect(matSnackBar.open).toHaveBeenCalledWith(
      'Session created !',
      'Close',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should call update on submit if updating', () => {
    component.onUpdate = true;
    component['id'] = '123';
    component.sessionForm = new FormBuilder().group({
      name: 'Test',
      date: '2023-01-01',
      teacher_id: '1',
      description: 'Desc',
    });
    sessionApiService.update.mockReturnValue(
      of({
        name: 'Updated Session',
        date: new Date('2023-02-01'),
        teacher_id: 2,
        description: 'Updated Description',
        users: [],
      } as Session)
    );
    component.submit();
    expect(sessionApiService.update).toHaveBeenCalledWith(
      '123',
      component.sessionForm.value
    );
    expect(matSnackBar.open).toHaveBeenCalledWith(
      'Session updated !',
      'Close',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should display a snackbar and navigate when exitPage is called', () => {
    jest.spyOn(router, 'navigate');
    component['exitPage']('Test Message');
    expect(matSnackBar.open).toHaveBeenCalledWith('Test Message', 'Close', {
      duration: 3000,
    });
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
