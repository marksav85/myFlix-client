export const MovieView = ({ movies, onBackClick }) => {
  return (
    <div>
      <div>
        <img src={movies.image} />
      </div>
      <div>
        <span>Title: </span>
        <span>{movies.title}</span>
      </div>
      <div>
        <span>Director: </span>
        <span>{movies.director}</span>
      </div>
      <div>
        <span>Genre: </span>
        <span>{movies.genre}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{movies.description}</span>
      </div>

      <button onClick={onBackClick}>Back</button>
    </div>
  );
};