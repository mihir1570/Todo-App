import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtaskModelpopupComponent } from './addtask-modelpopup.component';

describe('AddtaskModelpopupComponent', () => {
  let component: AddtaskModelpopupComponent;
  let fixture: ComponentFixture<AddtaskModelpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddtaskModelpopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddtaskModelpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
