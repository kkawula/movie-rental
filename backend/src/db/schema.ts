import { pgTable, serial, integer, varchar, text, decimal, date, primaryKey } from 'drizzle-orm/pg-core';

// Define DVDs table
export const dvds = pgTable('DVDs', {
    id: serial('id').primaryKey(),
    movie_id: integer('movie_id').notNull().references(() => movies.id),
});

// Define Genres table
export const genres = pgTable('Genres', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 128 }).notNull(),
});

// Define Movies table
export const movies = pgTable('Movies', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 128 }).notNull(),
    description: text('description').notNull(),
    imdb_rate: decimal('imdb_rate', { precision: 2, scale: 1 }).notNull(),
    director: varchar('director', { length: 256 }).notNull(),
    poster_url: varchar('poster_url', { length: 256 }).notNull(),
});

// Define MoviesGenres table
export const moviesgenres = pgTable('MoviesGenres', {
    movie_id: integer('movie_id').notNull().references(() => movies.id),
    genre_id: integer('genre_id').notNull().references(() => genres.id),
}, table => {
    return {
        pk: primaryKey({ columns: [table.movie_id, table.genre_id]})
    }
});

// Define Rentals table
export const rentals = pgTable('Rentals', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull().references(() => users.id),
    dvd_id: integer('dvd_id').notNull().references(() => dvds.id),
    rental_date: date('rental_date').notNull(),
    return_deadline: date('return_deadline').notNull(),
});

// Define RentalsHistory table
export const rentalshistory = pgTable('RentalsHistory', {
    id: integer('id').primaryKey(),
    user_id: integer('user_id').notNull().references(() => users.id),
    dvd_id: integer('dvd_id').notNull().references(() => dvds.id),
    rental_date: date('rental_date').notNull(),
    return_deadline: date('return_deadline').notNull(),
    returned_date: date('returned_date').notNull(),
});

// Define Users table
export const users = pgTable('Users', {
    id: serial('id').primaryKey(),
    first_name: varchar('first_name', { length: 128 }).notNull(),
    last_name: varchar('last_name', { length: 128 }).notNull(),
    phone_number: varchar('phone_number', { length: 32 }).notNull(),
    mail: varchar('mail', { length: 64 }).notNull(),
    address: varchar('address', { length: 512 }).notNull(),
});

export type DVD = typeof dvds.$inferSelect;
export type NewDVD = typeof dvds.$inferInsert;

export type Genre = typeof genres.$inferSelect;
export type NewGenre = typeof genres.$inferInsert;

export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;

export type MovieGenre = typeof moviesgenres.$inferSelect;
export type NewMovieGenre = typeof moviesgenres.$inferInsert;

export type Rental = typeof rentals.$inferSelect;
export type NewRental = typeof rentals.$inferInsert;

export type RentalHistory = typeof rentalshistory.$inferSelect;
export type NewRentalHistory = typeof rentalshistory.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

