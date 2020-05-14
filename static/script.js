var toggleButton = document.getElementById("mp4-toggle-switch-button");
var playPauseButton = document.getElementById("play-pause");
var nextButton = document.getElementById("next");
var prevButton = document.getElementById("prev");
var mp4_screen = document.getElementById("mp4-screen");
var mp4_off = true;
var playing = false;
var audio = document.getElementById("audio");

var songs = [{ title: "sample.mp3", src: "./music/sample.mp3" }];
var songsLength = songs.length;

var songIndex = 0;

function refreshDisplay() {
  const songList = songs
    .map((s, index) => {
      const songNumber = `${index + 1}`.padStart(3, " ");
      const removeButton = `<span class="remove-button" onclick="removeSong(${index}); event.stopPropagation();">x</span>`;

      if (index === songIndex) {
        return `<div class="song-entry highlighted" onclick="selectSong(${index})">
                      <span class="song-number">${songNumber}</span> ${s.title} ${removeButton}
                  </div>`;
      }
      return `<div class="song-entry" onclick="selectSong(${index})">
                  <span class="song-number">${songNumber}</span> ${s.title} ${removeButton}
                </div>`;
    })
    .join("");

  mp4_screen.innerHTML = songList;
}

function selectSong(_songIndex) {
  songIndex = _songIndex;
  loadSong(_songIndex);
  playSong();
}

function removeSong(index) {
  songs.splice(index, 1);
  songsLength = songs.length;
  if (songIndex >= songsLength) {
    songIndex = songsLength - 1;
  }
  refreshDisplay();
  if (songsLength > 0) {
    loadSong(songIndex);
  } else {
    pauseSong();
    mp4_screen.innerHTML = "";
    audio.src = "";
  }
}

function loadSong(songIndex) {
  let song = songs[songIndex];
  if (!song) return;
  audio.src = song.src;
  refreshDisplay();
  mp4_screen.style.backgroundSize = "100% 100%";
  mp4_screen.style.backgroundColor = "#fff";
  if (playing) playSong();
}

function addSongToPlaylist() {
  if (mp4_off) return;

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "audio/*";
  input.click();

  input.addEventListener("change", function (event) {
    if (mp4_off) return;
    const file = event.target.files[0];
    if (!file) return;
    songs.push({ title: file.name, src: URL.createObjectURL(file) });
    songsLength = songs.length;
    refreshDisplay();
  });
}

function OnOffFunction() {
  if (mp4_off) {
    toggleButton.style.left = "50%";
    mp4_screen.style.backgroundSize = "100% 100%";
    mp4_screen.style.backgroundColor = "#fff";
    loadSong(songIndex);
  } else {
    toggleButton.style.left = "0";
    mp4_screen.innerHTML = "";
    mp4_screen.style.background = "none";
    mp4_screen.style.backgroundColor = "#000";
    playPauseButton.src = "./assets/play.png";
    pauseSong();
  }
  mp4_off = !mp4_off;
}

function togglePlayPause() {
  if (mp4_off) return;
  if (playing) {
    pauseSong();
  } else {
    playSong();
  }
}

function playSong() {
  playPauseButton.src = "./assets/pause.png";
  playing = true;
  audio.play();
}

function pauseSong() {
  playPauseButton.src = "./assets/play.png";
  playing = false;
  audio.pause();
}

function nextSong() {
  if (mp4_off) return;
  songIndex = (songIndex + 1) % songsLength;
  loadSong(songIndex);
  playSong();
}

function prevSong() {
  if (mp4_off) return;
  songIndex = (songIndex - 1 + songsLength) % songsLength;
  loadSong(songIndex);
  playSong();
}

audio.addEventListener("ended", function () {
  pauseSong();
  nextSong();
});
