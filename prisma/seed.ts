import type { Category } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createCategory } from "~/models/category.server";
import { createGame } from "~/models/game.server";
import { createHero } from "~/models/honhero.server";
import { createHoNRun } from "~/models/honrun.server";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@testson.mail";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("tester1234", 10);

  const user = await prisma.user.upsert({
    where: { email: email },
    create: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
    update: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await createGame("Heroes of Newerth");

  const categoryNames = [
    "2 player all lanes",
    "1 player all lanes",
    "1 player one lane",
  ];

  let categories: Array<Category> = [];
  for (const categoryName of categoryNames) {
    const category = await createCategory(categoryName, "Heroes of Newerth");
    if (category) {
      categories.push(category);
    }
  }

  const heroes = [
    { name: "Accursed" },
    { name: "Aluna" },
    { name: "Andromeda" },
    { name: "Arachna" },
    { name: "Armadon" },
    { name: "Artesia" },
    { name: "Artillery" },
    { name: "Balphagore" },
    { name: "Behemoth" },
    { name: "Blacksmith" },
    { name: "Blitz" },
    { name: "Blood Hunter" },
    { name: "Bombardier" },
    { name: "Bramble" },
    { name: "Bubbles" },
    { name: "Bushwack" },
    { name: "Chronos" },
    { name: "Corrupted Disciple" },
    { name: "Dampeer" },
    { name: "Deadwood" },
    { name: "Defiler" },
    { name: "Demented Shaman" },
    { name: "Devourer" },
    { name: "Doctor Repulsor" },
    { name: "Draconis" },
    { name: "Drunken Master" },
    { name: "Electrician" },
    { name: "Emerald Warden" },
    { name: "Empath" },
    { name: "Engineer" },
    { name: "Fayde" },
    { name: "Flint Beastwood" },
    { name: "Flux" },
    { name: "Forsaken Archer" },
    { name: "Gauntlet" },
    { name: "Gemini" },
    { name: "Geomancer" },
    { name: "Glacius" },
    { name: "Gravekeeper" },
    { name: "Grinex" },
    { name: "Hammerstorm" },
    { name: "Hellbringer" },
    { name: "Jereziah" },
    { name: "Keeper of the forest" },
    { name: "Kinesis" },
    { name: "Kraken" },
    { name: "Legionnaire" },
    { name: "Lodestone" },
    { name: "Lord Salforis" },
    { name: "Madman" },
    { name: "Magebane" },
    { name: "Magmus" },
    { name: "Maliken" },
    { name: "Martyr" },
    { name: "Master of Arms" },
    { name: "Monarch" },
    { name: "Moon Queen" },
    { name: "Moraxus" },
    { name: "Myrmidon" },
    { name: "Night Hound" },
    { name: "Nymphora" },
    { name: "Oogie" },
    { name: "Ophelia" },
    { name: "Pandamonium" },
    { name: "Parasite" },
    { name: "Pearl" },
    { name: "Pebbles" },
    { name: "Pestilence" },
    { name: "Pharao" },
    { name: "Plague Rider" },
    { name: "Pollywog Priest" },
    { name: "Predator" },
    { name: "Prisoner 945" },
    { name: "Puppet Master" },
    { name: "Pyromancer" },
    { name: "Rally" },
    { name: "Rampage" },
    { name: "Revenant" },
    { name: "Rhapsody" },
    { name: "Riftwalker" },
    { name: "Sand Wraith" },
    { name: "Scout" },
    { name: "Shadowblade" },
    { name: "Sir Benzington" },
    { name: "Slither" },
    { name: "Solstice" },
    { name: "Soul Reaper" },
    { name: "Soulstealer" },
    { name: "Succubus" },
    { name: "Swiftblade" },
    { name: "Tempest" },
    { name: "The Chipper" },
    { name: "The Dark Lady" },
    { name: "Thunderbringer" },
    { name: "Torturer" },
    { name: "Tremble" },
    { name: "Tundra" },
    { name: "Valkyrie" },
    { name: "Vindicator" },
    { name: "Voodoo Jester" },
    { name: "War Beast" },
    { name: "Wildsoul" },
    { name: "Witch Slayer" },
    { name: "Wretched Hag" },
    { name: "Zephyr" },
  ];

  for (const hero of heroes) {
    await createHero(hero);
  }

  const runs = [
    {
      title: "He does it",
      category: categories[1],
      heroes: [heroes[0]],
      time: "1:33:07",
      slug: "hon-1",
      users: [user.id],
    },
    {
      title: "Hei does it again",
      category: categories[2],
      heroes: [heroes[20]],
      time: "1:33:07",
      slug: "hon-2",
      user: [user.id],
    },
  ];

  for (const run of runs) {
    await createHoNRun(
      {
        gameName: "Heroes of Newerth".toLowerCase(),
        slug: run.slug,
        time: run.time,
        title: run.title,
        note: null,
      },
      run.heroes,
      [user],
      run.category.id
    );
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
