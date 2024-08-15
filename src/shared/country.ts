import { Entity, Fields, Relations } from 'remult'
import { City } from './city'

@Entity('countries', {
  allowApiCrud: true,
})
export class Country {
  @Fields.cuid()
  id = ''

  @Fields.string()
  title = ''

  @Fields.number()
  standartOfLiving = 0

  @Fields.number()
  budget = 1000

  @Fields.boolean()
  hasNuclearTechnology = false

  @Fields.number()
  bombsAmount = 0

  @Relations.toMany(() => City)
  cities!: City[]

  buy(price: number): boolean {
    if (this.budget >= price) {
      this.budget = this.budget - price;
      console.log('Государство %s потратило %i$.', this.title, price);
      return true;
    } else {
      console.log('Государству %s не хватило %i$.', this.title, price - this.budget);
      return false;
    }
  }
}