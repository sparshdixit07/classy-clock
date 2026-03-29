// let language = "EN";

// function updateClock() {
//     fetch("/time")
//         .then(res => res.json())
//         .then(data => {
//             document.getElementById("clock").innerHTML =
//                 `${data.hour} : ${data.minute} : ${data.second} : ${data.pal}`;

//             document.getElementById("date").innerHTML =
//                 language === "EN"
//                 ? `Date : ${data.date} | Year ${data.year}`
//                 : `तारीख : ${data.date} | वर्ष ${data.year}`;
//         });

//     fetch("/check_alarm")
//         .then(res => res.json())
//         .then(data => {
//             if (data.ring) {
//                 document.getElementById("alarmSound").play();
//                 document.getElementById("alarmStatus").innerHTML =
//                     language === "EN" ? "⏰ Alarm Ringing!" : "⏰ अलार्म बज रहा है!";
//             }
//         });
// }

// setInterval(updateClock, 100);
// updateClock();

// function setAlarm() {
//     const time = document.getElementById("alarmTime").value;
//     fetch("/set_alarm", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ alarm: time })
//     })
//     .then(res => res.json())
//     .then(data => {
//         document.getElementById("alarmStatus").innerHTML =
//             language === "EN" ? `Alarm Set: ${time}` : `अलार्म सेट: ${time}`;
//     });
// }

// function toggleLanguage() {
//     language = language === "EN" ? "HI" : "EN";
// }

// function goFullscreen() {
//     document.documentElement.requestFullscreen();
// }



const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("fireSound");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let rockets = [];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

/* 🔊 Sound */
function playSound() {
    sound.currentTime = 0;
    sound.play();
}

/* 🎆 Firework blast */
function createFirework(x, y) {
    for (let i = 0; i < 80; i++) {
        particles.push({
            x, y,
            vx: random(-6, 6),
            vy: random(-6, 6),
            alpha: 1,
            color: `hsl(${Math.random() * 360},100%,60%)`
        });
    }
}

/* 🚀 Rocket launch */
function launchRocket(x) {
    rockets.push({
        x,
        y: canvas.height,
        vy: random(6, 9),
        targetY: random(120, canvas.height / 2)
    });
}

/* 🎇 Animation loop */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rockets.forEach((r, i) => {
        r.y -= r.vy;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fill();

        if (r.y <= r.targetY) {
            playSound();
            createFirework(r.x, r.y);
            rockets.splice(i, 1);
        }
    });

    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        ctx.fillStyle = `hsla(${p.color.match(/\d+/)[0]},100%,60%,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        if (p.alpha <= 0) particles.splice(i, 1);
    });

    requestAnimationFrame(animate);
}
animate();

/* ⏱️ Clock + Smart Fireworks */
let lastMinute = null, lastHour = null, lastDate = null, lastYear = null;

function updateClock() {
    fetch("/time").then(r => r.json()).then(d => {
        document.getElementById("clock").innerHTML =
            `${d.hour}:${d.minute}:${d.second}`;
        document.getElementById("date").innerHTML =
            `Date ${d.date} | ${d.year}`;

        if (lastMinute && d.minute !== lastMinute) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    launchRocket(random(100, canvas.width - 100));
                }, i * 150);
            }
        }

        if (lastHour && d.hour !== lastHour) {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    launchRocket(random(100, canvas.width - 100));
                }, i * 100);
            }
        }

        if (lastDate && d.date !== lastDate) {
            for (let i = 0; i < 30; i++)
                launchRocket(random(50, canvas.width - 50));
        }
        // 🎉 YEAR CHANGE EVENT
        if (lastYear && d.year !== lastYear) {

            // 🔥 HAPPY NEW YEAR TEXT SHOW
            const txt = document.getElementById("newYearText");
            txt.style.display = "block";

            // 🎆 PURE SCREEN FIREWORKS
            for (let i = 0; i < 40; i++) {
                setTimeout(() => {
                    launchRocket(random(50, canvas.width - 50));
                }, i * 100);
            }

            // ⏳ 15 sec baad text hide
            setTimeout(() => {
                txt.style.display = "none";
            }, 15000);
        }



        lastMinute = d.minute;
        lastHour = d.hour;
        lastDate = d.date;
        lastYear = d.year;
    });
}

setInterval(updateClock, 1000);
updateClock();
