import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPropertiesComponent } from './view-properties.component';

describe('ViewPropertiesComponent', () => {
  let component: ViewPropertiesComponent;
  let fixture: ComponentFixture<ViewPropertiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPropertiesComponent]
    });
    fixture = TestBed.createComponent(ViewPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
