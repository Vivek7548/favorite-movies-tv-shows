import { PrismaClient } from '@prisma/client';

;
(async() => {
    try {
        const p = new PrismaClient();
        console.log('Prisma client keys:', Object.keys(p));
        console.log('has favorite:', typeof p.favorite !== 'undefined');
        await p.$disconnect();
    } catch (e) {
        console.error('error creating prisma client', e);
        process.exit(1);
    }
})()