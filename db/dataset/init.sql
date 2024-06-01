-- -- Created by Vertabelo (http://vertabelo.com)
-- -- Last modification date: 2024-04-20 09:01:13.752

-- -- tables
-- -- Table: DVDs
-- CREATE TABLE DVDs (
--     id int  NOT NULL GENERATED ALWAYS AS IDENTITY,
--     movie_id int  NOT NULL,
--     CONSTRAINT DVDs_pk PRIMARY KEY (id)
-- );

-- -- Table: Genres
-- CREATE TABLE Genres (
--     id int  NOT NULL GENERATED ALWAYS AS IDENTITY,
--     name varchar(128)  NOT NULL,
--     CONSTRAINT Genres_pk PRIMARY KEY (id)
-- );

-- -- Table: Movies
-- CREATE TABLE Movies (
--     id int  NOT NULL GENERATED ALWAYS AS IDENTITY,
--     title varchar(128)  NOT NULL,
--     description text  NOT NULL,
--     imdb_rate decimal(2,1)  NOT NULL,
--     director varchar(256)  NOT NULL,
--     poster_url varchar(256)  NOT NULL,
--     CONSTRAINT Movies_pk PRIMARY KEY (id)
-- );

-- -- Table: MoviesGenres
-- CREATE TABLE MoviesGenres (
--     movie_id int  NOT NULL,
--     genre_id int  NOT NULL,
--     CONSTRAINT MoviesGenres_pk PRIMARY KEY (movie_id,genre_id)
-- );

-- -- Table: Rentals
-- CREATE TABLE Rentals (
--     id int  NOT NULL GENERATED ALWAYS AS IDENTITY,
--     user_id int  NOT NULL,
--     dvd_id int  NOT NULL,
--     rental_date date  NOT NULL,
--     return_deadine date  NOT NULL,
--     CONSTRAINT Rentals_pk PRIMARY KEY (id)
-- );

-- -- Table: RentalsHistory
-- CREATE TABLE RentalsHistory (
--     id int  NOT NULL,
--     user_id int  NOT NULL,
--     dvd_id int  NOT NULL,
--     rental_date date  NOT NULL,
--     return_deadline date  NOT NULL,
--     returned_date date  NOT NULL,
--     CONSTRAINT RentalsHistory_pk PRIMARY KEY (id)
-- );

-- -- Table: Users
-- CREATE TABLE Users (
--     id int  NOT NULL GENERATED ALWAYS AS IDENTITY,
--     first_name varchar(128)  NOT NULL,
--     last_name varchar(128)  NOT NULL,
--     phone_number varchar(32)  NOT NULL,
--     mail varchar(64)  NOT NULL,
--     address varchar(512)  NOT NULL,
--     CONSTRAINT Users_pk PRIMARY KEY (id)
-- );

-- -- foreign keys
-- -- Reference: DVDs_Movies (table: DVDs)
-- ALTER TABLE DVDs ADD CONSTRAINT DVDs_Movies
--     FOREIGN KEY (movie_id)
--     REFERENCES Movies (id)  
--     NOT DEFERRABLE 
--     INITIALLY IMMEDIATE
-- ;

-- -- Reference: MoviesGenres_Genres (table: MoviesGenres)
-- ALTER TABLE MoviesGenres ADD CONSTRAINT MoviesGenres_Genres
--     FOREIGN KEY (genre_id)
--     REFERENCES Genres (id)  
--     NOT DEFERRABLE 
--     INITIALLY IMMEDIATE
-- ;

-- -- Reference: MoviesGenres_Movies (table: MoviesGenres)
-- ALTER TABLE MoviesGenres ADD CONSTRAINT MoviesGenres_Movies
--     FOREIGN KEY (movie_id)
--     REFERENCES Movies (id)  
--     NOT DEFERRABLE 
--     INITIALLY IMMEDIATE
-- ;

-- -- Reference: RentalsHistory_DVDs (table: RentalsHistory)
-- ALTER TABLE RentalsHistory ADD CONSTRAINT RentalsHistory_DVDs
--     FOREIGN KEY (dvd_id)
--     REFERENCES DVDs (id)  
--     NOT DEFERRABLE 
--     INITIALLY IMMEDIATE
-- ;

-- -- Reference: RentalsHistory_Users (table: RentalsHistory)
-- ALTER TABLE RentalsHistory ADD CONSTRAINT RentalsHistory_Users
--     FOREIGN KEY (user_id)
--     REFERENCES Users (id)  
--     NOT DEFERRABLE 
--     INITIALLY IMMEDIATE
-- ;

-- -- Reference: Rentals_DVDs (table: Rentals)
-- ALTER TABLE Rentals ADD CONSTRAINT Rentals_DVDs
--     FOREIGN KEY (dvd_id)
--     REFERENCES DVDs (id)  
--     NOT DEFERRABLE 
--     INITIALLY IMMEDIATE
-- ;

-- -- Reference: Reservations_Users (table: Rentals)
-- ALTER TABLE Rentals ADD CONSTRAINT Reservations_Users
--     FOREIGN KEY (user_id)
--     REFERENCES Users (id)  
--     NOT DEFERRABLE 
--     INITIALLY IMMEDIATE
-- ;

-- -- insert into Movies(title, description, imdb_rate, director, poster_url)
-- -- values ('Pulp Fiction', 'The Best Movie.', 8.9, 'Quentin Tarantino', 'https://static.posters.cz/image/1300/plakaty/pulp-fiction-cover-i1288.jpg');


-- -- End of file.
\c movie-rental;

begin;

CREATE TABLE IF NOT EXISTS "DVDs" (
	"id" serial PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL
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
 ALTER TABLE "MoviesGenres" ADD CONSTRAINT "MoviesGenres_movie_id_Movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."Movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MoviesGenres" ADD CONSTRAINT "MoviesGenres_genre_id_Genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."Genres"("id") ON DELETE no action ON UPDATE no action;
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

commit;

copy "Movies" from '/docker-entrypoint-initdb.d/movies.csv' with delimiter ',' csv header;
copy "Genres" from '/docker-entrypoint-initdb.d/genres.csv' with delimiter ',' csv header;
copy "MoviesGenres" from '/docker-entrypoint-initdb.d/movies_genres.csv' with delimiter ',' csv header;
copy "DVDs" from '/docker-entrypoint-initdb.d/dvds.csv' with delimiter ',' csv header;
copy "Users" from '/docker-entrypoint-initdb.d/users.csv' with delimiter ',' csv header;
copy "Rentals" from '/docker-entrypoint-initdb.d/rentals.csv' with delimiter ',' csv header;
copy "RentalsHistory" from '/docker-entrypoint-initdb.d/rentals_history.csv' with delimiter ',' csv header;