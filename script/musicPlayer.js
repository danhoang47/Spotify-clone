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
// player button
const loopBtn = document.querySelector('#player-wrapper .fa-repeat');
const shuffleBtn = document.querySelector('#player-wrapper .fa-shuffle');
const nextSongBtn = document.querySelector('#player-wrapper .fa-forward-step');
const prevSongBtn = document.querySelector('#player-wrapper .fa-backward-step');

const listSongItems = document.querySelectorAll('#main-content .play-btn');

const volumeIcons = [
    'fa-volume-xmark',
    'fa-volume-low',
    'fa-volume-high',
]
let index = 0;
let currentAudioLength;
let playerMouseDown = false;
let curVolume = volumeBtn.classList.item(1);

export const musicPlayer = {
    isPlay: false,
    volume: 100,
    onPlayingTrack: [],
    isMixed: false,
    locale: '',

    init() {
        playBtn.addEventListener('click', this.playSong);

        volumeBtn.addEventListener('click', () => {
            if (!audio.muted) 
                musicPlayer.renderVolume(audio.muted = true);
            else 
                musicPlayer.renderVolume(audio.muted = false);
        });

        progressBar.addEventListener('mousedown', () => playerMouseDown = true);
        progressBar.addEventListener('mousemove', function(e) {
            if (playerMouseDown)
                musicPlayer.setCurrentTime(e);
        })

        progressBar.addEventListener('click', this.setCurrentTime);

        volumeTrack.addEventListener('mousedown', () => {
            playerMouseDown = true;
        });

        document.addEventListener('mouseup', () => {
            playerMouseDown = false;
        });

        volumeTrack.addEventListener('mousemove', function(e) {
            if (playerMouseDown) 
                musicPlayer.setVolume(e);
        });

        loopBtn.addEventListener('click', () => {
            if (!audio.loop) 
                audio.loop = true;
            else    
                audio.loop = false;
            
            loopBtn.classList.toggle('cl-green');
        })

        volumeTrack.addEventListener('click', this.setVolume);

        for (let i = 0; i < listSongItems.length; i++) {
            listSongItems.item(i).addEventListener('click', function(e) {
                clearInterval(currentAudioLength);
                let songName = e.currentTarget.getAttribute('song-info');
                let locale = e.currentTarget.getAttribute('locale');
                // single
                if (songName !== 'tracks')
                    musicPlayer.setPlayedSong(songName.toLowerCase(), locale, false);
                //tracks
                else 
                    musicPlayer.setPlayedSong(e.currentTarget.getAttribute('type'), '', true);
            });
        }

        audio.addEventListener('durationchange', () => {this.renderSongDuration()})

        shuffleBtn.addEventListener('click', () => {
            if(!this.isMixed) {
                let listMixed = this.getListMixed(this.onPlayingTrack);
                this.onPlayingTrack = listMixed;
                this.setListTrack(this.locale);
                this.isMixed = true;
            }
            shuffleBtn.classList.toggle('cl-green');
        })
    },

    setPlayedSong(songName, locale, isTrack) {
        if (!isTrack) {
            let searchList = [];
            if (locale === 'VN') searchList = vnSongs;
            else if (locale === 'US-UK') searchList = usukSongs;
            searchList.forEach((value) => {
                if (value.songName.toLowerCase() === songName) {
                    audio.src = value.audio;
                    audio.load(); // load data of new song
                    this.renderUI(value); // render img, name and artist
                    this.playSong(); //
                    musicPlayer.isPlay = false;
                }
            })
        }
        else {
            if (songName === 'vietnam tracks') {
                this.onPlayingTrack = vnSongs;
                this.setListTrack('VN');
                this.locale = 'VN';
                audio.addEventListener('ended', this.setListTrack);
            }
            else {
                this.onPlayingTrack = usukSongs;
                this.setListTrack('US-UK');
                this.locale = 'US-UK';
                audio.addEventListener('ended', this.setListTrack)
            }
        }
    },

    playSong() {
        if (!musicPlayer.isPlay) {
            musicPlayer.isPlay = true;
            audio.play();
            musicPlayer.renderSongDuration();
            playBtn.classList.replace('fa-circle-play', 'fa-circle-pause');
            currentAudioLength = setInterval(musicPlayer.renderPlayer, 900);
        }
        else {
            musicPlayer.isPlay = false;
            audio.pause();
            playBtn.classList.replace('fa-circle-pause', 'fa-circle-play');
            clearInterval(currentAudioLength);
        } 
    },

    renderUI(song) {
        let playerSong = document.querySelector('#player-wrapper .song');
        playerSong.querySelector('img').classList.remove('d-none');
        playerSong.querySelector('img').src = song.cover;
        playerSong.querySelector('.song-name').innerHTML = `${song.songName}`;
        playerSong.querySelector('.artist-name').innerHTML = `${song.artist}`;
    },

    setListTrack(locale) {
        if (index === musicPlayer.onPlayingTrack.length) {
            audio.removeEventListener('ended');
            index = 0;
        }
        else {
            musicPlayer.setPlayedSong(musicPlayer.onPlayingTrack[index].songName.toLowerCase(), locale, false);
            index++;
        }
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
        musicPlayer.renderVolume(false);
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

        return listPlay;
    },

    renderVolume(audioState) {
        if (audio.volume == 0 || audioState)  {
            volumeBtn.classList.replace(curVolume, volumeIcons[0]);
        }
        else {
            audio.muted = false;
            if (audio.volume > 0 && audio.volume <= 0.6)
                volumeBtn.classList.replace(curVolume, volumeIcons[1]);
            else 
                volumeBtn.classList.replace(curVolume, volumeIcons[2]);
        }
    
        curVolume = volumeBtn.classList.item(1);
    }
}

musicPlayer.init();