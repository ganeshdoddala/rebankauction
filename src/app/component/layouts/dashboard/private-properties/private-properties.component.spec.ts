import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatePropertiesComponent } from './private-properties.component';

describe('PrivatePropertiesComponent', () => {
  let component: PrivatePropertiesComponent;
  let fixture: ComponentFixture<PrivatePropertiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivatePropertiesComponent]
    });
    fixture = TestBed.createComponent(PrivatePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
