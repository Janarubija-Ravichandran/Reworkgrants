import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIdeaComponent } from './user-idea.component';

describe('UserIdeaComponent', () => {
  let component: UserIdeaComponent;
  let fixture: ComponentFixture<UserIdeaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserIdeaComponent]
    });
    fixture = TestBed.createComponent(UserIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
