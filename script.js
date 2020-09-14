const modal = document.getElementById('modal')
const modalShow = document.getElementById('show-modal')
const modalClose = document.getElementById('close-modal')
const bookmarkForm = document.getElementById('bookmark-form')
const websiteElement = document.getElementById('website-name')
const websiteUrlElement = document.getElementById('website-url')
const bookmarksContainer = document.getElementById('bookmarks-container')

const player = document.querySelector('.player')
const video = document.querySelector("video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const playButton = document.getElementById("play-button");
const volumeIcon = document.getElementById("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const currentTime = document.querySelector(".time-elapsed");
const duration = document.querySelector(".time-duration");
const speed = document.querySelector(".player-speed");
const fullscreenButton = document.querySelector(".fullscreen");
const downloadButton = document.querySelector(".download");

let bookmarks = {}

//Show Modal, Focus On Input
function showModal() {
    modal.classList.add('show-modal')
    //websiteElement.focus()
}

//Modal Event Listeners
//modalShow.addEventListener('click', showModal)
//modalClose.addEventListener('click', () => {modal.classList.remove('show-modal')})
window.addEventListener('click', (e) => {e.target === modal ? modal.classList.remove('show-modal') : false})

//Validate Form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
    const regex = new RegExp(expression)
    if(!nameValue || !urlValue) {
        alert('Please submit valid values for both name and url')
        return false
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid URL')
        return false
    }
    //Valid Data
    return true
}

//Build Bookmarks DOM
function buildBookmarks() {
    //Remove All Bookmarks Elements
    bookmarksContainer.textContent = ''
    //Build Items
    Object.keys(bookmarks).forEach((id) => {

		const { name, url, img } = bookmarks[id]

		// Item
		const item = document.createElement('div')
    item.classList.add('item')
		// Close Icon
		const closeIcon = document.createElement('i')
		//closeIcon.classList.add('fas', 'fa-times')
		closeIcon.setAttribute('title', 'Delete Bookmark')
		closeIcon.setAttribute('onclick', `deleteBookmark('${id}')`)
		// Favicon / Link Container
		const linkInfo = document.createElement('div')
		linkInfo.classList.add('name')
		// Favicon
		const favicon = document.createElement('img')
		favicon.setAttribute('src', img)
		favicon.setAttribute('alt', 'poster')
		// Link
		const link = document.createElement('h2')
    link.textContent = name
    
		// Append to bookmarks container
		linkInfo.append(favicon, link)
    item.append(closeIcon, linkInfo)
    item.addEventListener('click',showModal)
    item.setAttribute('onclick', `getVideo('${url}')`)
		bookmarksContainer.appendChild(item)
  })
}

//Fetch Bookmarks From Local Storage
function fetchBookmarks() {
    //Get Bookmarks From Local Storage If Available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    }else {
        //Create Bookmars Object In Local Storage
        const id = `TheSleepover`

		bookmarks[id] = {
			name: 'The Sleepover',
      url: 'https://storage.googleapis.com/hazel-goal-287314/YWP_DQKCVVCW/22m_1598599544327234.mp4',
      img: 'the-sleepover.jpg',
        }

    bookmarks[`JumanjiWTTJ`] = {
      name: 'Jumanji: Welcome to the jungle',
      url: 'https://storage.googleapis.com/gold-bruin-287316/477Z5PRYKUPI/st22_jumanji-welcome-to-the-jungle.1598686343.mp4',
      img: 'jumanji-welcome-to-the-jungle.jpg',
        }

    bookmarks[`JumanjiNL`] = {
      name: 'Jumanji: Next Level',
      url: 'https://storage.googleapis.com/gold-bruin-287316/GXSLLGAXDI/st22_jumanji-the-next-level.1598672378.mp4',
      img: 'jumanji-the-next-level.jpg'
        }
        
        //localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }
    buildBookmarks()
}

//Delete Bookmarks
function deleteBookmark(id) {
    // Loop through the bookmarks array
    if (bookmarks[id]) {
		delete bookmarks[id]
    }
    
    //Update Bookmarks Array in Local Storage, Re-Populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    fetchBookmarks()
}

//Handle Data From form
function storeBookmark(e) {
    e.preventDefault()
    const nameValue = websiteElement.value
    let urlValue = websiteUrlElement.value
    if(!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`
    }
    //console.log(nameValue, urlValue)
    if(!validate(nameValue, urlValue)) {
        return false
    }
    const bookmark = {
        name: nameValue,
        url: urlValue
    }
    bookmarks[urlValue] = bookmark
    console.log(bookmarks)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    fetchBookmarks()
    bookmarkForm.reset()
    websiteElement.focus()
}

//Event Listeners
//bookmarkForm.addEventListener('submit', storeBookmark)

//Onload Fetch Bookmarks
fetchBookmarks()



let videoArray = ['https://pixabay.com/it/videos/download/video-19204_small.mp4','https://pixabay.com/it/videos/download/video-24216_small.mp4','https://pixabay.com/it/videos/download/video-26262_medium.mp4','https://pixabay.com/it/videos/download/video-46132_tiny.mp4']
let randomVideo = videoArray[Math.floor(Math.random() * videoArray.length)]

function getVideo(src) {
  video.src = src
}



// Play & Pause ----------------------------------- //
function togglePlay() {
  if (video.paused) {
    video.play();
    playButton.classList.replace("fa-play", "fa-pause");
    playButton.setAttribute("title", "Pause");
  } else {
    video.pause();
    playButton.classList.replace("fa-pause", "fa-play");
    playButton.setAttribute("title", "Play");
  }
}

function showPlayIcon() {
  playButton.classList.replace("fa-pause", "fa-play");
  playButton.setAttribute("title", "Play");
  video.src = randomVideo
}
// On Video End, Show Play Button
video.addEventListener("ended", showPlayIcon);

// Progress Bar ---------------------------------- //

//Calculate Display Time Format
function displayTime(time) {
  let minutes = Math.floor(time / 60);
  minutes = minutes > 9 ? minutes : `0${minutes}`;
  const hours = Math.floor(minutes * 60);
  let seconds = Math.floor(time % 60);
  seconds = seconds > 9 ? seconds : `0${seconds}`;
  return `${hours}:${minutes}:${seconds}`;
}

//Update Progress Bar As Video Plays
function updateProgress() {
  progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
  currentTime.textContent = `${displayTime(video.currentTime)} /`;
  duration.textContent = `${displayTime(video.duration)}`;
}

//Click To Seek Within The Video
function setProgress(e) {
  const newTime = e.offsetX / progressRange.offsetWidth;
  progressBar.style.width = `${newTime * 100}%`;
  video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //

let lastVolume = 1;

// Volume Bar
function changeVolume(e) {
  let volume = e.offsetX / volumeRange.offsetWidth;
  // Rounding Volume UP or DOWN
  if (volume < 0.1) {
    volume = 0;
  }
  if (volume > 0.9) {
    volume = 1;
  }
  volumeBar.style.width = `${volume * 100}%`;
  video.volume = volume;
  // Change Icon Depending On Volume
  volumeIcon.className = "";
  if (volume >= 0.7) {
    volumeIcon.classList.add("fas", "fa-volume-up");
  } else if (volume < 0.7 && volume > 0) {
    volumeIcon.classList.add("fas", "fa-volume-down");
  } else if (volume === 0) {
    volumeIcon.classList.add("fas", "fa-volume-off");
  }
  lastVolume = volume;
}

// Mute / Unmute
function toggleMute() {
  volumeIcon.className = "";
  if (video.volume) {
    lastVolume = video.volume;
    video.volume = 0;
    volumeBar.style.width = 0;
    volumeIcon.classList.add("fas", "fa-volume-mute");
    volumeIcon.setAttribute("title", "Unmute");
  } else {
    video.volume = lastVolume;
    volumeBar.style.width = `${lastVolume * 100}%`;
    volumeIcon.className = "";
    volumeIcon.classList.add("fas", "fa-volume-up");
    volumeIcon.setAttribute("title", "Mute");
  }
}
// Change Playback Speed -------------------- //
function changeSpeed() {
  video.playbackRate = speed.value
}
// Fullscreen ------------------------------- //
/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
  video.classList.add('video-fullscreen')
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
  video.classList.remove('video-fullscreen')
}

let fullscreen = false

// Toggle Fullscreen
function toggleFullscreen() {
  !fullscreen ? openFullscreen(player) : closeFullscreen()
  fullscreen = !fullscreen
}

// Download ------------------------------- //
function downloadFile() {
  let videoUrl = video.src
  window.location.href = videoUrl
  //  const videoA = document.createElement('a')
  //  videoA.setAttribute('href', videoUrl)
  //  videoA.setAttribute('download',videoUrl)
  //  videoA.click
}

// Event Listeners
playButton.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
video.addEventListener("timeupdate", updateProgress);
video.addEventListener("canplay", updateProgress);
progressRange.addEventListener("click", setProgress);
volumeRange.addEventListener("click", changeVolume);
volumeIcon.addEventListener("click", toggleMute);
speed.addEventListener("change", changeSpeed)
downloadButton.addEventListener("click",downloadFile)
fullscreenButton.addEventListener("click",toggleFullscreen)