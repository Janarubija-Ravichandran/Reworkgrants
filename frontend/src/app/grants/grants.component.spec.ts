import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantsComponent } from './grants.component';

describe('GrantsComponent', () => {
  let component: GrantsComponent;
  let fixture: ComponentFixture<GrantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantsComponent]
    });
    fixture = TestBed.createComponent(GrantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
