const userBtn = document.querySelector('#head-bar .user-nav');
const userOptions = document.querySelector('#head-bar .options');
const headBar = document.querySelector('#head-bar');
const resizeBar = document.querySelector('main .resize-bar');
const sideBar = document.querySelector('aside');
const mainSection = document.querySelector('main');
const root = document.querySelector('html');
let mouseDown = false;
let defaultOffset;
let maxSize = 413, minSize = 151;

userBtn.addEventListener('click', () => {
    userBtn.classList.toggle('bg-g-700');
    let caretIcon = userBtn.querySelector('i');
    //change angle of caret icon
    if (caretIcon.classList.contains('fa-caret-down')) 
        caretIcon.classList.replace('fa-caret-down', 'fa-caret-up');
    else 
        caretIcon.classList.replace('fa-caret-up', 'fa-caret-down');

    userOptions.classList.toggle('d-none');
})

document.addEventListener('scroll', () => {
    let alpha = scrollY / innerHeight;
    alpha = alpha >= 1 ? 1 : alpha;
    headBar.style.backgroundColor = `rgba(0, 0, 0, ${alpha})`;
})

resizeBar.addEventListener('mousedown', function(e) {
    mouseDown = true;
    // update curState
    defaultOffset = e.clientX;
})

document.addEventListener('mouseup', () => {
    mouseDown = false;
})

resizeBar.addEventListener('mousemove', resize)

function resize(e) {
    if (mouseDown) {
        let rootFontSize = getComputedStyle(root).getPropertyValue('font-size');
        let curOffset = e.clientX;
        let change = curOffset - defaultOffset;
        //reach max/min width
        if ((change > 0 && sideBar.offsetWidth >= maxSize) || (change < 0 && sideBar.offsetWidth <= minSize))
            return;
        //resize the mainsection
        mainSection.style.left = `${mainSection.offsetLeft + change}px`;
        sideBar.style.width = `${sideBar.offsetWidth + change}px`;
        headBar.style.left = `${headBar.offsetLeft + change}px`;
        //sau khi move -> update lai offsetX
        defaultOffset = e.clientX;
    }
}






