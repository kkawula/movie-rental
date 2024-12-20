# Wypożyczalnia filmów

## Technologie 

- PostgreSQL
- Express.js
- ReactTS

## Schemat bazy danych

![schemat](schemat.png)

## Endpointy API

Wszystkie enpointy zwracają kod 200 w przypadku sukcesu, 404 w przypadku nieznalezienia konkretnego rekordu oraz 500 w przypadku błedu serwera.


## Funkcje

- Dodanie użytkownika
- Przeglądanie bazy filmów
- Dodawanie egzemplarzy danego filmu
- Wypożyczenie egzemplarza
- Zwrot egzemplarza
- Raport nieoddanych w terminie filmów
- Raport wypożyczeń dla filmów w danym przedziale czasowym
- Raport wypożyczeń dla gatunków w danym przedziale czasowym


## Screenshots

![reports](screenshots/reports.png)
![movies](screenshots/movies.png)
![rentals](screenshots/rentals.png)
![clients](screenshots/clients.png)

### Gatunki

#### `/genres`

##### GET

Zwraca listę gatunków postaci:

```json
[
  {
    "id": 1,
    "name": "Crime"
  },
  ...
]
```

##### POST

Umożliwia dodanie nowego gatunku. Należy przekazać gatunek w postaci:

```json
{
  "name": "New genre name"
}
```

Nowo dodany gatunek zostanie zwrócony wraz z nadanym mu ID.

#### `/genres/:id`

Parametr `:id` powinien być liczbą całkowitą odpowiadającą ID gatunku.

##### GET

Zwraca dane gatunku w postaci:

```json
{
  "id": 1,
  "name": "Crime"
}
```

##### PATCH

Umożliwia zmianę danych (nazwy) gatunku. Należy dostarczyć uaktualnione dane w postaci:

```json
{
  "name": "New genre name"
}
```

Uaktualniony gatunek zostaje zwrócony.

##### DELETE

Umożliwia usunięcie gatunku. W przypadku, gdy jakieś filmy należą do tego gatunku, ich powiązanie zostanie usunięte.

### Filmy

#### `/movies`

##### GET

Umożliwia znajdowanie filmów.

Można użyć poniższych parametrów zapytania:

- `availability=true` lub `availability=false` - umożliwia wyszukanie tylko filmów, które są dostępne lub są niedostępne (liczba dostępnych egzemplarzy DVD jest większa niż zero gdy `true` lub równa zero gdy `false`),
- `title=XYZ` - tytuł zawiera fragment `XYZ`, porównanie niewrażliwe na wielkość liter,
- `description=XYZ` - opis zawiera fragment `XYZ`, porównanie niewrażliwe na wielkość liter,
- `imdb_gte=X.Y` - ocena filmu jest większa bądź równa liczbie `X.Y`, np. `6.5`,
- `imdb_lte=X.Y` - ocena filmu jest mniejsza bądź równa liczbie `X.Y`, np. `6.5`,
- `director=XYZ` - imię i nazwisko reżysera zawiera ragment `XYZ`, porównanie niewrażliwe na wielkość liter,
- `genre_ids=[X,Y,...]` - filmy, które należą do gatunków o podanych ID.

Przykładowe użycie parametrów:
`/movies?director=Tarantino&imdb_gte=8.0`

```json
[
  {
    "id": 9,
    "title": "Pulp Fiction",
    ...
  },
  {
    "id": 7,
    "title": "Django Unchained",
    ...
  }
]
```

Przykładowe użycie parametrów:
`/movies?genre_ids=[4, 5]

```json
[
  {
    "id": 2,
    "title": "Tenet",
    ...
  },
  {
    "id": 3,
    "title": "Interstellar",
    ...
  },
  {
    "id": 11,
    "title": "2001: A Space Odyssey",
    ...
  },
  {
    "id": 13,
    "title": "Lobster",
    ...
  }
]
```

##### POST

Umożliwia dodanie filmu. Należy go przekazać w postaci:

```json
{
  "title": "...",
  "description": "...",
  "imdb_rate": "X.Y",
  "director": "...",
  "poster_url": "..."
}
```

Nowo dodany film zostanie zwrócony wraz z nadanym mu ID.

#### `/movies/:id`

Parametr `:id` powinien być liczbą całkowitą odpowiadającą ID filmu.

##### GET

Umożliwia uzyskanie szczegółów danego filmu w postaci:

```json
{
  "id": X,
  "title": "...",
  "description": "...",
  "imdb_rate": "X.Y",
  "director": "...",
  "poster_url": "..."
}
```

##### PATCH

Umożliwia zmianę danych (nazwy) gatunku. Należy dostarczyć uaktualnione dane w postaci:

```json
{
  "title": "...",
  "description": "...",
  "imdb_rate": "X.Y",
  "director": "...",
  "poster_url": "..."
}
```

Nie trzeba podawać wszystkich parametrów.

Zwrócony zostaje uaktualniony film.

##### DELETE

Umożliwia usunięcie filmu. Jeżeli film był powiązany z jakimiś gatunkami, te powiązania zostaną usunięte.

#### /movies/:id/genres

Parametr `:id` powinien być liczbą całkowitą odpowiadającą ID filmu.

##### GET

Umożliwia uzyskanie listy gatunków, do którego należy dany film. Zostają zwrócone w postaci:

Przykład wywołania:
`/movies/3/genres`

```json
[
  {
    "id": 4,
    "name": "Sci-Fi"
  },
  {
    "id": 5,
    "name": "Adventure"
  }
]
```

#### /movies/:movie_id/genres/:genre_id

##### PUT

Umożliwia dodanie gatunku `genre_id` do filmu `movie_id`.

##### DELETE

Umożliwia usunięcie gatunku `genre_id` z filmu `movie_id`.

#### /movies/:movie_id/available

##### GET

Zwraca dostępne płyty dla filmu `movie_id`

Przykładowe użycie:
`/movies/7/available`

```json
[
  {
    "id": 18,
    "movie_id": 7,
    "rentable": true
  }
]
```

### Płyty

#### `/dvds`

##### GET

Zwraca listę wszystkich płyt w postaci:

Można użyć parametru zapytania:

- `movie_id=5` - zwraca płyty odpowiedniego filmu

```json
[
    {
        "id": 1,
        "movie_id": 1,
        "rentable": false
    },
    {
        "id": 2,
        "movie_id": 1,
        "rentable": true
    },
    ...
]
```

##### POST

Dodawanie płyty odpowiedniego filmu:

```json
{
  "movie_id": "X",
  "rentable": true/false
}
```

Nowo dodana płyta zostanie zwróca wraz z nadanym jej ID.
Możliwe jest pominięcie parametru `rentable`, domyślną wartością jest true.

#### `/dvds/:id`

Parametr `:id` powinien być liczbą całkowitą odpowiadającą ID gatunku.

##### GET

Umożliwia uzyskanie szczegółów danej płyty:

```json
{
    "id": X,
    "movie_id": Y,
    "rentable": true/false
}
```

##### PATCH

Umożliwia zmianę stanu płyty lub filmu na niej dostępnego

```json
{
    "movie_id": Y,
    "rentable": "true"
}
```

Nie trzeba podawać wszystkich parametrów, zwrócona płyta jest uaktualniona.

##### DELETE

Usuwa płytę z bazy, jeżeli płyta nie była wcześniej nigdy wypożyczona.

### Uzytkownicy

#### `/users`

##### GET

Zwraca listę wszystkich użytkowników w postaci:

```json
[
    {
        "id": 1,
        "first_name": "Bernard",
        "last_name": "Arnault",
        "phone_number": "123456789",
        "mail": "berand@lv.com",
        "address": "931-947, Fifth Street 21, Dallas, California"
    },
    {
        "id": 2,
        "first_name": "Jeff",
        "last_name": "Bezos",
        "phone_number": "987654321",
        "mail": "mynameisjeff@aws.com",
        "address": "605-943, Fifth Street 18, San Antonio, Alaska"
    },
    ...
]
```

##### POST

Umożliwia dodanie użytkownika do bazy. Należy go przekazać w postaci:

```json
{
  "first_name": "...",
  "last_name": "...",
  "phone_number": "123456789",
  "mail": "...@[provider].com",
  "address": "..."
}
```

#### `/users/:id`

Parametr `:id` powinien być liczbą całkowitą odpowiadającą ID użytkownika.

##### GET

Umożliwia uzyskanie danych wybranego użytkownika.

##### PATCH

Umożliwia zmianę danych użytkownika. Należy dostarczyć uaktualnione dane w postaci:

Przykład aktualizacji dwóch parametrów:

```json
{
  "last_name": "...",
  "address": "..."
}
```

Nie trzeba podawać wszystkich parametrów.

Zwrócony zostaje uaktualniony użytkownik.

##### DELETE

Umożliwia usunięcie użytkownika z bazy, jeżeli nigdy nie wypożyczył filmu.

### Wypożyczenia

#### `/rentals`

##### GET

Umożliwia znalezienie aktualnie wypożyczonych płyt.

Można użyć poniższych parametrów zapytania:

- `late=true` lub `late=false` - filtruje wypożyczenia, które nie zostały zwrócone przed określonym terminem, a także te, które nadal mają czas na zwrot.
- `user_id=X` - płyty wypożyczone przez użytkownika z danym ID
- `dvd_id=Y` - informacja o wypożyczeniu płyty z danym ID
- `movie_id=Z` - wypożycznia filmu z danym ID

Przykładowe użycie parametrów:
`/movies?movie_id=4`

```json
[
  {
      "id": 382,
      "user_id": 6,
      "dvd_id": 11,
      "rental_date": "2024-04-10",
      "return_deadline": "2024-05-24"
  },
  {
      "id": 383,
      "user_id": 6,
      "dvd_id": 13,
      "rental_date": "2024-03-25",
      "return_deadline": "2024-05-28"
  },
  ...
]
```

##### POST

Umożliwia wypożyczenie płyty jeżeli ta jest dostępna, w przeciwnym razie zostanie zwrócona informacja, że płyta nie jest dostępna.

```json
{
  "user_id": X,
  "dvd_id": Y,
  "return_deadline": "2077-04-20"
}
```

Zwrócony zostaje wpis do tabeli wraz z nadanym ID oraz datą wypożyczenia.

```json
{
  "id": 378,
  "user_id": 3,
  "dvd_id": 5,
  "rental_date": "2024-03-30",
  "return_deadline": "2024-05-21"
}
```

#### `/rentals/:id`

Parametr `:id` powinien być liczbą całkowitą odpowiadającą ID wypożyczenia.

##### GET

Zwraca wypożyczenie o danym ID

##### PATCH

Umożliwia zmianę parametrów wypożyczenia. Należy dostarczyć uaktualnione dane w postaci:

```json
{
  "user_id": X,
  "dvd_id": Y,
  "rental_date": "2024-03-30",
  "return_deadline": "2024-05-21"
}
```

Nie trzeba podawać wszystkich parametrów.

Zwrócony zostaje uaktualnione wypożyczenie.

##### DELETE

Delete służy do zwracania płyt, wpis jest usuwany z tabeli rentals oraz przenoszony do tabeli rentals_history wraz z datą zwrotu.

### Wypożyczenia historyczne

#### `/rentals_history`

##### GET

Umożliwia wgląd do historii wypożyczeń.

Można użyć poniższych parametrów zapytania:

- `late=true` lub `late=false` - filtruje wypożyczenia, które nie zostały zwrócone przed określonym terminem, a także te, które nadal mają czas na zwrot.
- `user_id=X` - płyty wypożyczone przez użytkownika z danym ID
- `dvd_id=Y` - informacja o wypożyczeniu płyty z danym ID
- `movie_id=Z` - wypożycznia filmu z danym ID

```json
[
  {
    "id": 1,
    "user_id": 3,
    "dvd_id": 1,
    "rental_date": "2020-07-13",
    "return_deadline": "2020-08-08",
    "returned_date": "2020-08-06"
  }
]
```

#### `/rentals_history/:id`

##### GET

Zwraca wpis z historii wypożyczeń o danym ID.

### Raport filmów

#### `/movies_report`

##### GET

Ten endpoint generuje raport na temat filmów, zwraca liczbę wypożczeń w danym okresie czasu

Można użyć poniższych parametrów zapytania:

- `rental_before="2024-06-20"`
- `rental_after="2024-01-01`

```json
[
  {
    "id": 1,
    "title": "Oppenheimer",
    "description": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    "imdb_rate": "8.3",
    "director": "Christopher Nolan",
    "poster_url": "www.example.com",
    "rentals": 18
  },
  {
    "id": 5,
    "title": "Fight Club",
    "description": "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    "imdb_rate": "8.8",
    "director": "David Fincher",
    "poster_url": "www.example.com",
    "rentals": 9
  },
  ...
]
```

### Raport gatunków

#### `/genres_report`

##### GET

Ten endpoint generuje raport na temat gatunków, zwraca liczbę wypożczeń w danym okresie czasu

Można użyć poniższych parametrów zapytania:

- `rental_before="2024-06-20"`
- `rental_after="2024-01-01`

```json
[
  {
    "id": 5,
    "name": "Adventure",
    "rentals": 132
  },
  {
    "id": 4,
    "name": "Sci-Fi",
    "rentals": 154
  },
  {
    "id": 10,
    "name": "History",
    "rentals": 64
  },
  ...
]
```

### Widok MoviesAvailability

Widok, który pokazuje statystki płyt dla danego filmu.

- `no_dvds` - liczba wszystkich płyt danego filmu, niezależnie czy jest wypożyczalna czy nie (rentable)
- `rented` - liczba wszystkich aktualnie wypożyczonych płyt danego filmu, niezależnie czy jest wypożyczalna czy nie (rentable)
- `available` - liczba dostępnych płyt, definiowana jako różnica między liczbą wszystkich wypożyczalnych płyt a liczbą aktualnie wypożyczonych wypożyczalnych płyt

```sql
create view "MoviesAvailability"
            (id, title, description, imdb_rate, director, poster_url, no_dvds, rented, available) as
SELECT total_movies.id,
       total_movies.title,
       total_movies.description,
       total_movies.imdb_rate,
       total_movies.director,
       total_movies.poster_url,
       total_movies.no_dvds,
       total_movies.rented,
       COALESCE(rentable_movies.available, 0::bigint) AS available
FROM (SELECT m.id,
             m.title,
             m.description,
             m.imdb_rate,
             m.director,
             m.poster_url,
             count(dd.id)    AS no_dvds,
             count(r.dvd_id) AS rented
      FROM "Movies" m
               LEFT JOIN "DVDs" dd ON m.id = dd.movie_id
               LEFT JOIN "Rentals" r ON dd.id = r.dvd_id
      GROUP BY m.id, m.title) total_movies
         LEFT JOIN (SELECT m.id,
                           count(dd.id) - count(r.dvd_id) AS available
                    FROM "Movies" m
                             LEFT JOIN "DVDs" dd ON m.id = dd.movie_id
                             LEFT JOIN "Rentals" r ON dd.id = r.dvd_id
                    WHERE dd.rentable = true
                    GROUP BY m.id) rentable_movies ON total_movies.id = rentable_movies.id;
```
