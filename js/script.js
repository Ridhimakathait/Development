let currentSong = new Audio();
let songs;
let currFolder;
function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    // Calculate the minutes
    let minutes = Math.floor(seconds / 60);

    // Calculate the remaining seconds
    let remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to be two digits
    let formattedMinutes = minutes.toString().padStart(2, '0');
    let formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Ridhima</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                        </li>`;

    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}

const playMusic = (track, pause = false) => {
    // let audio=new Audio("/songs/"+track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"


}


async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    
    let anchors = div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".cardContainer")
    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder =e.href.split("/").slice(-2)[0]
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML=cardContainer.innerHTML+`<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34"
                                fill="#1DB954">
                                <circle cx="12" cy="12" r="10" fill="#1DB954" />
                                <path d="M10 8l6 4-6 4V8z" fill="#FFFFFF" />
                            </svg>

                        </div>
                        <img src="/songs/${folder}/cover.jpg"
                            alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {

            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
}
async function main() {

    await getsongs("songs/ncs")
    playMusic(songs[0], true)

    await displayAlbums()


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)}/${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        console.log("previous")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        console.log("next")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value) / 100
    })

    

}

main()