//PAGE TOGGLING
//save elements into constants
const page1btn = document.querySelector("#page1btn");
const page2btn = document.querySelector("#page2btn");
const page3btn = document.querySelector("#page3btn");
const page4btn = document.querySelector('#page4btn');
const page5btn = document.querySelector('#page5btn');
const allpages = document.querySelectorAll(".page");
const allpage4sections = document.querySelectorAll("#page4 section");

//function to hide all pages
function hideallpages() {
    for (let onepage of allpages) { //go through all subtopic pages (let...of...)
        onepage.style.display = "none";
    }
}

//function to show selected page no
function showpage(pgno) {
    hideallpages(); //hide all first

    if (pgno != 4) {
        removeActive();
    }

    //select the page based on the parameter passed in
    let selectedpage = document.querySelector("#page" + pgno); //save selected page into a variable
    selectedpage.style.display = "block"; //show the page
}

function removeActive() {
    for (let onesection of allpage4sections) {
        onesection.classList.remove("active");
    }
}

/*Listen for clicks on the buttons, assign anonymous eventhandler functions to call show function*/
page1btn.addEventListener("click", function () {
    showpage(1);
});
page2btn.addEventListener("click", function () {
    showpage(2);
});
page3btn.addEventListener("click", function () {
    showpage(3);
});
page4btn.addEventListener("click", function () {
    showpage(4);
    setTimeout(function () {
        for (let onesection of allpage4sections) {
            onesection.classList.add("active");
        }
    }, 100);
});
page5btn.addEventListener("click", function () {
    showpage(5);
});

hideallpages(); //hide all initially
showpage(1); //show home page first



//FUN FACTS TOGGLING
const allfacts = document.querySelectorAll(".fact");
const leftarrow = document.querySelector("#leftarrow");
const rightarrow = document.querySelector("#rightarrow");

//function to hide all facts
function hideallfacts() {
    for (let onefact of allfacts) {
        onefact.style.display = "none";
    }
}

//function to show selected fact no
function showfact(factno) {
    hideallfacts();
    let selectedfact = document.querySelector("#fact" + factno);
    selectedfact.style.display = "block";
}

const page1 = document.querySelector("#page1");
// start from 2 since fact 1 is manually shown
let currentfact = 1;

hideallfacts();
showfact(1);

//cycle through fun facts
function rotatefacts(direction) {
    if (page1.style.display === "block") {
        switch (direction) {
            case "left":
                currentfact--;
                if (currentfact < 1) currentfact = 9;
                break;
            case "right":
            case "auto":
                currentfact++;
                if (currentfact > 9) currentfact = 1;
                break;
            default:
                break;
        }

        showfact(currentfact);
    }
}

//run rotatefacts every 5s
let autorotatefacts = setInterval(function () {
    rotatefacts("auto");
}, 5000);

//click left arrow
leftarrow.addEventListener("click", function () {
    rotatefacts("left");
    //reset timer on click to avoid skip
    clearInterval(autorotatefacts);
    autorotatefacts = setInterval(function () {
        rotatefacts("auto");
    }, 5000);
});

//click right arrow
rightarrow.addEventListener("click", function () {
    rotatefacts("right");
    clearInterval(autorotatefacts);
    autorotatefacts = setInterval(function () {
        rotatefacts("auto");
    }, 5000);
});






// MINIGAME
const gamecontainer = document.getElementById("gamecontainer");
const scoretracker = document.getElementById("scoretracker");
const startbutton = document.getElementById("startbutton");
const pausebutton = document.getElementById("pausebutton");
const resetbutton = document.getElementById("resetbutton");
const nameinput = document.getElementById("nameinput");
const submitnamebutton = document.getElementById("submitname");
const timelimitdisplay = document.getElementById("timelimit");

let zzzspawninginterval; // this variable stores the set interval id (so can clear interval)
let countdowninterval;
let isgamepaused = true;
let currentscore = 0;
let playername = "You";
let timeleft = 30;

// spawn a zzz at a random position
function spawnzzz() {
    if (isgamepaused) return;

    const zzz = document.createElement("div");
    zzz.textContent = "💤";
    zzz.classList.add("zzz");

    const containersize = gamecontainer.getBoundingClientRect();
    let x = Math.random() * (containersize.width - 30);
    let y = Math.random() * (containersize.height - 30);

    zzz.style.left = x + "px";
    zzz.style.top = y + "px";

    gamecontainer.appendChild(zzz);
}

// update score display text
function updatescoredisplay() {
    scoretracker.textContent = `${playername} caught ${currentscore} Z's`;
}

// update timer display text
function updatetimerdisplay() {
    timelimitdisplay.textContent = `Time Limit: ${timeleft} seconds`;
}

// start game
function startgame() {
    // if not already spawning zzzs
    if (!zzzspawninginterval) {
        zzzspawninginterval = setInterval(spawnzzz, 500);
    }

    // if not already counting down
    if (!countdowninterval) {
        countdowninterval = setInterval(function () {
            // if not paused
            if (!isgamepaused) {
                timeleft--;
                updatetimerdisplay();
                if (timeleft <= 0) {
                    if (currentscore < 20) {
                        alert(`You only caught ${currentscore} Z's, you need more sleep...`);
                    } else if (currentscore >= 20 && currentscore <= 40) {
                        alert(`You caught ${currentscore} Z's, that's okay!`);
                    } else {
                        alert(`You caught ${currentscore} Z's, you got lots of sleep!`);
                    }
                    resetgame();
                }
            }
        }, 1000);
    }

    isgamepaused = false;
}

// pause game
function pausegame() {
    isgamepaused = true;
}

// reset game
function resetgame() {
    isgamepaused = true;
    clearInterval(zzzspawninginterval);
    clearInterval(countdowninterval);
    zzzspawninginterval = null;
    // remove old timer ID
    countdowninterval = null;

    //reset variables
    currentscore = 0;
    timeleft = 30;
    playername = "You";
    nameinput.value = "";

    updatescoredisplay();
    updatetimerdisplay();
    // clear all zzz
    gamecontainer.replaceChildren();
}

// update name when submitted
submitnamebutton.addEventListener("click", function () {
    // trim removes extra spaces at beginning and end of string
    const name = nameinput.value.trim();
    // if no value when submitted, fallback to "You"
    playername = name || "You";
    updatescoredisplay();
});

// add 1 to score when zzz is clicked
gamecontainer.addEventListener("click", function (event) {
    // cannot click on zzz when game is paused
    if (isgamepaused) {
        return;
    }

    if (event.target.classList.contains("zzz")) {
        //did not create variable for audio so multiple pops can overlap
        new Audio("Audio/popsound.mp3").play();
        event.target.remove();
        currentscore++;
        updatescoredisplay();
    }
});

// button listeners
startbutton.addEventListener("click", startgame);
pausebutton.addEventListener("click", pausegame);
resetbutton.addEventListener("click", resetgame);

// initial display
updatescoredisplay();
updatetimerdisplay();

//TOGGLE MENU PAGE
const menubtn = document.getElementById("menubtn");
const navmenu = document.querySelector("nav ul");

menubtn.addEventListener("click", function () {
    navmenu.classList.toggle("show");
});
