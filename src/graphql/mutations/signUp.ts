import prisma from '../../prisma'
import { hashSync } from 'bcrypt'

export default async (_, { data: { email, password, firstName, lastName, location, roles } }, ctx, info) => {
    const exists = await prisma.exists.User({ email })
    if(exists) throw new Error('Email Already Exists')
    const hash = hashSync(password, 10)
    const user = await prisma.mutation.createUser({ data: {
      email,
      hash,
      firstName,
      lastName,
      location,
      roles
    }}) 
  if(user) return true
  else return false
}