import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { City } from '../../shared/city';
import { remult } from 'remult';
import { Country } from '../../shared/country';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [NgFor],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css'
})
export class CitiesComponent {
  cityRepo = remult.repo(City);
  cities: City[] = [];
  @Input() parentCountry!: Country;
  unsubscribe = () => {}

  ngOnInit() {
    this.cityRepo.liveQuery({
      where: { country: this.parentCountry }
    }).subscribe(info => (this.cities = info.applyChanges(this.cities)));
  }
  
  ngOnDestroy() {
    this.unsubscribe()
  }
}
