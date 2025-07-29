import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullwidthComponent } from './fullwidth.component';

describe('FullwidthComponent', () => {
  let component: FullwidthComponent;
  let fixture: ComponentFixture<FullwidthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullwidthComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FullwidthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
