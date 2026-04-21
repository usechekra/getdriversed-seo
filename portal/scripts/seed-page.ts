import { prisma } from '../src/lib/db'

async function main() {
  // Find admin user to assign as owner
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true, email: true },
  })

  if (!admin) {
    console.error('No admin user found')
    process.exit(1)
  }

  const page = await prisma.page.upsert({
    where: { url: 'https://getdriversed.com/courses-details/california-traffic-school/en' },
    update: {},
    create: {
      url: 'https://getdriversed.com/courses-details/california-traffic-school/en',
      slug: 'california-traffic-school',
      primaryKeyword: 'California Traffic School Online',
      secondaryKeywords: 'california traffic school, online traffic school california, CA traffic school, DMV approved traffic school california',
      pageType: 'state-course-page',
      state: 'California',
      status: 'IN_PROGRESS',
      scoreBefore: 9,
      scoreAfter: null,
      scoreProjected: 93,
      wordCountBefore: 77,
      wordCountAfter: null,
      dateOptimized: new Date('2026-04-18'),
      folderPath: 'pages/_completed/california-traffic-school',
      ownerId: admin.id,
      notes: 'Dev handoff complete. Awaiting implementation. Fill CA DMV TVS license # and pricing in schema before deploying.',
    },
  })

  console.log(`✅ Page created: ${page.primaryKeyword} (${page.id})`)
  console.log(`   Owner: ${admin.email}`)
  console.log(`   Score: ${page.scoreBefore} → projected ${page.scoreProjected}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
