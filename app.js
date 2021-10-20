const apiKey = '1e2cb28b92898b06f871712c26621325';
const showsAPI = 'https://api.themoviedb.org/3/tv/on_the_air?api_key=1e2cb28b92898b06f871712c26621325&language=en-US&page=1';
const nowplayingAPI =  'https://api.themoviedb.org/3/movie/now_playing?api_key=1e2cb28b92898b06f871712c26621325&language=en-US&page=1'
const fanFavAPI = 'https://api.themoviedb.org/3/movie/top_rated?api_key=1e2cb28b92898b06f871712c26621325&language=en-US&page=1'
const upcomingAPI = 'https://api.themoviedb.org/3/movie/upcoming?api_key=1e2cb28b92898b06f871712c26621325&language=en-US&page=1'
const searchAPI = 'https://api.themoviedb.org/3/search/multi?api_key=1e2cb28b92898b06f871712c26621325&language=en-US&query='
const movieProvidersAPI = ` https://api.themoviedb.org/3/movie/550/watch/providers?api_key=1e2cb28b92898b06f871712c26621325`
const posterPath = `https://image.tmdb.org/t/p/w1280`;
const biggestHits = document.querySelector('.biggest-hits');
const search = document.querySelector('.search');
const searchBar = document.querySelector('.searchBar'); 
const searchList = document.querySelector('.searchList'); 
// var idStorage;

// MAKE NAVIGATION BAR 
function navSlide() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');

  // Toggle Nav
  burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');

    // Animate Link
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
      }
    });

    if(searchList.innerHTML){
      searchList.innerHTML = '';
    }
    // Animate Burger
    burger.classList.toggle('toggle');
  });
}
navSlide();


// MAKE SEARCH BAR
window.addEventListener('load', ()=>{
  search.value = '';
})
search.addEventListener('keyup', (e)=>{
  const searchTerm = search.value;
  if(searchTerm){
    showSearchResult(searchAPI + searchTerm)
  }
  searchList.innerHTML = '';
})


async function showSearchResult(API){
  const resp = await fetch(API);
  const respData = await resp.json();

  respData.results.forEach((result,index)=>{
      if(index<=4){
        const searchLink = document.createElement('a');
        if(result.media_type == "movie"){
          searchLink.innerHTML = 
          `<a href="#">
            <li class="searchListItem">
              <img src="${posterPath + result.poster_path}" alt="${result.title}" class="searchOutputImage">
              <div class="searchOutputText">
                <h4 class="searchOutputName">${result.title}</h4>
                <p class="searchOutputYear">${result.release_date.split("-")[0]}</p>
              </div>
            </li>
          </a>`
        }
        if(result.media_type == "tv"){
          searchLink.innerHTML = 
          `<a href="#">
            <li class="searchListItem">
              <img src="${posterPath + result.poster_path}" alt="${result.name}" class="searchOutputImage">
              <div class="searchOutputText">
                <h4 class="searchOutputName">${result.name}</h4>
                <p class="searchOutputYear">${result.first_air_date.split("-")[0]}</p>
              </div>
            </li>
          </a>`
        }
        searchList.appendChild(searchLink);

        let idStorage = result.id
        if(result.media_type == "movie"){
          modalCreation(searchLink, idStorage);
        }
        if(result.media_type == "tv"){
          modalCreationShow(searchLink, idStorage);
        }
      }
  })


}



// MAKE SECTION 2
 
getInTheater();

// in theater section
async function getInTheater(){
  const resp = await fetch(nowplayingAPI)
  const respData = await resp.json()


  respData.results.forEach((movie)=>{
    movieName()
      const movieProfile = document.createElement('div')
      movieProfile.classList.add('movie-profile')
      movieProfile.innerHTML = `
             <img src="${posterPath + movie.poster_path}" alt="">
              <div class="movie-info">
                <h4 class="movie-title">${movie.title}</h4>
                <span class="${setColor(movie.vote_average)}">
                  <h4 class="movie-ratings">${movie.vote_average}</h4>
                </span>
                </div>
              `
      document.querySelector('.movie-grid').appendChild(movieProfile)


      
      function movieName(){
        if(movie.title.length>13){
          movie.title = movie.title.substring(0,13) + ' ...';
        } else{
          movie.title;
        }
      }
      
      let idStorage = movie.id;
      modalCreation(movieProfile, idStorage);
      

  })
  setColor()
}

idFeeder = (id)=>{
    let idAPIList = {
    movieDetailsAPI : `https://api.themoviedb.org/3/movie/${id}?api_key=1e2cb28b92898b06f871712c26621325&language=en-US`,
    movieProvidersAPI : ` https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=1e2cb28b92898b06f871712c26621325`,
    movieCastAPI : ` https://api.themoviedb.org/3/movie/${id}/credits?api_key=1e2cb28b92898b06f871712c26621325&language=en-US`,

  }
  return idAPIList;
}





getFanFav();
async function getFanFav(){
  const resp = await fetch(fanFavAPI)
  const respData = await resp.json()

  respData.results.forEach((movie)=>{
    movieName()
      const movieProfile = document.createElement('div')
      movieProfile.classList.add('movie-profile')
      movieProfile.innerHTML = `
             <img src="${posterPath + movie.poster_path}" alt="">
              <div class="movie-info">
                <h4 class="movie-title">${movie.title}</h4>
                <span class="${setColor(movie.vote_average)}">
                  <h4 class="movie-ratings">${movie.vote_average}</h4>
                </span>
                </div>
              `
      document.querySelector('.fan-fav .movie-grid').appendChild(movieProfile)

      function movieName(){
        if(movie.title.length>13){
          movie.title = movie.title.substring(0,13) + ' ...';
        } else{
          movie.title;
        }
      }

      let idStorage = movie.id;
      modalCreation(movieProfile, idStorage);

  })
  setColor()
}


getUpcoming();
async function getUpcoming(){
  const resp = await fetch(upcomingAPI)
  const respData = await resp.json()

  respData.results.forEach((movie)=>{
    movieName()
      const movieProfile = document.createElement('div')
      movieProfile.classList.add('movie-profile')
      movieProfile.innerHTML = `
             <img src="${posterPath + movie.poster_path}" alt="">
              <div class="movie-info">
                <h4 class="movie-title">${movie.title}</h4>
                <span class="${setColor(movie.vote_average)}">
                  <h4 class="movie-ratings">${movie.vote_average}</h4>
                </span>
                </div>
              `
      document.querySelector('.upcoming .movie-grid').appendChild(movieProfile)

      function movieName(){
        if(movie.title.length>13){
          movie.title = movie.title.substring(0,13) + ' ...';
        } else{
          movie.title;
        }
      }

      let idStorage = movie.id;
      modalCreation(movieProfile, idStorage);

  })
  setColor()
}


getOnAir(); 

// airing shows section
async function getOnAir(){
  const resp = await fetch(showsAPI)
  const respData = await resp.json()

  respData.results.forEach((show)=>{
     showName();
      const showProfile = document.createElement('div')
      showProfile.classList.add('movie-profile')
      showProfile.innerHTML = `
             <img src="${posterPath + show.poster_path}" alt="">
              <div class="movie-info">
                <h4 class="movie-title">${show.name}</h4>
                <span class="${setColor(show.vote_average)}">
                  <h4 class="movie-ratings">${show.vote_average}</h4>
                </span>
              </div>
              `
      document.querySelector('.airing-shows .movie-grid').appendChild(showProfile)

      function showName(){
        if(show.name.length>13){
          show.name = show.name.substring(0,13) + ' ...';
        } else{
          show.name;
        }
      }

      let idStorage = show.id;
      modalCreationShow(showProfile, idStorage);
  })
  setColor()
}


idFeederShow = (id) =>{
  let idAPIShowList = {
      showDetailsAPI : ` https://api.themoviedb.org/3/tv/${id}?api_key=1e2cb28b92898b06f871712c26621325&language=en-US`,
      showCastAPI : `https://api.themoviedb.org/3/tv/${id}/credits?api_key=1e2cb28b92898b06f871712c26621325&language=en-US`
    }
    return idAPIShowList;
}










async function modalCreationShow(modalName, id){
  var idAPI = idFeederShow(id)

  const respShowDetail = await fetch(idAPI.showDetailsAPI)
  const respShowDataDetail = await respShowDetail.json() 
  
  const respShowSearch = await fetch(searchAPI + respShowDataDetail.name)
  const respDataShowSearch = await respShowSearch.json()
  
  const respShowCast = await fetch(idAPI.showCastAPI)
  const respDataShowCast = await respShowCast.json()


  let genreOutput = ''
  respShowDataDetail.genres.forEach((genre)=>{
    genreOutput += `<h5 class="genre">${genre.name.toUpperCase()}</h5>`
  })

  let moviePOutput = ''
  respShowDataDetail.networks.forEach((network)=>{
    moviePOutput += `<img src="${posterPath + network.logo_path}" alt="" class="watch-provider-logo">`
  })


  let movieCastOutput = ''
  respDataShowCast.cast.forEach((actor, index)=>{
    if(index<4){
      movieCastOutput += `<li class="cast-list-items">
      <img src="${posterPath + actor.profile_path}" alt="">
      <p>${actor.name}</p>
    </li>`
    }
  })

  modalName.addEventListener('click', ()=>{
    var infoModal = document.createElement('div');
    infoModal.classList.add('info-modal')

  infoModal.innerHTML = `
      <i class="far fa-window-close fa-2x cross"></i>
      <h4 class="media-type">${respDataShowSearch.results[0].media_type.toUpperCase()}</h4>
      <h1 class="modal-title">${respShowDataDetail.name}</h1>
      <div class="modal-upper-flex">
        <span class="${setColor(respShowDataDetail.vote_average)}">
          <h3>${respShowDataDetail.vote_average}</h3>
        </span>
        <h3 class="year">${respShowDataDetail.status}</h3>
        <h3 class="runtime">${respShowDataDetail.episode_run_time} minutes / episode</h3>
        <h3 class="seasons">${respShowDataDetail.number_of_seasons} seasons</h3>
      </div>
      <hr>
      <div class="modal-overview-flex">
        <img src="${posterPath + respShowDataDetail.poster_path}" alt="" class="modal-poster">
        <div class="modal-genre-flex">
          <p class="overview">${respShowDataDetail.overview.substring(0,200)} ...</p>
          <div class="genre-div">
            ${genreOutput}
          </div>

        </div>
        <div class="modal-watch-providers">
          <h3>Watch Providers</h3>
            ${moviePOutput}
        </div>
        <div class="modal-cast">
          <h3>Cast</h3>
          <ul class="cast-list">
            ${movieCastOutput}
          </ul>
        </div>
      </div>
    `

    infoModal.style.background = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${posterPath + respShowDataDetail.backdrop_path}) no-repeat center`
    infoModal.style.backgroundSize = 'cover'
    
    // closing functionality
    document.querySelector('main').appendChild(infoModal);
    document.querySelector('body').style.overflow = 'hidden';
    document.querySelector('.cross').addEventListener('click', ()=>{
      document.querySelector('main').removeChild(infoModal);
      document.querySelector('body').style.overflow = 'visible';
    })

    setColor()
  })
}










async function modalCreation(modalName, id){

  var idAPI = idFeeder(id);

  const respDetail = await fetch(idAPI.movieDetailsAPI)
  const respDataDetail = await respDetail.json() 

  const respSearch = await fetch(searchAPI + respDataDetail.title)
  const respDataSearch = await respSearch.json()
  
  const respMovieProvider  = await fetch(movieProvidersAPI)
  const respDataMovieProvider = await respMovieProvider.json()
  
  const respMovieCast = await fetch(idAPI.movieCastAPI)
  const respDataMovieCast = await respMovieCast.json()
  

  let genreOutput = ''

    respDataDetail.genres.forEach((genre)=>{
      genreOutput += `<h5 class="genre">${genre.name.toUpperCase()}</h5>`
    })


  let moviePOutput = ''

    respDataMovieProvider.results.IN.flatrate.forEach((provider)=>{
      moviePOutput += `<img src="${posterPath + provider.logo_path}" alt="" class="watch-provider-logo">`
    })


  let movieCastOutput = ''
    respDataMovieCast.cast.forEach((actor, index)=>{
      if(index<4){
        movieCastOutput += `<li class="cast-list-items">
        <img src="${posterPath + actor.profile_path}" alt="">
        <p>${actor.name}</p>
      </li>`
      }
    })

  
  
  modalName.addEventListener('click', ()=>{
    var infoModal = document.createElement('div');
    infoModal.classList.add('info-modal')
    
    
      infoModal.innerHTML = `
          <i class="far fa-window-close fa-2x cross"></i>
          <h4 class="media-type">${respDataSearch.results[0].media_type.toUpperCase()}</h4>
          <h1 class="modal-title">${respDataDetail.title}</h1>
          <div class="modal-upper-flex">
            <span class="${setColor(respDataDetail.vote_average)}">
              <h3>${respDataDetail.vote_average}</h3>
            </span>
            <h3 class="year">${respDataDetail.release_date.substring(0,4)}</h3>
            <h3 class="runtime">${respDataDetail.runtime} minutes</h3>

          </div>
          <hr>
          <div class="modal-overview-flex">
            <img src="${posterPath + respDataDetail.poster_path}" alt="" class="modal-poster">
            <div class="modal-genre-flex">
              <p class="overview">${respDataDetail.overview.substring(0,250)}...</p>
              <div class="genre-div">
                ${genreOutput}
              </div>

            </div>
            <div class="modal-watch-providers">
              <h3>Watch Providers</h3>
                ${moviePOutput}
            </div>
            <div class="modal-cast">
              <h3>Cast</h3>
              <ul class="cast-list">
                ${movieCastOutput}
              </ul>
            </div>
          </div>
    `

    infoModal.style.background = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${posterPath + respDataDetail.backdrop_path}) no-repeat center`
    infoModal.style.backgroundSize = 'cover'
    
    // closing functionality
    document.querySelector('main').appendChild(infoModal);
    document.querySelector('body').style.overflow = 'hidden';
    document.querySelector('.cross').addEventListener('click', ()=>{
      document.querySelector('main').removeChild(infoModal);
      document.querySelector('body').style.overflow = 'visible';
    })

    setColor()
  })
}










function setColor(votes){
  if(votes >= 7){
    return 'green';
  }
  else if( 7>votes && votes>=4){
    return 'yellow';
  }
  else{
    return 'red';
  }
}