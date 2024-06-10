CREATE TABLE IF NOT EXISTS "DVDs" (
	"id" serial PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"rentable" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Genres" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(128) NOT NULL,
	"description" text NOT NULL,
	"imdb_rate" numeric(2, 1) NOT NULL,
	"director" varchar(256) NOT NULL,
	"poster_url" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MoviesGenres" (
	"movie_id" integer NOT NULL,
	"genre_id" integer NOT NULL,
	CONSTRAINT "MoviesGenres_movie_id_genre_id_pk" PRIMARY KEY("movie_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Rentals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"dvd_id" integer NOT NULL,
	"rental_date" date NOT NULL,
	"return_deadline" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "RentalsHistory" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"dvd_id" integer NOT NULL,
	"rental_date" date NOT NULL,
	"return_deadline" date NOT NULL,
	"returned_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(128) NOT NULL,
	"last_name" varchar(128) NOT NULL,
	"phone_number" varchar(32) NOT NULL,
	"mail" varchar(64) NOT NULL,
	"address" varchar(512) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DVDs" ADD CONSTRAINT "DVDs_movie_id_Movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."Movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MoviesGenres" ADD CONSTRAINT "MoviesGenres_movie_id_Movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."Movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MoviesGenres" ADD CONSTRAINT "MoviesGenres_genre_id_Genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."Genres"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Rentals" ADD CONSTRAINT "Rentals_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Rentals" ADD CONSTRAINT "Rentals_dvd_id_DVDs_id_fk" FOREIGN KEY ("dvd_id") REFERENCES "public"."DVDs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RentalsHistory" ADD CONSTRAINT "RentalsHistory_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RentalsHistory" ADD CONSTRAINT "RentalsHistory_dvd_id_DVDs_id_fk" FOREIGN KEY ("dvd_id") REFERENCES "public"."DVDs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
