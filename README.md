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

