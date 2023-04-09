// Get references to HTML elements
let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");

// Variables to manage search state
let page = 1;
let searchedMovieName = "";

// Fetch movies from the OMDB API
let getMovies = (movieName, page) => {
  const key = "7f8c242";
  const url = `https://www.omdbapi.com/?s=${movieName}&apikey=${key}&page=${page}`;

  if (movieName.length <= 0) {
    result.innerHTML = `<h3 class="msg">Please enter a movie name</h3>`;
    return;
  }

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      if (data.Response === "True") {
        displayMovies(data.Search);
      } else {
        result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
      }
    })
    .catch(() => {
      result.innerHTML = `<h3 class="msg">Error Occurred</h3>`;
    });
};

// Fetch movie details from the OMDB API
let getMovieDetails = (title) => {
  const key = "7f8c242";
  const url = `http://www.omdbapi.com/?t=${title}&apikey=${key}`;

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      if (data.Response === "True") {
        displayMovieDetails(data);
      } else {
        result.innerHTML = `<h3 class="msg">Movie not found</h3>`;
      }
    })
    .catch(() => {
      result.innerHTML = `<h3 class="msg">Error Occurred</h3>`;
    });
};

// Display movie details on the page
let displayMovieDetails = (data) => {
  result.innerHTML = `
    <div class="info">
      <img src=${data.Poster} class="poster">
      <div>
        <h2>${data.Title}</h2>
        <div class="rating">
          <img src="star-icon.svg">
          <h4>${data.imdbRating}</h4>
        </div>
        <div class="details">
          <span>${data.Rated}</span>
          <span>${data.Year}</span>
          <span>${data.Runtime}</span>
        </div>
        <div class="genre">
          <div>${data.Genre.split(",").join("</div><div>")}</div>
        </div>
      </div>
    </div>
    <h3>Plot:</h3>
    <p>${data.Plot}</p>
    <h3>Cast:</h3>
    <p>${data.Actors}</p>
    <h3>Director:</h3>
    <p>${data.Director}</p>
    <h3>Awards:</h3>
    <p>${data.Awards}</p>
    <h3>Box Office:</h3>
    <p>${data.BoxOffice}</p>
  `;
};

// Load more movies when the "Load More" button is clicked
let loadMoreMovies = () => {
  page++;
  getMovies(searchedMovieName, page);
};

 // Attach click event listeners to movie options
    let attachMovieOptionListeners = () => {
      let movieOptions = document.querySelectorAll(".movie-option");
      movieOptions.forEach((option) => {
        option.addEventListener("click", (event) => {
          let movieTitle = event.currentTarget.dataset.title;
          getMovieDetails(movieTitle);
        });
      });
    };

    // Display movies on the page
    let displayMovies = (movies) => {
      if (movies.length === 0) {
        return;
      }

      let displayedMovies = movies.slice(0, 5);
      let movieOptions = displayedMovies
        .map((movie) => {
          return `
            <div class="movie-option" data-title="${movie.Title}">
              <img src="${movie.Poster}" alt="${movie.Title}" class="option-poster">
              <h3>${movie.Title} (${movie.Year})</h3>
            </div>
          `;
        })
        .join("");

      result.innerHTML = `
        <div class="movies-container">
          ${movieOptions}
        </div>
        <button id="load-more-btn">Load More</button>
      `;

      attachMovieOptionListeners();

      // Add click event listener to the "Load More" button
      let loadMoreBtn = document.getElementById("load-more-btn");
      loadMoreBtn.addEventListener("click", loadMoreMovies);
    };

    // Add click event listener to the search button
    searchBtn.addEventListener("click", () => {
      searchedMovieName = movieNameRef.value;
      page = 1;
      getMovies(searchedMovieName, page);
    });

    // Add keypress event listener to the movie search input
    movieNameRef.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        searchedMovieName = movieNameRef.value;
        page = 1;
        getMovies(searchedMovieName, page);
      }
    });

    // Load the initial set of movies when the page loads
    window.addEventListener("load", () => {
      getMovies("", 1);
    });