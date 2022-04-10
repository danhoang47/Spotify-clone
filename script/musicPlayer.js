import {vnSongs, usukSongs} from "./song.mjs";
const playBtn = document.querySelector('#player-wrapper .play-btn')

playBtn.addEventListener('click', () => {
    if (!musicPlayer.isPlay) {
        musicPlayer.isPlay = true;
        musicPlayer.audio.play();
        playBtn.classList.replace('fa-circle-play', 'fa-circle-pause');
    }
    else {
        musicPlayer.isPlay = false;
        musicPlayer.audio.pause();
        playBtn.classList.replace('fa-circle-pause', 'fa-circle-play');
    } 
})

export const musicPlayer = {
    dom : document.querySelector('#player-wrapper'),
    audio : document.querySelector('#player-wrapper audio'),
    isPlay: false,

    getCurrentplay() {
        setInterval(() => {
            console.log(this.audio.currentTime);
        }, 2000);
        // render ui
    },

    setLoop() {
        if(!this.audio.loop)
            this.audio.loop = true;
        else 
            this.audio.loop = false;
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

