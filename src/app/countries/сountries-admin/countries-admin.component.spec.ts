import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryAdminComponent } from './countries-admin.component';

describe('CountryComponent', () => {
  let component: CountryAdminComponent;
  let fixture: ComponentFixture<CountryAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
