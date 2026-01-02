let isRobotReady = false;
let lastDetectedTopic = null;
let lastDetectedEnd = null;
let autoCloseTimer = null;
let lastPageNum = 0;

// ==========================================
// 1. DRAG AND DROP (Silliq surish)
// ==========================================
const robotMascot = document.getElementById('robotMascot');
const robotDraggable = document.getElementById('robotDraggable');

let isDragging = false;
let startX, startY, currentX = 0, currentY = 0;

const dragStart = (e) => {
    isDragging = true;
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    
    startX = clientX - currentX;
    startY = clientY - currentY;
    robotDraggable.style.cursor = 'grabbing';
};

const dragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    
    currentX = clientX - startX;
    currentY = clientY - startY;
    
    robotMascot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
};

const dragEnd = () => {
    isDragging = false;
    robotDraggable.style.cursor = 'grab';
};

robotDraggable.addEventListener('mousedown', dragStart);
robotDraggable.addEventListener('touchstart', dragStart, { passive: false });
document.addEventListener('mousemove', dragMove);
document.addEventListener('touchmove', dragMove, { passive: false });
document.addEventListener('mouseup', dragEnd);
document.addEventListener('touchend', dragEnd);

// ==========================================
// 2. SKROLL VA MAVZULAR
// ==========================================
document.getElementById('pdfWrapper').addEventListener('scroll', () => {
    if (!isRobotReady) return;

    const pages = document.querySelectorAll('.pdf-page');
    let currentPage = 1;
    
    pages.forEach(page => {
        const rect = page.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            currentPage = parseInt(page.dataset.page);
        }
    });

    if (lastPageNum !== currentPage) {
        lastPageNum = currentPage;
        closeRobotMsg(); 
    }

    if (typeof mavzular !== 'undefined') {
        const currentTopic = mavzular.find(m => (m.bet + 11) === currentPage);
        const endingTopic = mavzular.find(m => (m.tugashBet + 11) === currentPage);

        if (currentTopic && lastDetectedTopic !== currentTopic.id) {
            lastDetectedTopic = currentTopic.id;
            congratulateTopic(currentTopic.nomi);
        }

        if (endingTopic) {
            if (lastDetectedEnd !== currentPage) {
                lastDetectedEnd = currentPage;
                offerTest(endingTopic);
            }
        } else {
            lastDetectedEnd = null;
        }
    }
});

// ==========================================
// 3. ROBOT FUNKSIYALARI
// ==========================================
function startLesson() {
    isRobotReady = true;
    const leftArm = document.getElementById('leftArm');
    const welcomeZone = document.getElementById('welcomeZone');
    const mainText = document.getElementById('mainText');

    leftArm.classList.add('is-raised');
    
    setTimeout(() => {
        welcomeZone.style.display = "none";
        mainText.style.display = "block";
        mainText.innerHTML = "<b>Ajoyib!</b> Birgalikda yangi bilimlarni egallaymiz! 🚀";
        leftArm.classList.remove('is-raised');
        setTimeout(() => closeRobotMsg(), 5000);
    }, 1500);
}

function congratulateTopic(name) {
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    const robotMsg = document.getElementById("robotMsg");
    const mainText = document.getElementById('mainText');
    robotMsg.style.display = "block";
    mainText.innerHTML = `<div style="color:#00f2ff; font-size:18px;">Yangi mavzu:</div><b style="font-size:16px;">${name}</b><div style="color:#00f2ff; font-size:15px;">Siz ajoyibsiz shunday davom eting!</div>`;
    autoCloseTimer = setTimeout(() => closeRobotMsg(), 8000);
}





// ... (yuqoridagi drag-and-drop kodlari o'zgarishsiz qoladi)

function offerTest(topic) {
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    const robotMsg = document.getElementById("robotMsg");
    const mainText = document.getElementById('mainText');
    robotMsg.style.display = "block";
    mainText.innerHTML = `
        <div style="font-size:15px; margin-bottom:5px;">Mavzu tugadi! 🏁</div>
        <button onclick="openTest('${topic.mavzuRaqam}')" style="background:#22c55e; color:white; border:none; padding:8px; border-radius:10px; cursor:pointer; width:100%; font-weight:bold; font-size:16px;">Faktlarni ko'rish ✨</button>
    `;
}

function openTest(mavzuRaqam) {
    const data = qiziqarliFaktlar[mavzuRaqam] || {
        nomi: "Qiziqarli ma'lumot",
        text: "Ma'lumotlar yuklanmoqda...",
        rasmlar: [
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800"
        ]
    };

    const testBody = document.getElementById('testBody');
    const modalContainer = document.querySelector('.test-card');
    
    // Modal oynasini kengaytirish
    modalContainer.style.maxWidth = "700px"; 
    modalContainer.style.width = "95%";
    document.getElementById('testModal').style.display = "flex";
    
    let html = `
        <h2 style="color:#00f2ff; text-align:center; margin-bottom:20px; font-size:28px; font-weight:bold; text-shadow: 0 0 15px rgba(0,242,255,0.4);">
            ${data.nomi}
        </h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
            <img src="${data.rasmlar[0]}" style="width:100%; height:180px; object-fit:cover; border-radius:15px; border:3px solid #38bdf8; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
            <img src="${data.rasmlar[1]}" style="width:100%; height:180px; object-fit:cover; border-radius:15px; border:3px solid #38bdf8; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
            <img src="${data.rasmlar[2]}" style="width:100%; height:180px; object-fit:cover; border-radius:15px; border:3px solid #38bdf8; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
            <img src="${data.rasmlar[3]}" style="width:100%; height:180px; object-fit:cover; border-radius:15px; border:3px solid #38bdf8; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
        </div>

        <div style="background: linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9)); 
                    padding: 25px; border-radius: 20px; font-size: 19px; color: #f8fafc; 
                    line-height: 1.7; margin-bottom: 25px; border-left: 6px solid #00f2ff;
                    box-shadow: inset 0 0 30px rgba(0,0,0,0.2);">
            ${data.text}
        </div>

        <button onclick="closeTest()" style="background: linear-gradient(to right, #22c55e, #16a34a); 
                    color:white; border:none; padding:18px; border-radius:15px; 
                    cursor:pointer; width:100%; font-weight:bold; font-size:22px; 
                    transition: transform 0.2s; box-shadow: 0 10px 20px rgba(22, 163, 74, 0.3);">
            Tushundim, davom etamiz! 🚀
        </button>
    `;
    
    testBody.innerHTML = html;
}
// closeTest() funksiyasi o'zgarishsiz qoladi
// function offerTest(topic) {
//     if (autoCloseTimer) clearTimeout(autoCloseTimer);
//     const robotMsg = document.getElementById("robotMsg");
//     const mainText = document.getElementById('mainText');
//     robotMsg.style.display = "block";
//     mainText.innerHTML = `
//         <div style="font-size:15px; margin-bottom:5px;">Mavzu tugadi! 🏁 hr O'zingni sinab ko'r</div>
//         <button onclick="openTest(${topic.id})" style="background:#22c55e; color:white; border:none; padding:8px; border-radius:10px; cursor:pointer; width:100%; font-weight:bold; font-size:18px;">Testni boshlash ✍️</button>
//     `;
// }

function closeRobotMsg(e) {
    if(e) e.stopPropagation();
    document.getElementById("robotMsg").style.display = "none";
}

// function openTest(id) {
//     const topicSavollari = savollar[id] || savollar[1];
//     const testBody = document.getElementById('testBody');
//     document.getElementById('testModal').style.display = "flex";
    
//     let html = `<h3 style="color:white; margin-bottom:15px; font-size:16px;">${topicSavollari[0].savol}</h3>`;
//     topicSavollari[0].javoblar.forEach((j, i) => {
//         html += `<button class="test-opt" onclick="this.style.background='#22c55e'; setTimeout(()=>closeTest(), 1000)">${j}</button>`;
//     });
//     testBody.innerHTML = html;
// }

function closeTest() {
    document.getElementById('testModal').style.display = "none";
}