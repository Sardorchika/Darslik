/* ==========================================
   1. FAKTLAR BAZASI (Ismiga e'tibor bering!)
   ========================================== */
// Agar faktlar.js faylida nomi boshqacha bo'lsa, bu yerda ham to'g'rilang
const faktlarBazasi = qiziqarliFaktlar6; 

let isRobotReady = false;
let lastDetectedTopic = null;
let lastDetectedEnd = null;
let autoCloseTimer = null;
let lastPageNum = 0;

/* ==========================================
   2. DRAG AND DROP (Silliq surish)
   ========================================== */
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
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    currentX = clientX - startX;
    currentY = clientY - startY;
    robotMascot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
};

const dragEnd = () => { isDragging = false; robotDraggable.style.cursor = 'grab'; };

robotDraggable.addEventListener('mousedown', dragStart);
robotDraggable.addEventListener('touchstart', dragStart, { passive: false });
document.addEventListener('mousemove', dragMove);
document.addEventListener('touchmove', dragMove, { passive: false });
document.addEventListener('mouseup', dragEnd);
document.addEventListener('touchend', dragEnd);

//* ==========================================   3. SKROLL VA MAVZULAR LOGIKASI (YANGILANGAN)   ========================================== */
document.getElementById('pdfWrapper').addEventListener('scroll', () => {
    if (!isRobotReady) return;

    const pages = document.querySelectorAll('.pdf-page');
    let currentPage = 1;

    // Hozirgi sahifani aniqlash
    pages.forEach(page => {
        const rect = page.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            currentPage = parseInt(page.dataset.page);
        }
    });

    if (typeof mavzular !== 'undefined') {
        const currentTopic = mavzular.find(m => m.bet === currentPage);
        const endingTopic = mavzular.find(m => m.tugashBet === currentPage);

        // 1. Yangi bob boshlanganda (Tabriklash)
        if (currentTopic && lastDetectedTopic !== currentTopic.id) {
            lastDetectedTopic = currentTopic.id;
            congratulateTopic(currentTopic.nomi);
        } 
        
        // 2. Mavzu tugash sahifasidami? (Faktlar tugmasi)
        else if (endingTopic) {
            // Agar aynan shu sahifada bo'lsa, tugmani ko'rsatish
            offerTest(endingTopic);
        } 
        
        // 3. Agar boshqa sahifaga o'tib ketsa, xabarni yashirish
        else {
            // Faqat robot biror narsa deb turgan bo'lsa yopamiz
            // Lekin tabriklash xabari (6 soniya) o'z holicha qolgani ma'qul
            if (!currentTopic) {
                closeRobotMsg();
            }
        }
    }
});
/* ==========================================
   4. ROBOT FUNKSIYALARI
   ========================================== */
function startLesson() {
    isRobotReady = true;
    const leftArm = document.getElementById('leftArm');
    const welcomeZone = document.getElementById('welcomeZone');
    const mainText = document.getElementById('mainText');

    leftArm.classList.add('is-raised');
    welcomeZone.style.display = "none";
    mainText.style.display = "block";
    mainText.innerHTML = "<b>Ajoyib!</b> Birgalikda yangi bilimlarni egallaymiz! 🚀";
    
    setTimeout(() => {
        leftArm.classList.remove('is-raised');
        closeRobotMsg();
    }, 3000);
}

function congratulateTopic(name) {
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    const robotMsg = document.getElementById("robotMsg");
    const mainText = document.getElementById('mainText');
    robotMsg.style.display = "block";
    mainText.innerHTML = `
        <div style="color:#00f2ff; font-size:14px; text-transform:uppercase;">Yangi bob:</div>
        <b style="font-size:16px; color:#fff;">${name}</b>
        <div style="color:#00f2ff; font-size:13px; margin-top:5px;">Siz ajoyibsiz, davom eting! ✨</div>
    `;
    autoCloseTimer = setTimeout(() => closeRobotMsg(), 6000);
}

function offerTest(topic) {
    const robotMsg = document.getElementById("robotMsg");
    const mainText = document.getElementById('mainText');
    robotMsg.style.display = "block";
    mainText.innerHTML = `
        <div style="font-size:15px; margin-bottom:8px; color:#fff;">Mavzu yakunlandi! 🏁</div>
        <button onclick="openTest(${topic.id})" 
                style="background:#22c55e; color:white; border:none; padding:10px; border-radius:10px; cursor:pointer; width:100%; font-weight:bold;">
                Faktlarni ko'rish 💡
        </button>
    `;
}


function openTest(topicId) {

    const data = faktlarBazasi[topicId];

    if (!data) return;



    const testBody = document.getElementById('testBody');

    document.getElementById('testModal').style.display = "flex";



    let html = `

        <h2 style="color:#00f2ff; text-align:center; margin-bottom:25px; font-size:35px; text-transform:uppercase; letter-spacing:2px; text-shadow: 0 0 20px rgba(0,242,255,0.5);">

            ${data.nomi}

        </h2>



        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">

            <img src="${data.rasmlar[0]}" style="width:100%; height:250px; object-fit:cover; border-radius:20px; border:3px solid #00f2ff; transition: 0.3s ease;">

            <img src="${data.rasmlar[1]}" style="width:100%; height:250px; object-fit:cover; border-radius:20px; border:3px solid #00f2ff; transition: 0.3s ease;">

            <img src="${data.rasmlar[2]}" style="width:100%; height:250px; object-fit:cover; border-radius:20px; border:3px solid #00f2ff; transition: 0.3s ease;">

            <img src="${data.rasmlar[3]}" style="width:100%; height:250px; object-fit:cover; border-radius:20px; border:3px solid #00f2ff; transition: 0.3s ease;">

        </div>



        <div style="background: rgba(255, 255, 255, 0.07);

                    padding: 30px;

                    border-radius: 20px;

                    font-size: 22px;

                    color: #e2e8f0;

                    line-height: 1.8;

                    border-left: 8px solid #00f2ff;

                    box-shadow: inset 0 0 20px rgba(0,0,0,0.3);

                    margin-bottom: 30px;">

            ${data.text}

        </div>



        <button onclick="closeTest()" style="

            background: linear-gradient(90deg, #00f2ff, #0072ff);

            color: white;

            border: none;

            padding: 20px 40px;

            border-radius: 15px;

            cursor: pointer;

            width: 100%;

            font-weight: bold;

            font-size: 24px;

            box-shadow: 0 10px 25px rgba(0, 114, 255, 0.4);

            transition: transform 0.2s;">

            Tushundim, davom etamiz! 🚀

        </button>

    `;

    testBody.innerHTML = html;

}

// Chest-plate tugmasi uchun (Robotni bossa ham fakt chiqishi uchun)
function showCurrentFact() {
    if (!isRobotReady) return;
    const tId = lastDetectedTopic || 1;
    openTest(tId);
}

function closeRobotMsg() {
    document.getElementById("robotMsg").style.display = "none";
}

function closeTest() {
    document.getElementById('testModal').style.display = "none";
}