import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Country } from '../../shared/country';
import { remult } from 'remult'
import { CitiesComponent } from '../cities/cities.component';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [NgFor, CitiesComponent],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})
export class CountriesComponent {
  countryRepo = remult.repo(Country);
  countries: Country[] = [];
  unsubscribe = () => {}

  ngOnInit() {
    this.countryRepo.liveQuery({
      orderBy: { standartOfLiving: "desc", title: "asc" }
    }).subscribe(info => (this.countries = info.applyChanges(this.countries)))
  }

  ngOnDestroy() {
    this.unsubscribe()
  }
}