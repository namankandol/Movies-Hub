const apiKey = '1e2cb28b92898b06f871712c26621325';
const showsAPI = 'https://api.themoviedb.org/3/tv/on_the_air?api_key=1e2cb28b92898b06f871712c26621325&language=en-US&page=1';
const nowplayingAPI =  'https://api.themoviedb.org/3/movie/now_playing?api_key=1e2cb28b92898b06f871712c26621325&language=en-US&page=1'
const celebAPI =  'https://api.themoviedb.org/3/person/popular?api_key=1e2cb28b92898b06f871712c26621325&language=en-US&page=1'
const posterPath = `https://image.tmdb.org/t/p/w1280`;
const biggestHits = document.querySelector('.biggest-hits');
const form = document.querySelector('#form');
const search = document.querySelector('.search');

// MAKE NAVIGATION BAR 
const navSlide = () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li')

  // Toggle Nav
  burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active'); 

    // Animate Link
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = ''
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index/7 + 0.5}s`;   
      }
    });

    // Animate Burger
    burger.classList.toggle('toggle');
  });
}
navSlide();



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

  })
  setColor()

  // console.log(respData);
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

  })
  setColor()

  // console.log(respData);
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





