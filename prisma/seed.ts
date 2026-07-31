/**
 * Database seed script.
 *
 * Run with `npm run db:seed`. Safe to re-run: it upserts everything, so it
 * never creates duplicates.
 *
 * Seeds:
 *  - the 5 fixed roles + one demo login per role (see printed credentials)
 *  - 30 tables for the floor plan
 *  - opening hours matching the public site footer
 *  - core settings (restaurant profile)
 *  - menu categories/items/allergens, gallery, reviews and events (reusing
 *    the same content already shown on the public site, so dashboard and
 *    site agree on day one)
 *  - a handful of customers + reservations (including several *today*) so
 *    the dashboard overview has real numbers to show immediately
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ROLE_KEYS, ROLE_LABELS, ROLE_PERMISSIONS, type RoleKey } from "../src/lib/permissions";
import { MENU_CATEGORIES, MENU_ITEMS } from "../src/lib/menu-data";
import { GALLERY_IMAGES } from "../src/lib/gallery-data";
import { REVIEWS } from "../src/lib/reviews-data";
import { EVENTS } from "../src/lib/events-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = "kitchen123";

const DEMO_USERS: Record<RoleKey, { name: string; email: string }> = {
  OWNER: { name: "Mark Bruinsma", email: "eigenaar@thekitchenveendam.nl" },
  MANAGER: { name: "Iris Kamphuis", email: "manager@thekitchenveendam.nl" },
  STAFF: { name: "Tom Veldkamp", email: "medewerker@thekitchenveendam.nl" },
  KITCHEN: { name: "Daan Hoekstra", email: "keuken@thekitchenveendam.nl" },
  GUEST: { name: "Gast Account", email: "gast@thekitchenveendam.nl" },
};

function parsePrice(price: string): number {
  const match = price.replace(",", ".").match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

async function seedRolesAndUsers() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const key of ROLE_KEYS) {
    const role = await prisma.role.upsert({
      where: { key },
      update: { label: ROLE_LABELS[key], permissions: ROLE_PERMISSIONS[key] },
      create: { key, label: ROLE_LABELS[key], permissions: ROLE_PERMISSIONS[key] },
    });

    const demo = DEMO_USERS[key];
    await prisma.user.upsert({
      where: { email: demo.email },
      update: { name: demo.name, roleId: role.id },
      create: { name: demo.name, email: demo.email, passwordHash, roleId: role.id },
    });
  }

  console.log("\nDemo-inloggegevens (wachtwoord voor alle rollen: %s)", DEMO_PASSWORD);
  for (const key of ROLE_KEYS) {
    console.log(`  ${ROLE_LABELS[key].padEnd(12)} ${DEMO_USERS[key].email}`);
  }
}

async function seedTables() {
  const cols = 6;
  for (let n = 1; n <= 30; n++) {
    const col = (n - 1) % cols;
    const row = Math.floor((n - 1) / cols);
    const zone = n % 5 === 0 ? "terras" : "binnen";
    const capacity = [2, 2, 4, 4, 4, 6, 8][n % 7];
    await prisma.table.upsert({
      where: { number: n },
      update: {},
      create: {
        number: n,
        capacity,
        zone,
        status: "vrij",
        posX: 80 + col * 140,
        posY: 80 + row * 140,
      },
    });
  }
}

async function seedOpeningHours() {
  const hours = [
    { dayOfWeek: 1, openTime: null, closeTime: null, closed: true }, // Maandag
    { dayOfWeek: 2, openTime: "11:00", closeTime: "22:00", closed: false },
    { dayOfWeek: 3, openTime: "11:00", closeTime: "22:00", closed: false },
    { dayOfWeek: 4, openTime: "11:00", closeTime: "22:00", closed: false },
    { dayOfWeek: 5, openTime: "11:00", closeTime: "23:00", closed: false },
    { dayOfWeek: 6, openTime: "11:00", closeTime: "23:00", closed: false },
    { dayOfWeek: 0, openTime: "12:00", closeTime: "22:00", closed: false }, // Zondag
  ];
  for (const h of hours) {
    await prisma.openingHour.upsert({
      where: { dayOfWeek: h.dayOfWeek },
      update: h,
      create: h,
    });
  }
}

async function seedSettings() {
  const settings: Record<string, unknown> = {
    restaurant_name: "The Kitchen Veendam",
    address: "Prins Hendrikplein 5, 9641 GJ Veendam",
    phone: "0598 - 123 456",
    email: "info@kitchenveendam.nl",
    average_spend_per_guest: 32.5,
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
  }
}

async function seedMenu() {
  const categoryByKey = new Map<string, string>();
  for (const [i, cat] of MENU_CATEGORIES.entries()) {
    const record = await prisma.menuCategory.upsert({
      where: { key: cat.key },
      update: { label: cat.label, emoji: cat.emoji, sortOrder: i },
      create: { key: cat.key, label: cat.label, emoji: cat.emoji, sortOrder: i },
    });
    categoryByKey.set(cat.key, record.id);
  }

  const allergenByName = new Map<string, string>();
  const allAllergenNames = new Set(MENU_ITEMS.flatMap((item) => item.allergens));
  for (const name of allAllergenNames) {
    const record = await prisma.allergen.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    allergenByName.set(name, record.id);
  }

  for (const item of MENU_ITEMS) {
    const categoryId = categoryByKey.get(item.category);
    if (!categoryId) continue;

    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } });
    const allergenRefs = item.allergens.map((name) => ({ id: allergenByName.get(name)! }));
    const base = {
      name: item.name,
      description: item.description,
      price: parsePrice(item.price),
      priceIsFrom: item.price.toLowerCase().startsWith("vanaf"),
      image: item.image,
      categoryId,
      spicyLevel: item.spicyLevel ?? null,
      vegetarian: item.vegetarian ?? false,
      chefsChoice: item.chefsChoice ?? false,
    };

    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: { ...base, allergens: { set: allergenRefs } },
      });
    } else {
      await prisma.menuItem.create({
        data: { ...base, allergens: { connect: allergenRefs } },
      });
    }
  }
}

const ASPECT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  square: { width: 1200, height: 1200 },
  portrait: { width: 1200, height: 1600 },
  landscape: { width: 1600, height: 1200 },
};

async function seedGallery() {
  for (const [i, image] of GALLERY_IMAGES.entries()) {
    const existing = await prisma.galleryImage.findFirst({ where: { url: image.src } });
    if (existing) continue;
    const { width, height } = ASPECT_DIMENSIONS[image.aspect] ?? ASPECT_DIMENSIONS.landscape;
    await prisma.galleryImage.create({
      data: {
        url: image.src,
        alt: image.alt,
        category: image.category,
        width,
        height,
        sortOrder: i,
      },
    });
  }
}

async function seedReviews() {
  const now = Date.now();
  for (const [i, review] of REVIEWS.entries()) {
    const existing = await prisma.review.findFirst({ where: { name: review.name, text: review.text } });
    if (existing) continue;
    await prisma.review.create({
      data: {
        name: review.name,
        rating: review.rating,
        text: review.text,
        source: "google",
        approved: true,
        date: new Date(now - (i + 1) * 6 * 24 * 60 * 60 * 1000),
      },
    });
  }
}

async function seedEvents() {
  for (const event of EVENTS) {
    const existing = await prisma.event.findFirst({ where: { name: event.name } });
    if (existing) continue;
    await prisma.event.create({
      data: {
        name: event.name,
        description: event.description,
        schedule: event.date,
        price: event.price,
        image: event.image,
        maxGuests: 40,
        ticketsSold: Math.floor(Math.random() * 20),
      },
    });
  }
}

async function seedCustomersAndReservations() {
  const names = [
    ["Marieke", "de Boer"],
    ["Johan", "Wiersema"],
    ["Sanne", "Mulder"],
    ["Ruben", "Postma"],
    ["Femke", "Bakker"],
    ["Erik", "Dijkstra"],
    ["Anouk", "Visser"],
    ["Bas", "Huisman"],
  ];

  const tables = await prisma.table.findMany({ orderBy: { number: "asc" } });
  const customers = [];
  for (const [first, last] of names) {
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@voorbeeld.nl`;
    const customer = await prisma.customer.upsert({
      where: { email },
      update: {},
      create: {
        name: `${first} ${last}`,
        email,
        phone: "06" + Math.floor(10000000 + Math.random() * 89999999),
        visits: Math.floor(Math.random() * 12) + 1,
        vip: Math.random() > 0.75,
        favoriteTableId: tables[Math.floor(Math.random() * tables.length)]?.id,
      },
    });
    customers.push(customer);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const times = ["12:00", "12:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];
  const statuses = ["confirmed", "confirmed", "confirmed", "pending"];

  let reservationCount = 0;
  for (let dayOffset = -2; dayOffset <= 5; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const countForDay = dayOffset === 0 ? 8 : 3 + Math.floor(Math.random() * 4);

    for (let i = 0; i < countForDay; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const time = times[Math.floor(Math.random() * times.length)];
      const table = tables[(reservationCount + i) % tables.length];
      const existing = await prisma.reservation.findFirst({
        where: { customerId: customer.id, date, time },
      });
      if (existing) continue;

      await prisma.reservation.create({
        data: {
          customerId: customer.id,
          tableId: table.id,
          date,
          time,
          partySize: 2 + Math.floor(Math.random() * 6),
          location: table.zone,
          wheelchair: false,
          highChair: Math.random() > 0.85,
          occasion: Math.random() > 0.8 ? "verjaardag" : null,
          status: dayOffset < 0 ? "completed" : statuses[Math.floor(Math.random() * statuses.length)],
        },
      });
      reservationCount++;
    }
  }
}

async function seedPersoneel() {
  const staffUser = await prisma.user.findUnique({ where: { email: DEMO_USERS.STAFF.email } });
  const kitchenUser = await prisma.user.findUnique({ where: { email: DEMO_USERS.KITCHEN.email } });

  const roster: {
    name: string;
    position: string;
    phone?: string;
    email?: string;
    contractHours?: number;
    userId?: string;
  }[] = [
    { name: staffUser!.name, position: "Bediening", contractHours: 32, userId: staffUser!.id },
    { name: kitchenUser!.name, position: "Keuken", contractHours: 36, userId: kitchenUser!.id },
    { name: "Lisa de Groot", position: "Bediening", phone: "06-23456789", contractHours: 16 },
    { name: "Youssef El Amrani", position: "Bar", phone: "06-34567890", contractHours: 12 },
    { name: "Nina Kramer", position: "Keuken", phone: "06-45678901", contractHours: 24 },
    { name: "Bram Oosting", position: "Schoonmaak", phone: "06-56789012", contractHours: 8 },
  ];

  const employeeByName = new Map<string, string>();
  for (const person of roster) {
    const existing = await prisma.employee.findFirst({ where: { name: person.name } });
    if (existing) {
      employeeByName.set(person.name, existing.id);
      continue;
    }
    const created = await prisma.employee.create({
      data: {
        name: person.name,
        position: person.position,
        phone: person.phone ?? null,
        email: person.email ?? null,
        contractHours: person.contractHours ?? null,
        userId: person.userId ?? null,
      },
    });
    employeeByName.set(person.name, created.id);
  }

  // A representative week of shifts, anchored to *this* week so the roster
  // always looks populated regardless of when seed runs.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = new Date(today);
  const day = monday.getDay();
  monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day));

  function dateFor(offsetFromMonday: number) {
    const d = new Date(monday);
    d.setDate(d.getDate() + offsetFromMonday);
    return d;
  }

  const shiftPlan: { name: string; offset: number; startTime: string; endTime: string; position: string }[] = [
    { name: staffUser!.name, offset: 0, startTime: "17:00", endTime: "23:00", position: "Bediening" },
    { name: staffUser!.name, offset: 2, startTime: "17:00", endTime: "23:00", position: "Bediening" },
    { name: staffUser!.name, offset: 4, startTime: "16:00", endTime: "23:30", position: "Bediening" },
    { name: kitchenUser!.name, offset: 1, startTime: "11:00", endTime: "19:00", position: "Keuken" },
    { name: kitchenUser!.name, offset: 3, startTime: "11:00", endTime: "19:00", position: "Keuken" },
    { name: kitchenUser!.name, offset: 5, startTime: "11:00", endTime: "22:00", position: "Keuken" },
    { name: "Lisa de Groot", offset: 4, startTime: "17:00", endTime: "22:00", position: "Bediening" },
    { name: "Lisa de Groot", offset: 5, startTime: "12:00", endTime: "18:00", position: "Bediening" },
    { name: "Youssef El Amrani", offset: 4, startTime: "18:00", endTime: "01:00", position: "Bar" },
    { name: "Youssef El Amrani", offset: 5, startTime: "18:00", endTime: "01:00", position: "Bar" },
    { name: "Nina Kramer", offset: 0, startTime: "11:00", endTime: "17:00", position: "Keuken" },
    { name: "Nina Kramer", offset: 6, startTime: "12:00", endTime: "20:00", position: "Keuken" },
    { name: "Bram Oosting", offset: 1, startTime: "09:00", endTime: "13:00", position: "Schoonmaak" },
  ];

  for (const s of shiftPlan) {
    const employeeId = employeeByName.get(s.name);
    if (!employeeId) continue;
    const date = dateFor(s.offset);
    const existing = await prisma.shift.findFirst({ where: { employeeId, date, startTime: s.startTime } });
    if (existing) continue;
    await prisma.shift.create({
      data: { employeeId, date, startTime: s.startTime, endTime: s.endTime, position: s.position },
    });
  }
}

async function main() {
  console.log("Seeding database...");
  await seedRolesAndUsers();
  await seedTables();
  await seedOpeningHours();
  await seedSettings();
  await seedMenu();
  await seedGallery();
  await seedReviews();
  await seedEvents();
  await seedCustomersAndReservations();
  await seedPersoneel();
  console.log("\nSeed compleet.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
