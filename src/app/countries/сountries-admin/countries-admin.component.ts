import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Country } from '../../../shared/country';
import { City } from '../../../shared/city';
import { remult } from 'remult';
import { CitiesAdminComponent } from "../../cities/cities-admin/cities-admin.component";
import { SanctionsComponent } from '../../sanctions/sanctions.component';
import { NuclearComponent } from "../../nuclear/nuclear.component";
import { EcologyUpdateService } from '../../services/ecology-update/ecology-update.service';
import { FormsModule } from '@angular/forms';
import { EndTurnService } from '../../services/end-turn/end-turn.service';
import { Subscription } from 'rxjs';
import { Sanction } from '../../../shared/sanction';
import { Ecology } from '../../../shared/ecology';

@Component({
  selector: 'app-country-admin',
  standalone: true,
  imports: [NgFor, NgIf, CitiesAdminComponent, SanctionsComponent, NuclearComponent, FormsModule],
  templateUrl: './countries-admin.component.html',
  styleUrl: './countries-admin.component.css'
})
export class CountryAdminComponent {
  countryRepo = remult.repo(Country);
  cityRepo = remult.repo(City);
  sanctionsRepo = remult.repo(Sanction);
  ecologyRepo = remult.repo(Ecology)

  countries: Country[] = [];

  payee!: Country;
  ecology!: Ecology;

  @Input('inputGiftedMoney')
  giftAmount: number = 0;

  private notificationSubscription!: Subscription;

  unsubscribe = () => {};

  constructor(private ecologyUpdateService: EcologyUpdateService, private endTurnService: EndTurnService) {};

  ngOnInit() {
    this.countryRepo.liveQuery({
      include: { cities: true },
      orderBy: { standartOfLiving: "desc", title: "asc" }
    }).subscribe(info => (this.countries = info.applyChanges(this.countries)));

    this.ecologyRepo.liveQuery({
      limit: 1
    }).subscribe(info => (this.ecology = info.items[0]));

    this.notificationSubscription = this.endTurnService.notification$.subscribe(
      (message) => {
        this.handleNotification(message);
      }
    );
  };

  handleNotification(message: String) {
    if (message == 'countResults') {
      for (let country of this.countries) {
        this.countStandartOfLiving(country);
        this.countBudget(country);
      }
    };
    if (message == 'saveResults') {
      this.saveResults();
    }
  }

  async saveResults() {
    for (let country of this.countries) {
      try {
        await this.countryRepo.save(country);
      } catch(error: any) {
      }
    }
    this.ngOnInit();
  };

  ngOnDestroy() {
    this.unsubscribe();
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    };
  };

  async investInTheEcology(country: Country) {
    if (country.buy(200)) {
      this.sendEcologyNotification();
      console.log('Государство %s инвестировало в экологию.', country.title);
    };
  };

  async sendGift(country: Country) {
    if (country.buy(this.giftAmount)) {
      this.payee.budget = this.payee.budget + this.giftAmount;
      console.log('Государство %s подарило %i государству %s.', country.title, this.giftAmount, this.payee.title);
    }
  }

  async countStandartOfLiving(country: Country) {
    let cities = await this.cityRepo.find({
      where: {
        country: await this.countryRepo.find({
          where: { id: country.id }
        })
      }
    });
    let sum: number = 0;
    for (let city of cities) {
      if (city.alive) {
        sum = sum + city.development;
      }
    }
    country.standartOfLiving = Math.round(sum / 4);
  }

  async countBudget(country: Country) {
    let cities = await this.cityRepo.find({
      where: {
        country: await this.countryRepo.find({
          where: { id: country.id }
        })
      }
    });

    let developmentSum = 0;

    for (let city of cities) {
      developmentSum = developmentSum + city.development;
    };

    let sanctions: Sanction[];

    sanctions = await this.sanctionsRepo.find({
      where: { targetId: country.id}
    });

    country.budget = Math.round(country.budget + (developmentSum  * 3 * (this.ecology.level/100) * Math.pow(0.9, sanctions.length)));
    this.countryRepo.save(country);
  }

  sendEcologyNotification() {
    this.ecologyUpdateService.updateEcology(10);
  };
}