import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRide } from './assign-ride';

describe('AssignRide', () => {
  let component: AssignRide;
  let fixture: ComponentFixture<AssignRide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignRide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignRide);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
