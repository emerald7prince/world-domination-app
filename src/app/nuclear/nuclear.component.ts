import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { City } from '../../shared/city';
import { Country } from '../../shared/country';
import { EcologyUpdateService } from '../services/ecology-update/ecology-update.service';
import { remult } from 'remult';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EndTurnService } from '../services/end-turn/end-turn.service';

@Component({
  selector: 'app-nuclear',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './nuclear.component.html',
  styleUrl: './nuclear.component.css'
})
export class NuclearComponent {
  @Input() parentCountry!: Country;

  cityRepo = remult.repo(City);

  technologyJustBought: boolean = false;
  bombsBuyed: number = 0;

  bombsTargets: City[] = [];
  cities: City[] = [];

  selectedCity!: City;

  private notificationEndTurnSubscription!: Subscription;


  constructor(private ecologyUpdateService: EcologyUpdateService, private endTurnService: EndTurnService) {};

  ngOnInit() {
    this.cityRepo.liveQuery({
      where: {
        alive: true
      }
    }).subscribe((items) => (this.cities = items.applyChanges(this.cities)));

    this.notificationEndTurnSubscription = this.endTurnService.notification$.subscribe(
      (message) => {
        this.handleEndTurnNotification(message);
      }
    );
  };

  async attack() {
    if (this.parentCountry.bombsAmount > 0) {
      this.bombsTargets.push(this.selectedCity);
      this.parentCountry.bombsAmount--;
      console.log('Государство %s атаковало город %s.', this.parentCountry.title, this.selectedCity.title);
    } else {
      console.log('У государства %s не хватает доступных для атаки ядерных бомб.', this.parentCountry.title)
    }
  }

  async handleEndTurnNotification(message: String) {
    if (message == 'updateNuclearEvents') {
      this.parentCountry.bombsAmount = this.parentCountry.bombsAmount + this.bombsBuyed;
      this.bombsBuyed = 0;
      this.technologyJustBought = false;

      for (let target of this.bombsTargets) {
        let city = await this.cityRepo.findOne({
          where: {
            title: target.title,
          }
        });
        if (city.hasShield) {
          city.hasShield = false;
        } else {
          city.alive = false;
          city.development = 0;
        }
        await this.cityRepo.save(city);
      }

      this.bombsTargets = [];
    }
  };

  async buyNuclearTechnologies() {
    if (this.parentCountry.buy(500)) {
      this.technologyJustBought = true;
      this.parentCountry.hasNuclearTechnology = true;
      console.log('Государство %s приобрело ядерные технологии.', this.parentCountry.title);
    };
  };

  async buyBomb() {
    if (!this.technologyJustBought) {
      if (this.bombsBuyed < 3) {
        if (this.parentCountry.buy(150)) {
          console.log('Государство %s приобрело ядерную бомбу. Текущее количество бомб: %i.', this.parentCountry.title, this.parentCountry.bombsAmount);
          this.sendEcologyNotification();
          this.bombsBuyed++;
          console.log('Государство %s купило %i ЯБ на этом ходу.', this.parentCountry.title, this.bombsBuyed);
        };
      }
      else {
        console.log('Государство %s уже купило 3 ЯБ на этом ходу.', this.parentCountry.title);
      };
    }
    else {
      console.log('Государство %s не может покупать ядерные бомбы, так как они доступны со следующего хода после приобретения технологий.', this.parentCountry.title);
    }
  };

  sendEcologyNotification() {
    this.ecologyUpdateService.updateEcology(-2);
  };
}
