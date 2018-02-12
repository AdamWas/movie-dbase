# Movie Database
by Adam Wasielewski  
NodeJS

App on Heroku:  
[Heroku](https://movie-dbase.herokuapp.com/ "movie-dbase")

### METHODS

* `POST /movies`:
To add movie to database.
ex:
``` 
{
    "Title": "Fight Club"
}
```

* `GET /movies`:
    * Return all movies from database with all details.
  
* `GET /movies/sort?Metascore` with sort param:
    * Return sorted movie (for now only by Metascore).

* `GET /movies/param?genre` with genre param:
    * Return movies with specified genre, ex: Drama, Sci-Fi (case-sensitive)

* `POST /comments`:
    * Add comment for specified movie.
ex:
```
{
	"Content": "Movie comment",
	"Author": "Jack Novak",
	"_movieId": "5a81e22ce6db34480c7677a7"
}
```

* `GET /comments`:
    * Return all comments for all movies from database

* `GET /comments/movieID`:
    * Return all comments for specified movie from database