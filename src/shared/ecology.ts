import { Entity, Fields } from 'remult'

@Entity('ecology', {
  allowApiCrud: true,
})
export class Ecology {
  @Fields.number()
  level = 0;
}