import {vnSongs, usukSongs} from "./song.mjs";
const playBtn = document.querySelector('#player-wrapper .play-btn');
const onPlayBar = document.querySelector('#player-wrapper .on-play-bar');
const progressBar = document.querySelector('#player-wrapper .progress');
const audio = document.querySelector('#player-wrapper audio');
const volumeBtn = document.querySelector('#player-wrapper .volume-btn');
const volumeBar = document.querySelector('#player-wrapper .volume-bar');
const volumeTrack = document.querySelector('#player-wrapper .volume-controls');
const songPlayed = document.querySelector('#player-wrapper .played');
const songDuration = document.querySelector('#player-wrapper .end');
const loopBtn = document.querySelector('#player-wrapper .fa-repeat');
const volumeIcons = [
    'fa-volume-xmark',
    'fa-volume-low',
    'fa-volume-high',
]
let currentAudioLength;
let volumeMouseDown = false;
let curVolume = volumeBtn.classList.item(1);

export const musicPlayer = {
    isPlay: false,
    volume: 100,

    init() {
        playBtn.addEventListener('click', () => {
            if (!musicPlayer.isPlay) {
                musicPlayer.isPlay = true;
                audio.play();
                this.renderSongDuration();
                playBtn.classList.replace('fa-circle-play', 'fa-circle-pause');
                currentAudioLength = setInterval(musicPlayer.renderPlayer, 100);
            }
            else {
                musicPlayer.isPlay = false;
                audio.pause();
                playBtn.classList.replace('fa-circle-pause', 'fa-circle-play');
                clearInterval(currentAudioLength);
            } 
        });

        volumeBtn.addEventListener('click', () => {
            if (!audio.muted) 
                renderVolume(audio.muted = true);
            else 
                renderVolume(audio.muted = false);
        });


        progressBar.addEventListener('click', this.setCurrentTime);

        volumeTrack.addEventListener('mousedown', () => {
            volumeMouseDown = true;
        });

        document.addEventListener('mouseup', () => {
            volumeMouseDown = false;
        });

        volumeTrack.addEventListener('mousemove', function(e) {
            // if (volumeMouseDown) {
            //     console.log(e.clientX);
            // }
        });

        loopBtn.addEventListener('click', () => {
            if (!audio.loop) 
                audio.loop = true;
            else    
                audio.loop = false;
            
            loopBtn.classList.toggle('cl-green');
        })

        volumeTrack.addEventListener('click', this.setVolume);
    },

    setCurrentTime(e) {
        const target = e.target;

        // Get the bounding rectangle of target - box-model
        const rect = target.getBoundingClientRect();
        // Mouse position
        const x = e.clientX - rect.left >= 0 ?  e.clientX - rect.left : 0;
        //set audio volume 
        let progressBarWidth = getComputedStyle(progressBar).width;
        progressBarWidth = progressBarWidth.substring(0, progressBarWidth.length - 2);
        let percent = x/parseInt(progressBarWidth);
        onPlayBar.style.width = `${Math.ceil(percent * 100)}%`;
        audio.currentTime = audio.duration * percent;
    },

    setVolume(e) {
        // Get the target
        const target = e.target;

        // Get the bounding rectangle of target - box-model
        const rect = target.getBoundingClientRect();
        // Mouse position
        const x = e.clientX - rect.left >= 0 ?  e.clientX - rect.left : 0;
        //set audio volume 
        let volumeBarWidth = getComputedStyle(volumeTrack).width;
        volumeBarWidth = volumeBarWidth.substring(0, volumeBarWidth.length - 2);
        let percent = x/parseInt(volumeBarWidth);
        audio.volume = percent;
        volumeBar.style.width = `${Math.ceil(percent * 100)}%`;
        renderVolume(false);
    },

    renderSongDuration() {
        let minute = Math.floor(audio.duration / 60);
        let second = Math.round(audio.duration - minute * 60);
        second = second < 10 ? "0" + second : "" + second;
        songDuration.innerHTML = `${minute}:${second}`;
    },

    setLoop() {
        if(!audio.loop)
            audio.loop = true;
        else 
            audio.loop = false;
    },

    renderPlayer() {
        let percent = (audio.currentTime/audio.duration) * 100;
        // render progressBar ui
        onPlayBar.style.width = `${percent}%`;
        // render time
        let playedMin = Math.floor(audio.currentTime / 60);
        let playedSec = Math.round(audio.currentTime - playedMin * 60);
        playedSec = playedSec < 10 ? "0" + playedSec : playedSec;
        songPlayed.innerHTML = `${playedMin}:${playedSec}`;
    },

    getListMixed(listOfSongs) {
        let numberOfSongs = listOfSongs.length;
        let mixList = [];
        while (mixList.length != numberOfSongs) {
            let number = parseInt(Math.round(Math.random() * numberOfSongs - 1));
            if (!mixList.includes(number) && number >= 0)
                mixList = [...mixList, number];
        }

        let listPlay = [];
        mixList.forEach((value, index) => {
            listPlay = [...listPlay, listOfSongs[value]];
        });
        console.log(listPlay);
    },
}

function renderVolume(audioState) {
    if (audio.volume == 0 || audioState)  {
        volumeBtn.classList.replace(curVolume, volumeIcons[0]);
    }
    else {
        audio.muted = false;
        console.log(audio.volume);
        if (audio.volume > 0 && audio.volume <= 0.6)
            volumeBtn.classList.replace(curVolume, volumeIcons[1]);
        else 
            volumeBtn.classList.replace(curVolume, volumeIcons[2]);
    }

    curVolume = volumeBtn.classList.item(1);
}

musicPlayer.init();
