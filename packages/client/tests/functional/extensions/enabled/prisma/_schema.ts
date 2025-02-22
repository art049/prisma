import { foreignKeyForProvider, idForProvider } from '../../../_utils/idForProvider'
import testMatrix from '../_matrix'

export default testMatrix.setupSchema(({ provider }) => {
  return /* Prisma */ `
  generator client {
    provider = "prisma-client-js"
    previewFeatures = ["clientExtensions"]
  }
  
  datasource db {
    provider = "${provider}"
    url      = env("DATABASE_URI_${provider}")
  }
  
  model User {
    id ${idForProvider(provider)}
    email String @unique
    firstName String
    lastName String
    posts Post[]
  }

  model Post {
    id ${idForProvider(provider)}
    user User @relation(fields: [userId], references: [id])
    userId ${foreignKeyForProvider(provider)}
  }
  `
})
