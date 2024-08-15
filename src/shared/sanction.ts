import { Entity, Fields, Relations } from 'remult'

@Entity('sanctions', {
  allowApiCrud: true,
})
export class Sanction {
  @Fields.cuid()
  id: string = ''

  @Fields.string()
  countryId: string = ''

  @Fields.string()
  countryName: string = ''

  @Fields.string()
  targetId: string = ''

  @Fields.string()
  targetName: string = ''
}