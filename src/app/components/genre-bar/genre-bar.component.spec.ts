import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreBarComponent } from './genre-bar.component';

describe('GenreBarComponent', () => {
  let component: GenreBarComponent;
  let fixture: ComponentFixture<GenreBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenreBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
