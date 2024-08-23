const apiKey = "1e2cb28b92898b06f871712c26621325"
const baseURL = "https://api.themoviedb.org/3"
const posterPath = "https://image.tmdb.org/t/p/w1280"

const endpoints = {
  shows: `/tv/on_the_air?api_key=${apiKey}&language=en-US&page=1`,
  nowPlaying: `/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`,
  fanFav: `/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`,
  upcoming: `/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`,
  search: `/search/multi?api_key=${apiKey}&language=en-US&query=`,
  movieProviders: (id) => `/movie/${id}/watch/providers?api_key=${apiKey}`,
  movieDetails: (id) => `/movie/${id}?api_key=${apiKey}&language=en-US`,
  movieCast: (id) => `/movie/${id}/credits?api_key=${apiKey}&language=en-US`,
  showDetails: (id) => `/tv/${id}?api_key=${apiKey}&language=en-US`,
  showCast: (id) => `/tv/${id}/credits?api_key=${apiKey}&language=en-US`,
}

const biggestHits = document.querySelector(".biggest-hits")
const search = document.querySelector(".search")
const searchList = document.querySelector(".searchList")

function navSlide() {
  const burger = document.querySelector(".burger")
  const nav = document.querySelector(".nav-links")
  const navLinks = document.querySelectorAll(".nav-links li")

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active")
    navLinks.forEach((link, index) => {
      link.style.animation = link.style.animation
        ? ""
        : `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`
    })
    if (searchList.innerHTML) searchList.innerHTML = ""
    burger.classList.toggle("toggle")
  })
}
navSlide()

window.addEventListener("load", () => {
  search.value = ""
})

search.addEventListener("keyup", (e) => {
  const searchTerm = search.value
  if (searchTerm) showSearchResult(baseURL + endpoints.search + searchTerm)
  searchList.innerHTML = ""
})

async function showSearchResult(API) {
  const resp = await fetch(API)
  const respData = await resp.json()

  respData.results.slice(0, 5).forEach((result) => {
    const searchLink = document.createElement("a")
    searchLink.innerHTML = `<a href="#">
            <li class="searchListItem">
              <img src="${posterPath + result.poster_path}" alt="${
      result.title || result.name
    }" class="searchOutputImage">
              <div class="searchOutputText">
                <h4 class="searchOutputName">${result.title || result.name}</h4>
                <p class="searchOutputYear">${
                  (result.release_date || result.first_air_date).split("-")[0]
                }</p>
              </div>
            </li>
          </a>`
    searchList.appendChild(searchLink)

    const idStorage = result.id
    if (result.media_type === "movie") {
      searchLink.addEventListener("click", () => modalCreation(idStorage))
    } else if (result.media_type === "tv") {
      searchLink.addEventListener("click", () => modalCreationShow(idStorage))
    }
  })
}

function createProfileCard(item) {
  const itemProfile = document.createElement("div")
  itemProfile.classList.add("movie-profile")
  const title = item.title || item.name
  itemProfile.innerHTML = `
        <img src="${posterPath + item.poster_path}" alt="">
        <div class="movie-info">
          <h4 class="movie-title">${
            title.length > 13 ? title.substring(0, 12) + " ..." : title
          }</h4>
          <span class="${setColor(item.vote_average)}">
            <h4 class="movie-ratings">${
              Math.round(item.vote_average * 10) / 10
            }</h4>
          </span>
        </div>`
  return itemProfile
}

async function getMovies(endpoint, containerSelector) {
  const resp = await fetch(baseURL + endpoint)
  const respData = await resp.json()

  respData.results.forEach((movie) => {
    const movieProfile = createProfileCard(movie)
    document.querySelector(containerSelector).appendChild(movieProfile)
    movieProfile.addEventListener("click", () => modalCreation(movie.id))
  })
  setColor()
}

async function getShows(endpoint, containerSelector) {
  const resp = await fetch(baseURL + endpoint)
  const respData = await resp.json()

  respData.results.forEach((show) => {
    const showProfile = createProfileCard(show)
    document.querySelector(containerSelector).appendChild(showProfile)
    showProfile.addEventListener("click", () => modalCreationShow(show.id))
  })
  setColor()
}

getMovies(endpoints.nowPlaying, ".movie-grid")
getMovies(endpoints.fanFav, ".fan-fav .movie-grid")
getMovies(endpoints.upcoming, ".upcoming .movie-grid")
getShows(endpoints.shows, ".airing-shows .movie-grid")

async function modalCreation(id) {
  const [respDetail, respMovieProvider, respMovieCast] = await Promise.all([
    fetch(baseURL + endpoints.movieDetails(id)),
    fetch(baseURL + endpoints.movieProviders(id)),
    fetch(baseURL + endpoints.movieCast(id)),
  ])

  const [respDataDetail, respDataMovieProvider, respDataMovieCast] =
    await Promise.all([
      respDetail.json(),
      respMovieProvider.json(),
      respMovieCast.json(),
    ])

  const genreOutput = respDataDetail.genres
    .map((genre) => `<h5 class="genre">${genre.name.toUpperCase()}</h5>`)
    .join("")

  const moviePOutput =
    (
      respDataMovieProvider.results?.IN?.buy ||
      respDataMovieProvider.results?.IN?.flatrate
    )
      ?.map(
        (provider) => `
        <img src="${
          posterPath + provider.logo_path
        }" alt="" class="watch-provider-logo">`
      )
      .join("") || ""

  const movieCastOutput = respDataMovieCast.cast
    .slice(0, 4)
    .map(
      (actor) => `
        <li class="cast-list-items">
          <img src="${posterPath + actor.profile_path}" alt="">
          <p>${actor.name}</p>
        </li>`
    )
    .join("")

  const infoModal = document.createElement("div")
  infoModal.classList.add("info-modal")

  infoModal.innerHTML = `
          <i class="far fa-window-close fa-2x cross"></i>
          <h1 class="modal-title">${respDataDetail.title}</h1>
          <div class="modal-upper-flex">
            <span class="${setColor(respDataDetail.vote_average)}">
              <h3>${Math.round(respDataDetail.vote_average * 10) / 10}</h3>
            </span>
            <h3 class="year">${respDataDetail.release_date.substring(0, 4)}</h3>
            <h3 class="runtime">${respDataDetail.runtime} minutes</h3>
          </div>
          <hr>
          <div class="modal-overview-flex">
            <img src="${
              posterPath + respDataDetail.poster_path
            }" alt="" class="modal-poster">
            <div class="modal-genre-flex">
              <p class="overview">${respDataDetail.overview.substring(
                0,
                250
              )}...</p>
              <div class="genre-div">${genreOutput}</div>
            </div>
            <div class="modal-watch-providers">
              <h3>Watch Providers</h3>
                ${moviePOutput}
            </div>
            <div class="modal-cast">
              <h3>Cast</h3>
              <ul class="cast-list">${movieCastOutput}</ul>
            </div>
          </div>`

  infoModal.style.background = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${
    posterPath + respDataDetail.backdrop_path
  }) no-repeat center`
  infoModal.style.backgroundSize = "cover"

  document.querySelector("main").appendChild(infoModal)
  document.querySelector("body").style.overflow = "hidden"
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector("main").removeChild(infoModal)
    document.querySelector("body").style.overflow = "visible"
  })

  setColor()
}

async function modalCreationShow(id) {
  const [respShowDetail, respShowCast] = await Promise.all([
    fetch(baseURL + endpoints.showDetails(id)),
    fetch(baseURL + endpoints.showCast(id)),
  ])

  const [respDataShowDetail, respDataShowCast] = await Promise.all([
    respShowDetail.json(),
    respShowCast.json(),
  ])

  const genreOutput = respDataShowDetail.genres
    .map((genre) => `<h5 class="genre">${genre.name.toUpperCase()}</h5>`)
    .join("")

  const moviePOutput = respDataShowDetail.networks
    .map(
      (network) => `
        <img src="${
          posterPath + network.logo_path
        }" alt="" class="watch-provider-logo">`
    )
    .join("")

  const movieCastOutput = respDataShowCast.cast
    .slice(0, 4)
    .map(
      (actor) => `
        <li class="cast-list-items">
          <img src="${posterPath + actor.profile_path}" alt="">
          <p>${actor.name}</p>
        </li>`
    )
    .join("")

  const infoModal = document.createElement("div")
  infoModal.classList.add("info-modal")

  infoModal.innerHTML = `
          <i class="far fa-window-close fa-2x cross"></i>
          <h1 class="modal-title">${respDataShowDetail.name}</h1>
          <div class="modal-upper-flex">
            <span class="${setColor(respDataShowDetail.vote_average)}">
              <h3>${Math.round(respDataShowDetail.vote_average * 10) / 10}</h3>
            </span>
            <h3 class="year">${respDataShowDetail.first_air_date.substring(
              0,
              4
            )}</h3>
            <h3 class="runtime">${
              respDataShowDetail.episode_run_time[0]
            } minutes</h3>
          </div>
          <hr>
          <div class="modal-overview-flex">
            <img src="${
              posterPath + respDataShowDetail.poster_path
            }" alt="" class="modal-poster">
            <div class="modal-genre-flex">
              <p class="overview">${respDataShowDetail.overview.substring(
                0,
                250
              )}...</p>
              <div class="genre-div">${genreOutput}</div>
            </div>
            <div class="modal-watch-providers">
              <h3>Networks</h3>
                ${moviePOutput}
            </div>
            <div class="modal-cast">
              <h3>Cast</h3>
              <ul class="cast-list">${movieCastOutput}</ul>
            </div>
          </div>`

  infoModal.style.background = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${
    posterPath + respDataShowDetail.backdrop_path
  }) no-repeat center`
  infoModal.style.backgroundSize = "cover"

  document.querySelector("main").appendChild(infoModal)
  document.querySelector("body").style.overflow = "hidden"
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector("main").removeChild(infoModal)
    document.querySelector("body").style.overflow = "visible"
  })

  setColor()
}

function setColor(votes) {
  return votes >= 7 ? "green" : votes >= 4 ? "yellow" : "red"
}
