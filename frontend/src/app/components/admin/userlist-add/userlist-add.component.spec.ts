import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistAddComponent } from './userlist-add.component';

describe('UserlistAddComponent', () => {
  let component: UserlistAddComponent;
  let fixture: ComponentFixture<UserlistAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserlistAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserlistAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
