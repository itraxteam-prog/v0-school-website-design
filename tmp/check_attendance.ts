
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const attendance = await prisma.attendance.findMany({
        orderBy: { date: 'desc' },
        take: 20
    })
    console.log(JSON.stringify(attendance, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
