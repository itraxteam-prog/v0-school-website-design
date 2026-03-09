import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting image cleanup...');

    // Find users with base64 images
    const users = await prisma.user.findMany({
        where: {
            image: {
                startsWith: 'data:image',
            },
        },
        select: {
            id: true,
            email: true,
        },
    });

    console.log(`Found ${users.length} users with base64 images.`);

    for (const user of users) {
        console.log(`Cleaning up image for user: ${user.email}`);
        await prisma.user.update({
            where: { id: user.id },
            data: { image: null },
        });
    }

    console.log('Cleanup complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
