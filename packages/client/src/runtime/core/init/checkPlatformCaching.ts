import Debug from '@prisma/debug'
import { PrismaClientInitializationError } from '@prisma/engine-core'

import type { GetPrismaClientConfig } from '../../getPrismaClient'

const debug = Debug('prisma:client')

/**
 * Known platforms that have caching issues. Updating this list will also update
 * the error message and the link to the docs, so add docs/links as needed.
 */
const cachingPlatforms = {
  Vercel: 'vercel',
  'Netlify CI': 'netlify',
} as const

/**
 * Throws an error if the client has been generated via auto-install and the
 * platform is known to have caching issues. In that case, we will display a
 * useful error message, and ask the user to run `prisma generate` manually.
 * @returns
 */
export function checkPlatformCaching({ postinstall, ciName, clientVersion }: GetPrismaClientConfig) {
  debug('checkPlatformCaching:postinstall', postinstall)
  debug('checkPlatformCaching:ciName', ciName)

  // if client was not generated manually
  if (postinstall !== true) return

  // and we generated on one a caching CI
  if (ciName && ciName in cachingPlatforms) {
    throw new PrismaClientInitializationError(
      `We detected that your project setup might lead to outdated Prisma Client being used.
Please make sure to run the \`prisma generate\` command during your build process.
Learn how: https://pris.ly/d/${cachingPlatforms[ciName]}-build`,
      clientVersion,
    )
  }
}
