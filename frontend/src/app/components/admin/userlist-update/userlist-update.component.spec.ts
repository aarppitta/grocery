import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistUpdateComponent } from './userlist-update.component';

describe('UserlistUpdateComponent', () => {
  let component: UserlistUpdateComponent;
  let fixture: ComponentFixture<UserlistUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserlistUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserlistUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
