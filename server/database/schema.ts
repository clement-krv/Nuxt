import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  doublePrecision,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/* ------------------------------------------------------------------ */
/* Enums                                                               */
/* ------------------------------------------------------------------ */
export const ticketTypeEnum = pgEnum('ticket_type', ['train', 'plane'])
export const ticketStatusEnum = pgEnum('ticket_status', ['available', 'sold'])
export const vehicleCategoryEnum = pgEnum('vehicle_category', [
  'velo', // vélo mécanique
  'electrique', // vélo / VAE électrique
  'scooter',
  'voiture', // voiture éco (électrique / hybride)
  'attelage', // charrette tirée par bœufs, ânes ou chevaux
])
export const vehicleStatusEnum = pgEnum('vehicle_status', ['available', 'sold'])
export const bookingStatusEnum = pgEnum('booking_status', ['confirmed', 'cancelled'])

/* ------------------------------------------------------------------ */
/* Users                                                              */
/* ------------------------------------------------------------------ */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/* ------------------------------------------------------------------ */
/* Forum                                                             */
/* ------------------------------------------------------------------ */
export const forumCategories = pgTable('forum_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
})

export const forumThreads = pgTable('forum_threads', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => forumCategories.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const forumPosts = pgTable('forum_posts', {
  id: serial('id').primaryKey(),
  threadId: integer('thread_id')
    .notNull()
    .references(() => forumThreads.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/* ------------------------------------------------------------------ */
/* Covoiturage                                                       */
/* ------------------------------------------------------------------ */
export const carpoolTrips = pgTable('carpool_trips', {
  id: serial('id').primaryKey(),
  driverId: integer('driver_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  fromCity: text('from_city').notNull(),
  toCity: text('to_city').notNull(),
  departureAt: timestamp('departure_at').notNull(),
  seatsTotal: integer('seats_total').notNull(),
  pricePerSeat: doublePrecision('price_per_seat').notNull(),
  vehicleType: text('vehicle_type').notNull().default('Voiture électrique'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const carpoolBookings = pgTable('carpool_bookings', {
  id: serial('id').primaryKey(),
  tripId: integer('trip_id')
    .notNull()
    .references(() => carpoolTrips.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  seats: integer('seats').notNull().default(1),
  status: bookingStatusEnum('status').notNull().default('confirmed'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/* ------------------------------------------------------------------ */
/* Billets train / avion                                            */
/* ------------------------------------------------------------------ */
export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  sellerId: integer('seller_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  buyerId: integer('buyer_id').references(() => users.id, { onDelete: 'set null' }),
  type: ticketTypeEnum('type').notNull(),
  fromCity: text('from_city').notNull(),
  toCity: text('to_city').notNull(),
  company: text('company').notNull(),
  travelAt: timestamp('travel_at').notNull(),
  price: doublePrecision('price').notNull(),
  originalPrice: doublePrecision('original_price'),
  description: text('description'),
  status: ticketStatusEnum('status').notNull().default('available'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/* ------------------------------------------------------------------ */
/* Marché de véhicules éco                                          */
/* ------------------------------------------------------------------ */
export const vehicles = pgTable('vehicles', {
  id: serial('id').primaryKey(),
  sellerId: integer('seller_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  category: vehicleCategoryEnum('category').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: doublePrecision('price').notNull(),
  condition: text('condition').notNull().default('Bon état'),
  location: text('location').notNull(),
  image: text('image'),
  status: vehicleStatusEnum('status').notNull().default('available'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/* ------------------------------------------------------------------ */
/* Bricolage (tutoriels & entraide)                                 */
/* ------------------------------------------------------------------ */
export const diyArticles = pgTable('diy_articles', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull().default('Réparation'),
  cover: text('cover'),
  difficulty: text('difficulty').notNull().default('Facile'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const diyComments = pgTable('diy_comments', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id')
    .notNull()
    .references(() => diyArticles.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/* ------------------------------------------------------------------ */
/* Relations                                                         */
/* ------------------------------------------------------------------ */
export const usersRelations = relations(users, ({ many }) => ({
  threads: many(forumThreads),
  posts: many(forumPosts),
  trips: many(carpoolTrips),
  bookings: many(carpoolBookings),
}))

export const forumCategoriesRelations = relations(forumCategories, ({ many }) => ({
  threads: many(forumThreads),
}))

export const forumThreadsRelations = relations(forumThreads, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumThreads.categoryId],
    references: [forumCategories.id],
  }),
  author: one(users, { fields: [forumThreads.userId], references: [users.id] }),
  posts: many(forumPosts),
}))

export const forumPostsRelations = relations(forumPosts, ({ one }) => ({
  thread: one(forumThreads, { fields: [forumPosts.threadId], references: [forumThreads.id] }),
  author: one(users, { fields: [forumPosts.userId], references: [users.id] }),
}))

export const carpoolTripsRelations = relations(carpoolTrips, ({ one, many }) => ({
  driver: one(users, { fields: [carpoolTrips.driverId], references: [users.id] }),
  bookings: many(carpoolBookings),
}))

export const carpoolBookingsRelations = relations(carpoolBookings, ({ one }) => ({
  trip: one(carpoolTrips, { fields: [carpoolBookings.tripId], references: [carpoolTrips.id] }),
  user: one(users, { fields: [carpoolBookings.userId], references: [users.id] }),
}))

export const ticketsRelations = relations(tickets, ({ one }) => ({
  seller: one(users, { fields: [tickets.sellerId], references: [users.id] }),
  buyer: one(users, { fields: [tickets.buyerId], references: [users.id] }),
}))

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  seller: one(users, { fields: [vehicles.sellerId], references: [users.id] }),
}))

export const diyArticlesRelations = relations(diyArticles, ({ one, many }) => ({
  author: one(users, { fields: [diyArticles.authorId], references: [users.id] }),
  comments: many(diyComments),
}))

export const diyCommentsRelations = relations(diyComments, ({ one }) => ({
  article: one(diyArticles, { fields: [diyComments.articleId], references: [diyArticles.id] }),
  author: one(users, { fields: [diyComments.userId], references: [users.id] }),
}))
