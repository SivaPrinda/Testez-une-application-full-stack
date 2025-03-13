import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { By } from '@angular/platform-browser';
import { expect } from '@jest/globals';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    // Setup the testing module and create the component instance
    await TestBed.configureTestingModule({
      declarations: [NotFoundComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Test to verify that the component is created successfully
    expect(component).toBeTruthy();
  });

  it('should display "Page not found !"', () => {
    // Test to verify that the "Page not found !" message is correctly displayed in the template
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Page not found !');
  });

});
