import { Entity, Fields, Relations } from 'remult'
import { Country } from './country'

@Entity('cities', {
  allowApiCrud: true,
})
export class City {
  @Fields.cuid()
  id = ''

  @Relations.toOne(() => Country, {defaultIncluded: true})
  country!: Country

  @Fields.string()
  title = ''

  @Fields.number()
  development = 50

  @Fields.boolean()
  hasShield = false

  @Fields.boolean()
  alive = true
}