const menuBtn = document.querySelector(".menu-btn"),
  container = document.querySelector(".container");

const progressBar = document.querySelector('.bar'),
      progressDot = document.querySelector('.dot'),
      currentTimeEl = document.querySelector('.current-time'),
      durationEl = document.querySelector('.duration');


menuBtn.addEventListener("click", () => {
  container.classList.toggle("active"); //toggle the menu button/icon
});

let playing = false,
  currentSong = 0,
  shuffle = false,
  repeat = false,
  favourites = [],
  audio = new Audio();

//create an array of objects of songs
const songs = [
  {
    title: "Eastside",
    artist: "Benny Blanco, Halsey & Khalid",
    img_src: "Eastside.jpg",
    src: "Eastside.mp3",
  },
  {
    title: "With You In The Morning",
    artist: "Carl Storm",
    img_src: "Carl.jpg",
    src: "CarlStorm.mp3",
  },
  {
    title: "Hymn For The Weekend",
    artist: "Coldplay",
    img_src: "coldplay.jpg",
    src: "Coldplay.mp3",
  },
  {
    title: "Wild Ones",
    artist: "Flo Rida - Wild Ones ft. Sia",
    img_src: "Wild.jpg",
    src: "Wild.mp3",
  },

];

const playlistContainer = document.querySelector("#playlist"),
infoWrapper = document.querySelector('.info'),
coverImage = document.querySelector('.cover-image'),
currentSongTitle = document.querySelector('.current-song-title'),
currentFavourite = document.querySelector('#current-favourite');

function init() {
  updatePlaylist(songs);
  loadSong(1);
}
init()


function updatePlaylist(songs) {
  //remove any exising elements
  playlistContainer.innerHTML = "";



  //use for each on songs array
  songs.forEach((song, index) => {

    //extract data from song
    const {title, src} = song;

    //check if its included in the favourite array
    const isFavourite = favourites.includes(index);


    //create a table row to wrap the songs
    const tr = document.createElement("tr");
    tr.classList.add("song");

    tr.innerHTML = `
     <td class="no">
    <h5>${index + 1}</h5>
     </td>
    <td class="title">
    <h6>${title}</h6>
    </td>
     <td class="length">
    <h5>2:03</h5>
    </td>
    <td>
    <i class="fas fa-heart ${isFavourite ? 'active' : ""}"></i>
    </td>`;

    playlistContainer.appendChild(tr);

    //lets play song when clicked on playlist song
    tr.addEventListener('click', (e) =>{

        //lets add to favourites when the heart is clicked
       if(e.target.classList.contains('fa-heart')){
            addToFavourite(index);
            e.target.classList.toggle('active');
            //if heart is clicked add to favourites and dont play song

            return;
       }


        currentSong = index;
        loadSong(currentSong);
        audio.play();
        container.classList.remove('active');
        playPauseBtn.classList.replace('fa-play', 'fa-pause');
        playing = true;


    })


    const audioForDuration = new Audio(`data/${src}`);
    audioForDuration.addEventListener('loadedmetadata', () =>{
        const duration = audioForDuration.duration;

        let songDuration = formatTime(duration);
        tr.querySelector('.length h5').innerText = songDuration;
    })
  });
}

function formatTime(time){

    //Format time like 2:30
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    //Add trailing zero if seconds less than 10
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
}

//Add audio play functionality
function loadSong(num){
    //Change all the title artist and times to current song
    infoWrapper.innerHTML = `
    <h2>${songs[num].title}</h2>
    <h3>${songs[num].artist}</h3>
`
    currentSongTitle.innerHTML = songs[num].title;

    //change the cover image
    coverImage.style.backgroundImage = `url(data/${songs[num].img_src})`;


    //add src to current song to the audio variable
    //play the audio
    audio.src = `data/${songs[num].src}`;


    //if song is in favourite highlight it
    if(favourites.includes(num)){
        currentFavourite.classList.add('active');
    }else{
        //if not favourite remove active
        currentFavourite.classList.remove('active');
}
}

//lets add play, pause, prev, next functionality
const playPauseBtn = document.querySelector('#playpause'),
nextBtn = document.querySelector('#next'),
prevBtn = document.querySelector('#prev');

playPauseBtn.addEventListener('click', () =>{
    if(playing){
        //pause if already playing
        playPauseBtn.classList.replace('fa-pause', 'fa-play');
        playing = false;
        audio.pause();
    }else{
        //if not paused continue playing
        playPauseBtn.classList.replace('fa-play', 'fa-pause');
        playing = true;
        audio.play();

    }
})

//create a function that will play the next song
function nextSong(){
    //shuffle when playing next song
    if(shuffle){
        shuffleFunc();
        loadSong(currentSong);
        //we return cause we dont want to play the next song

    }

    //if the current song is not in the current playlist
    else if(currentSong < songs.length - 1){
        //Load the next song
        currentSong++; //Increment the number the of songs in the playlist
    }else{
        //else if last song in the playlist then we play first
        currentSong = 0;

    }
    loadSong(currentSong);

    //After loading IF the song was playing keep playing current song
    if(playing){
        audio.play();
    }
}

nextBtn.addEventListener('click', nextSong);

function prevSong(){
//Same for prevsong
    if(shuffle){
        shuffleFunc();
        loadSong(currentSong);
      //we return cause we dont want to play the next song
    
    }
    //same for prev song id the first song is playing go to the last song
   else if(currentSong > 0){
        currentSong--;
    }else{
        currentSong = songs.length - 1;
    }
    loadSong(currentSong);
    //After loading IF the song was playing keep playing current song
    if(playing){
        audio.play();
    }
}

prevBtn.addEventListener('click', prevSong);

function addToFavourite(index){
    //check if already in favourites then remove
    if(favourites.includes(index)){
        favourites = favourites.filter((item) => item !== index);

        //if cuurent playing song is removed also remove currentFavourite
        currentFavourite.classList.remove('active');


    }else{
        //if not already in favourites add it
        favourites.push(index);

        if(index === currentSong){
            currentFavourite.classList.add('active');
        }
    }

    updatePlaylist(songs);
}

//also add the favourites current playing song when the heart is clicked
currentFavourite.addEventListener('click', ()=>{
    addToFavourite(currentSong);
    currentFavourite.classList.toggle('active');
})


//Lets add SHUFFLE functionality
const shuffleBtn = document.querySelector('#shuffle');

function shuffleSongs(){
    //if shuffle is false make it true or vise versa
    shuffle = !shuffle;
    shuffleBtn.classList.toggle('active');
}

shuffleBtn.addEventListener('click', shuffleSongs);

//if shuffle is true shuffle songs when playing next or prev
function shuffleFunc(){
    if(shuffle){
        //select a random song from playlist
        currentSong = Math.floor(Math.random() * songs.length);
    }
    //if shuffle is false do nothing
}

//repeat functionality
const repeatBtn = document.querySelector('#repeat');
function repeatSong(){
    if(repeat === 0){
        //if repeat is off make it "1" that means repeat current song
        repeat = 1;
        //if repeat is "ON" make it active
        repeatBtn.classList.add('active');
    }else if(repeat === 1){
        //if repeat is 1 that is only repeat current song make it 2 which mean repeat playlist
        repeat = 2;
        repeatBtn.classList.add('active');
    }else{
        //Turn "OFF" repeat
        repeat = 0;
        repeatBtn.classList.remove('active');
    }
}

repeatBtn.addEventListener('click', repeatSong);

//now if repeat is "ON" on audio end
audio.addEventListener('ended', () =>{
    if(repeat === 1){
        //if repeat current song
        //AGAIN load current song
        loadSong(currentSong);
        audio.play();
    }else if(repeat === 2){
        //if repeat playlist
        //play next song
        nextSong();
        audio.play();
    }else{
        //if repeat is "OFF"
        //just play all playlist one time and then stop
        if(currentSong === songs.length - 1){
            //if its last song in the playlist stop playing now
            audio.pause();
            playPauseBtn.classList.replace('fa-pause', 'fa-play');
            playing = false;
        }else{
            //if not last continue to next
            nextSong();
            audio.play();
        }
    }
})


//Lets add "PROGRESS BAR"
//PROGRESS BAR FUNCTIONALITY
function progress(){
    //get duration and current time from audio
    let {duration, currentTime} = audio;
    //if anyone not a number make it "0"
    isNaN(duration) ? (duration = 0) : duration;
    isNaN(currentTime) ? (currentTime = 0) : currentTime;

    //UPDATE TIME ELEMENTS
    currentTimeEl.innerHTML = formatTime(currentTime);
    durationEl.innerHTML = formatTime(duration);

    //lets move the progree bar dot
    let progressPercentage = (currentTime / duration) * 100;
    progressDot.style.left = `${progressPercentage}%`;
}

//update progress on audio timeupdate event
audio.addEventListener('timeupdate', progress)

//change progress when clicked on bar
function setProgress(e){
    let width = this.clientWidth;
    let clickX = e.offsetX;
    let Duration = audio.duration;
    audio.currentTime = (clickX / width) * 100;
}

progressBar.addEventListener('click', setProgress);