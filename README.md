# Projekt Wypożyczalnia filmów

## Autorzy

- Kamil Kawula, kamilkawula@student.agh.edu.pl
- Krzysztof Ligarski, kligarski@student.agh.edu.pl

## Temat projektu

Tematem projektu będzie wypożyczalnia filmów w postaci płyt DVD.

## Informację o wykorzystywanym SZBD i technologii realizacji projektu

Planujemy wykorzystać bazę PostgreSQL, serwer Express.js z frontendem napisanym w React.js.

## Link do repozytorium

[https://github.com/taylor-swif/movie-rental](https://github.com/taylor-swif/movie-rental)

## Funkcje

- Dodanie użytkownika
- Przeglądanie bazy filmów
- Dodawanie egzemplarzy danego filmu
- Wypożyczenie egzemplarza
- Zwrot egzemplarza
- Raport nieoddanych w terminie filmów
- Raport wypożyczeń dla filmów w danym przedziale czasowym
- Raport wypożyczeń dla gatunków w danym przedziale czasowym

## Schemat bazy danych

![schemat](schemat.png)

## Endpointy API

Wszystkie enpointy zwracają kod 200 w przypadku sukcesu, 404 w przypadku nieznalezienia konkretnego rekordu oraz 500 w przypadku błedu serwera.

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
- `director=XYZ` - imię i nazwisko reżysera zawiera ragment `XYZ`, porównanie niewrażliwe na wielkość liter.

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

Dodatkowo, można wyszukać filmy, które należą do danego/kilku danych gatunków. Należy je dostarczyć w zapytaniu w postaci:

```json
{
  "genre_ids" = [...]
}
```

gdzie w miejsce `...` należy wpisać ID gatunków, np. zapytanie z poniższymi gatunkami:

```json
{
  "genre_ids" = [4, 5]
}
```

zwraca:

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

<!-- TODO: naprawić endpoint, dopisać dokumentacje -->

#### /movies/:movie_id/genres/:genre_id

##### PUT

<!-- TODO -->

##### DELETE

<!-- TODO -->

### Płyty

#### `/dvds`

##### GET

<!-- TODO -->

##### POST

<!-- TODO -->

#### `/dvds/:id`

##### GET

<!-- TODO -->

##### PATCH

<!-- TODO -->

##### DELETE

<!-- TODO -->

### Uzytkownicy

#### `/users`

##### GET

<!-- TODO -->

##### POST

<!-- TODO -->

#### `/users/:id`

##### GET

<!-- TODO -->

##### PATCH

<!-- TODO -->

##### DELETE

<!-- TODO -->

### Wypozyczenia

#### `/rentals`

##### GET

<!-- TODO -->

##### POST

<!-- TODO -->

#### `/rentals/:id`

##### GET

<!-- TODO -->

##### PATCH

<!-- TODO -->

##### DELETE

<!-- TODO -->

### Wypozyczenia historyczne

#### `/rentals_history`

##### GET

<!-- TODO -->

#### `/rentals_history/:id`

##### GET

<!-- TODO -->

### Raport filmów

#### `/movies_report`

##### GET

<!-- TODO -->

### Raport gatunków

#### `/movies_report`

##### GET

<!-- TODO -->

### Views

<!-- TODO -->
