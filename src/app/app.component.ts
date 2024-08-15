import { Component, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountriesComponent } from './countries/countries.component';
import { EcologyComponent } from "./ecology/ecology.component";
import { CountryAdminComponent } from './countries/сountries-admin/countries-admin.component';
import * as htmlToImage from 'html-to-image';
import { SettingsComponent } from "./settings/settings.component";
import { remult } from 'remult';
import { Sanction } from '../shared/sanction';
import { Country } from '../shared/country';
import { City } from '../shared/city';
import { EndTurnService } from './services/end-turn/end-turn.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CountriesComponent, EcologyComponent, CountryAdminComponent, SettingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'world-domination-app';
  countryRepo = remult.repo(Country);
  cityRepo = remult.repo(City);
  sanctionRepo = remult.repo(Sanction)

  constructor(zone: NgZone, private endTurnService: EndTurnService) {
    remult.apiClient.wrapMessageHandling = handler => zone.run(() => handler());
  };

  endMove() {
    this.endTurnService.sendMessage('saveEcology')
    // this.endTurnService.sendMessage('saveSanctions');
    this.endTurnService.sendMessage('saveCities');
    this.endTurnService.sendMessage('updateNuclearEvents');
    this.endTurnService.sendMessage('countResults');
    this.endTurnService.sendMessage('saveResults');
  };

  shareVisibleResults() {
    var visibleResultsElement = document.getElementById('visibleResults')!;
    htmlToImage.toJpeg(visibleResultsElement, { quality: 0.95 }).then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = 'results.jpeg';
      link.href = dataUrl;
      link.click();
    });
  }
}