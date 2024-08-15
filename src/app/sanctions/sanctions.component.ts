import { Component } from '@angular/core';
import { Country } from '../../shared/country';
import { Input } from '@angular/core';
import { Sanction } from '../../shared/sanction';
import { remult } from 'remult';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SanctionUpdateService } from '../services/sanction-update/sanction-update.service';
import { Subscription } from 'rxjs';
import { EndTurnService } from '../services/end-turn/end-turn.service';

@Component({
  selector: 'app-sanctions',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './sanctions.component.html',
  styleUrl: './sanctions.component.css'
})
export class SanctionsComponent {
  @Input() parentCountry!: Country;

  sanctionRepo = remult.repo(Sanction);
  countryRepo = remult.repo(Country);

  private notificationSanctionSubscription!: Subscription;
  private notificationEndTurnSubscription!: Subscription;

  sanctionsTargets: Sanction[] = [];
  countrySanctions: Sanction[] = [];

  countries: Country[] = [];

  selectedCountry!: Country | undefined;

  unsubscribe = () => {};

  constructor(private sanctionUpdateService: SanctionUpdateService, private endTurnService: EndTurnService) {};

  ngOnInit() {
    this.sanctionRepo.liveQuery({
      where: { countryId: this.parentCountry.id },
    // }).subscribe(info => (this.sanctionsTargets = info.applyChanges(this.sanctionsTargets)));
    }).subscribe(({items}) => this.sanctionsTargets = items)

    this.sanctionRepo.liveQuery({
      where: { targetId: this.parentCountry.id}
    // }).subscribe(info => (this.countrySanctions = info.applyChanges(this.countrySanctions)));
    }).subscribe(({items}) => this.countrySanctions = items)

    this.countryRepo.liveQuery({
      where:{
        id: { $ne: this.parentCountry.id }
      }
    }).subscribe((items) => {
      this.countries = items.applyChanges(this.countries); 
      this.selectedCountry = items.items[0]
    });

    this.notificationSanctionSubscription = this.sanctionUpdateService.notification$.subscribe(
      (sanction) => {
        this.handleSanctionNotification(sanction);
      }
    );

    this.notificationEndTurnSubscription = this.endTurnService.notification$.subscribe(
      (message) => {
        this.handleEndTurnNotification(message);
      }
    );
  };

  async addTarget() {
    if (!(this.selectedCountry === undefined)) {
      var newSanction = await this.sanctionRepo.insert({
        targetId: this.selectedCountry.id,
        countryId: this.parentCountry.id,
        targetName: this.selectedCountry.title,
        countryName: this.parentCountry.title
      });
      // this.sanctionsTargets.push(newSanction);
      // this.sanctionUpdateService.sendNotification(newSanction);
      console.log('Государство %s ввело санкции против государства %s.', this.parentCountry.title, this.selectedCountry.title)

      const index = this.countries.findIndex(country => country.id === this.selectedCountry!.id);
      if (index !== -1) {
        this.countries.splice(index, 1);
        if (this.countries.length > 0) {
          this.selectedCountry = this.countries[0];
        }
      };
    };
  };

  async handleSanctionNotification(sanction: Sanction) {
    if (sanction.targetId == this.parentCountry.id) {
      this.addSanction(sanction.countryId);
    };
  };

  async handleEndTurnNotification(message: string) {
    if (message == 'saveSanctions') {
      for (let sanction of this.sanctionsTargets) {
        if (sanction.id) {
          continue;
        }
        this.saveSanction(sanction)
      };
    }
  }

  async saveSanction(sanction: Sanction) {
    try {
      await this.sanctionRepo.save(sanction);
    } catch(error: any) {
    }
  }

  async addSanction(countryId: string) {
    let country = await this.countryRepo.findOne({
      where: {
        id: countryId
      }
    });
    var newSanction = this.sanctionRepo.create({
      targetId: this.parentCountry.id,
      countryId: country.id,
      targetName: this.parentCountry.title,
      countryName: country.title
    });
    this.countrySanctions.push(newSanction);
  };

  ngOnDestroy() {
    this.unsubscribe();
    if (this.notificationSanctionSubscription) {
      this.notificationSanctionSubscription.unsubscribe();
    };

    if (this.notificationEndTurnSubscription) {
      this.notificationEndTurnSubscription.unsubscribe();
    };
  }
}