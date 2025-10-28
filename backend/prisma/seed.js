import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedData = [
  {
    title: "Inception",
    type: "MOVIE",
    director: "Christopher Nolan",
    budget: "$160M",
    location: "Los Angeles, Paris",
    duration: "148 min",
    yearTime: "2010",
    description: "Mind-bending heist within dreams"
  },
  {
    title: "Breaking Bad",
    type: "TV_SHOW",
    director: "Vince Gilligan",
    budget: "$3M per episode",
    location: "Albuquerque",
    duration: "49 min per episode",
    yearTime: "2008-2013",
    description: "Chemistry teacher becomes meth kingpin"
  }
];

async function main() {
  await prisma.favorite.deleteMany();
  await prisma.favorite.createMany({ data: seedData });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
