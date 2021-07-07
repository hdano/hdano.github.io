/**
 * Set Start button to wait state
 */
const btnWaitState = () => {
    let btn = document.querySelector('#btnStart')
    btn.setAttribute('disabled','disabled')
    btn.innerText = 'Please wait...'
}

/**
 * Set Start button to normal state
 */
const btnNormalState = () => {
    let btn = document.querySelector('#btnStart')
    btn.removeAttribute('disabled')
    btn.innerText = 'Start'
}

/**
 * Hide badges in tab links for counts
 */
const hideCounts = () => {
    document.querySelectorAll('#tabLinks .badge').forEach((el) => {
        el.classList.add('d-none')
    })
}

const showOverlay = () => {
    document.getElementById("overlay-content").innerText = "Loading please wait..."
    document.getElementById("overlay").style.display = "block";
}

const hideOverlay = () => {
    document.getElementById("overlay").style.display = "none";
}