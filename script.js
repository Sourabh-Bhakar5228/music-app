console.log("soptify clone script");
let CurrentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "invalid input";
  }
  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = Math.floor(seconds % 60);

  const formatMinutes = String(minutes).padStart(2, "0");

  const formatSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formatMinutes}:${formatSeconds}`;
}

async function Getsongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
const playMusic = (track, pause = false) => {
  CurrentSong.src = `http://127.0.0.1:3000/songs/${track.trim()}`;
  if (!pause) {
    CurrentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};
async function main() {
  // list of  all song
  let songs = await Getsongs();
  // console.log(songs);
  playMusic(songs[0], true);
  //show all songs in the left playbar
  let songUl = document
    .querySelector(".SongList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li> <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", "")}</div>
                                <div>Sourabh </div>
                            </div>
                            <div class="playNow">
                                <span>Play now </span>
                                <img class="invert" src="play.svg" alt="">
                            </div> </li>`;
  }
  //attach event listner for all song
  Array.from(
    document.querySelector(".SongList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  //attach event listner  for play and next and previous
  play.addEventListener("click", () => {
    if (CurrentSong.paused) {
      CurrentSong.play();
      play.src = "pause.svg";
    } else {
      CurrentSong.pause();
      play.src = "play.svg";
    }
  });
  // listen for time update
  CurrentSong.addEventListener("timeupdate", () => {
    // console.log(CurrentSong.currentTime, CurrentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      CurrentSong.currentTime
    )}/${secondsToMinutesSeconds(CurrentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (CurrentSong.currentTime / CurrentSong.duration) * 100 + "%";
  });
  //add event listner in seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    CurrentSong.currentTime = (CurrentSong.duration * percent) / 100;
  });
  //add eventlistner  on hambuger
  document.querySelector(".hambuger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //add eventlistner  on close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%";
  });
}
main();
