import { remultExpress } from 'remult/remult-express'
import { Country } from '../shared/country'
import { City } from '../shared/city'
import { Sanction } from '../shared/sanction'
import { Ecology } from '../shared/ecology'

export const api = remultExpress({
    entities: [Country, City, Sanction, Ecology],
    admin: true
})