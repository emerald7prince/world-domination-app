import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { City } from '../../../shared/city';
import { remult } from 'remult';
import { Country } from '../../../shared/country';
import { Subscription } from 'rxjs';
import { EndTurnService } from '../../services/end-turn/end-turn.service';

@Component({
  selector: 'app-cities-admin',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './cities-admin.component.html',
  styleUrl: './cities-admin.component.css'
})
export class CitiesAdminComponent {
  cityRepo = remult.repo(City);
  cities: City[] = [];
  @Input() parentCountry!: Country;
  unsubscribe = () => {};

  private notificationSubscription!: Subscription;

  constructor(private endTurnService: EndTurnService){}

  ngOnInit() {
    this.cityRepo.liveQuery({
      where: { country: this.parentCountry }
    }).subscribe(info => (this.cities = info.applyChanges(this.cities)));

    this.notificationSubscription = this.endTurnService.notification$.subscribe(
      (message) => {
        this.handleNotification(message);
      }
    );
  };

  handleNotification(message: string) {
    if (message == 'saveCities') {
      this.saveCities();
      return;
    }
  };

  async saveCities() {
    for (let i = 0; i < this.cities.length; i++) {
      try {
        await this.cityRepo.save(this.cities[i]);
      } catch (error: any) {
      }
    }
  };
  
  ngOnDestroy() {
    this.unsubscribe();
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    };
  };

  async setShield(city: City) {
    if (this.parentCountry.buy(200)) {
      city.hasShield = true;
      console.log('Государство %s установило щит на город %s.', this.parentCountry.title, city.title);
    }
  };

  async upgrade(city: City) {
    if (this.parentCountry.buy(150)) {
      city.development = Math.round(city.development * 1.25);
      console.log('Государство %s улучшило город %s.', this.parentCountry.title, city.title);
    }
  };
}