import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser? storedUser: null);
  const [token, setToken] = useState(storedToken? storedToken: null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("https://my-flix-films-d4434240379d.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, [token]);

  const moviesFromApi = data.map((movie) => {
    return {
      id: movie._id,
      title: movie.Title,
      description: movie.Description,
      genre: movie.Genre.Name,
      director: movie.Director.Name
    };
  });
  setMovies(moviesFromApi);

  if (!user) {
    return (
      <>
      <LoginView 
        onLoggedIn={(user, token) => {
          setUser(user);
          setToken(token);
          }}   
        />
        or 
        <SignupView />
        </>
    );
  }

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
      <button
        onClick={() => {
          setUser(null);
          setToken(null);
          localStorage.clear();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default MainView;
