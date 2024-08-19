import { Component } from '@angular/core';
import { remult } from 'remult';
import { Country } from '../../shared/country';
import { City } from '../../shared/city';
import { Ecology } from '../../shared/ecology';
import { Sanction } from '../../shared/sanction';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  countryRepo = remult.repo(Country);
  cityRepo = remult.repo(City);
  ecologyRepo = remult.repo(Ecology);
  sanctionsRepo = remult.repo(Sanction);

  async startNewGame() {
    this.ecologyRepo.delete(await this.ecologyRepo.findOne());
    await this.ecologyRepo.insert({level: 90});

    var deleteCities = await this.cityRepo.find();
    for (let city of deleteCities) {
      await this.cityRepo.delete(city);
    };

    var deleteSanctions = await this.sanctionsRepo.find();
    for (let sanction of deleteSanctions) {
      await this.sanctionsRepo.delete(sanction);
    };

    var deleteCountries = await this.countryRepo.find();
    for (let country of deleteCountries) {
      await this.cityRepo.delete(country);
    };

    var country = await this.countryRepo.insert({ title: "Россия" });
    await this.countryRepo.relations(country).cities.insert([
      {
        title: "Москва",
        development: 75
      },
      {
        title: "Санкт-Петербург"
      },
      {
        title: "Воронеж",
        development: 25
      },
      {
        title: "Барнаул"
      }
    ]);

    country = await this.countryRepo.insert({ title: "США" });
    await this.countryRepo.relations(country).cities.insert([
      {
        title: "Вашингтон"
      },
      {
        title: "Детройт",
        development: 25
      },
      {
        title: "Нью-Йорк"
      },
      {
        title: "Лос-Анджелес",
        development: 75
      }
    ]);

    country = await this.countryRepo.insert({ title: "КНДР" });
    await this.countryRepo.relations(country).cities.insert([
      {
        title: "Пхеньян",
        development: 75
      },
      {
        title: "Кэсон"
      },
      {
        title: "Нампхо",
        development: 25
      },
      {
        title: "Насон"
      }
    ]);

    country = await this.countryRepo.insert({ title: "Германия" });
    await this.countryRepo.relations(country).cities.insert([
      {
        title: "Берлин",
        development: 75
      },
      {
        title: "Мюнхен"
      },
      {
        title: "Дрезден"
      },
      {
        title: "Гамбург",
        development: 25,
      }
    ]);

    country = await this.countryRepo.insert({ title: "Иран" });
    await this.countryRepo.relations(country).cities.insert([
      {
        title: "Тегеран",
        development: 75
      },
      {
        title: "Йезд"
      },
      {
        title: "Мешхед"
      },
      {
        title: "Исфахан",
        development: 25
      }
    ]);

    country = await this.countryRepo.insert({ title: "Израиль" });
    await this.countryRepo.relations(country).cities.insert([
      {
        title: "Тель-Авив",
        development: 75
      },
      {
        title: "Иерусалим"
      },
      {
        title: "Хайфа"
      },
      {
        title: "Ашдод",
        development: 25
      }
    ]);

    country = await this.countryRepo.insert({ title: "Китай" });
    await this.countryRepo.relations(country).cities.insert([
      {
        title: "Пекин",
        development: 75
      },
      {
        title: "Шанхай"
      },
      {
        title: "Гуанчжоу"
      },
      {
        title: "Тяньцзинь",
        development: 25
      }
    ]);

    this.updateStandartsOfLiving();
  }
  
  async updateStandartsOfLiving() {
    var countries: Country[] = [];
    await this.countryRepo.find({
      include: {
        cities: true
      }
    }).then((items) => (countries = items));
    for (let country of countries) {
      this.countStandartOfLiving(country);
      this.countryRepo.save(country);
    }
  }

  async countStandartOfLiving(country: Country) {
    let cities = country.cities;
    let sum: number = 0;
    for (let city of cities) {
      if (city.alive) {
        sum = sum + city.development;
      }
    }
    country.standartOfLiving = Math.round(sum / 4);
  }
}