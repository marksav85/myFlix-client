import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

const MainView = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Silence of the Lambs",
      image:
        "https://images-na.ssl-images-amazon.com/images/S/pv-target-images/1d661187b253755ef32e1f21748ca1e217529bb72f8ef8a87a18fd8e904246a0._RI_TTW_.jpg",
      director: "Jonathan Demme",
      genre: "Thriller",
      description: "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer.",
    },
    {
      id: 2,
      title: "Batman Begins",
      image:
        "https://images-eu.ssl-images-amazon.com/images/S/pv-target-images/317800a11686be4e5b6e42acc7c8bff3bf4f07f76db4254528f8dcc0093a720c._RI_TTW_.jpg",
      director: "Christopher Nolan",
      genre: "Action",
      description: "After witnessing the death of his parents, Bruce learns the art of fighting to confront injustice. When he returns to Gotham as Batman, he must stop a secret society that intends to destroy the city."
    },
    {
      id: 3,
      title: "The Dark Knight",
      image:
        "https://images-eu.ssl-images-amazon.com/images/S/pv-target-images/46ce52e30b589a6151f8548821493bd8b97cc1afd4fc4c603c654f6fdfe1753a._RI_TTW_.jpg",
      director: "Christopher Nolan",
      genre: "Action",
      description: "After Gordon, Dent and Batman begin an assault on Gotham''s organised crime, the mobs hire the Joker, a psychopathic criminal mastermind who offers to kill Batman and bring the city to its knees."
    },
    {
      id: 4,
      title: "Star Wars: A New Hope",
      image:
        "https://images-na.ssl-images-amazon.com/images/S/pv-target-images/eedb006621d6294b51bfa6740aeaf89bfc15d6c627bd2953c8ea7a95c81a05c9._RI_TTW_.jpg",
      director: "George Lucas",
      genre: "Sci-Fi",
      description: "Princess Leia gets abducted by the insidious Darth Vader. Luke Skywalker then teams up with a Jedi Knight, a pilot and two droids to free her and to save the galaxy from the violent Galactic Empire."
,    },
    {
      id: 5,
      title: "The Lord of the Rings: The Fellowship of the Ring",
      image:
        "https://images-eu.ssl-images-amazon.com/images/S/pv-target-images/beecd85c0063bd86eec77ab74b0b1b952495e1799401ec1ddbc2b4257510213a._RI_TTW_.jpg",
      director: "Peter Jackson",
      genre: "Fantasy",
      description: "A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed."
 ,   }
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  if (selectedMovie) {
    return (
      <MovieView
        movies={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }
  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movies={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(movie);
          }}
        />
      ))}
    </div>
  );
};

export default MainView;
