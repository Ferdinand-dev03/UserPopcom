import React, { useRef } from "react";
import { useEffect, useState } from "react";
import Stat from "./Start";
import { useMovies } from "./useMovies";
import { useLocalStored } from "./useLocalStoed";
import { useKey } from "./useKey";



const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur  / arr.length, 0);

const KEY = "f84fc31d"



export default function App() {
  

  const [query, setQuery] = useState("");
  const [selectId, setSelectId] = useState(null)
  const { movies, isLoading, error} = useMovies(query);
  const [watched , setWatched] = useLocalStored([] , 'watched')

  // const [watched, setWatched] = useState([]);

  function handleSelect(id){
    setSelectId((selectId)=> id === selectId ? null : id)
  }

  function handleClose(){
    setSelectId()
  }

  function handleAddWhatch(movie){
    setWatched(whatched => [...whatched, movie])
  }

  function handleDelete(id){
    setWatched((movie)=> movie.filter(movie => movie.imdbID !== id))
  }
  


  return (
    <>
      <Nav>

        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />

      </Nav> 

      <Main >
{/* 
        <Box element={ <MovieList movies={movies}/>} />
        <Box  element={<>
            <WatchedSummary watched={watched} />
            <WatchedList watched={watched} /> 
            </> }/> */}
     

        <Box movies={movies}>
          {/* {isLoading ? <Loader/> :<MovieList movies={movies}/>} */}
          {isLoading && <Loader/>}
          {!isLoading && !error && <MovieList movies={movies} onSelect={handleSelect} />}
          {error && <ErrorMessage message={error}/>}
        </Box>

        <Box>

        { 
            selectId ? <MoviesDetail selectId={selectId} onClose={handleClose}  onAddWatch={handleAddWhatch}
            watched={watched}
            /> :
          <>
            <WatchedSummary watched={watched} />
            <WatchedList watched={watched}
            onDelete={handleDelete} selectId={selectId}
            />
          </>
          }
        </Box>

      </Main>
      
    </>
  );
}

function ErrorMessage({message}) {
  return <p className="error">
    <span>⛔</span>{message}
  </p>
}

function Loader(){
  return <p className="loader" >Loading...</p>
}
function Nav({children}){

  return(
    <nav className="nav-bar">
        <Logo/>
      {children}
        
      </nav>
  )
}

function Logo () {
  return(
    <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>
  )
}

function Search({query, setQuery}){

  const inputEl = useRef(null);

  useKey('Enter', function(){
    if(document.activeElement === inputEl.current) return ;   inputEl.current.focus();
    setQuery('');
  })

  return(
    <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          ref={inputEl}
        />
  )
}

function NumResult({movies}){
  return(
    <p className="num-results">
          Found <strong> {movies.length} </strong> results
        </p>
  )
}

function Main({children}){



  return(
    <main className="main">
        
        {children}
      </main>
  )
}

function Box ({children}) {
  const [isOpen, setIsOpen] = useState(true);


  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
      children
          )}
    </div>
  )
}

function MovieList({movies , onSelect}){

  return(
    <ul className="list">
      {movies?.map((movie) => (
      <List1 list={movie} key={movie.imdbID} onSelect={onSelect} />
      ))}
    </ul>
  )
}

function List1({list, onSelect}){

  return(
    <li onClick={()=> onSelect(list.imdbID)} >
      <img src={list.Poster} alt={`${list.Title} poster`} />
      <h3>{list.Title}</h3>
      <div>
        <p>
        <span>🗓</span>
        <span>{list.Year}</span>
        </p>
      </div>
    </li>
  )
}

// function ListBox2(){

//   const [isOpen2, setIsOpen2] = useState(true);
//

//   return(
//     <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen2((open) => !open)}
//           >
//             {isOpen2 ? "–" : "+"}
//           </button>
//           {isOpen2 && (
//             <>
              
//             </>
//           )}
//         </div>

//   )
// }

function WatchedSummary({watched}){

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return(
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed()} min</span>
        </p>
      </div>
    </div>
  )
}

function WatchedList({watched , onDelete}){
  return(
    <ul className="list">
      {watched.map((movie) => (
      <List2 list={movie}
      key={movie.imdbID}
      onDelete={onDelete} />
      ))}
    </ul>
  )
}

function List2({list , onDelete }){
  return(
    <li >
      <img src={list.poster} alt={`${list.title} poster`} />
      <h3>{list.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
            <span>{list.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{list.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{list.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={()=>onDelete(list.imdbID)}>
          x
        </button>
      </div>
    </li>
  )
}

function MoviesDetail({selectId, onClose, onAddWatch, watched}){
  
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false)
  const [userRating, setUserRacing] = useState('');

  const countRef = useRef(0);

  useEffect(()=>{
    if(userRating) countRef.current++

  },[userRating])
  
  const isWatched = watched.map(movie=> movie.imdbID).includes(selectId);

  const WatchedUserRating = watched.find(movie=> movie.imdbID === selectId)?.userRating;
  


  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre
  } = movie;


  function handleAdd(){
    const newMovie = {
      imdbID: selectId,
      title,
      year,
      poster,
      userRating,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      countDecisions: countRef.current,
      
    }
    onAddWatch(newMovie)
    onClose()

  }

  
  useKey('Escape', onClose);


  useEffect(
    function () {
      async function getMoviesDetail() {
        setLoading(true)
        const res = await fetch (
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectId}`
        );
        const data = await res.json();
        setMovie(data);
        setLoading(false)
      }
      getMoviesDetail();
    },
    [selectId]

  )

  useEffect(()=> {
    if(!title) return;
    document.title = `Movie | ${title}`;

    return function (){
      document.title = 'userPopcorn'
    }

  },[title])

  return <div className="details">
  { loading ? <Loader /> :
    <>
    <header>
        <button className="btn-back" onClick={onClose}>&larr;</button>
        <img src={poster} alt={`Poster of ${movie} movie`}/>
        <div className="details-overview">
          <h2>{title}</h2>
          <p> {released} &bull; {runtime} </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMdb Rating
          </p>
        
        </div>
        
    </header>
    
    <section>

      <div className="rating">
      {!isWatched ? (
        <>
          <Stat
          maxRacing={10}
          size={24}
          onSetRating={setUserRacing}
          />
        
         { userRating > 0 && <button className="btn-add"
            onClick={handleAdd}>Add Movies</button>}
          </> 
        ): (
          <p>You reted this movie {WatchedUserRating} </p>
        )}
      </div> 
    
      <div className="rating">
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </div>
    </section>
    </>
    }
    </div>
}
