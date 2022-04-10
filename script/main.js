import { musicPlayer } from "./musicPlayer.js";

const userBtn = document.querySelector('#head-bar .user-nav');
const userOptions = document.querySelector('#head-bar .options');
const headBar = document.querySelector('#head-bar');
const resizeBar = document.querySelector('main .resize-bar');
const sideBar = document.querySelector('aside');
const mainSection = document.querySelector('main');
const root = document.querySelector('html');
const scrollBar = document.querySelector('#wrapper .scroll-thumb');
const scrollTrack = document.querySelector("#wrapper .scroll-bar");
let mouseDown = false;
let defaultOffsetX, defaultOffsetY;
let maxSize = 413, minSize = 151;

userBtn.addEventListener('click', showUserNav)
mainSection.addEventListener('click', () => {
    userOptions.classList.add('d-none');
})

document.addEventListener('scroll', () => {
    let playerHeight = parseInt(getComputedStyle(scrollTrack).bottom.substring(0, 3));
    let maxY = mainSection.scrollHeight - innerHeight;
    let maxOffsetY = innerHeight - parseInt(getComputedStyle(scrollBar).height) - playerHeight;
    changeOpaHeadBar();
    moveScrollBar(maxY, maxOffsetY, scrollY);
})


resizeBar.addEventListener('mousedown', function(e) {
    mouseDown = true;
    // update curState
    defaultOffsetX = e.clientX;
})

scrollTrack.addEventListener('mousedown', function(e) {
    mouseDown = true;
    defaultOffsetY = e.clientY;
})

scrollTrack.addEventListener('mousemove', function(e) {
    if(mouseDown) {
        let maxY = mainSection.scrollHeight - innerHeight;
        let curOffsetY = (e.clientY / innerHeight);
        window.scrollTo(0, curOffsetY * maxY);
    }
})

document.addEventListener('mouseup', () => {
    mouseDown = false;
})

resizeBar.addEventListener('mousemove', resize)

function resize(e) {
    if (mouseDown) {
        let rootFontSize = getComputedStyle(root).getPropertyValue('font-size');
        let curOffset = e.clientX;
        let change = curOffset - defaultOffsetX;
        //reach max/min width
        if ((change > 0 && sideBar.offsetWidth >= maxSize) || (change < 0 && sideBar.offsetWidth <= minSize))
            return;
        //resize the mainsection
        mainSection.style.left = `${mainSection.offsetLeft + change}px`;
        sideBar.style.width = `${sideBar.offsetWidth + change}px`;
        headBar.style.left = `${headBar.offsetLeft + change}px`;
        //sau khi move -> update lai offsetX
        defaultOffsetX = e.clientX;
    }
}

function moveScrollBar(maxY, maxOffsetY, offsetY) {
    // innerHeight : get height of client
    let curPosition = (offsetY/maxY) * maxOffsetY;
    scrollBar.style.top = `${curPosition}px`;
}

function changeOpaHeadBar() {
    let alpha = scrollY / innerHeight;
    alpha = alpha >= 1 ? 1 : alpha;
    headBar.style.backgroundColor = `rgba(0, 0, 0, ${alpha})`;
}

function showUserNav(e) {
    userBtn.classList.toggle('bg-g-700');
    let caretIcon = userBtn.querySelector('i');
    //change angle of caret icon
    if (caretIcon.classList.contains('fa-caret-down')) 
        caretIcon.classList.replace('fa-caret-down', 'fa-caret-up');
    else 
        caretIcon.classList.replace('fa-caret-up', 'fa-caret-down');

    userOptions.classList.toggle('d-none');
    e.stopPropagation();
}








