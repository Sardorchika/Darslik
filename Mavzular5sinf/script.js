const pdfUrl = 'pdf/847565159-www-idum-uz-5-sinf-Tabiiy-fanlar-darslik-uzb-2024.pdf';
const MUNDARIJA_BETLARI = 11;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const pdfWrapper = document.getElementById('pdfWrapper');
const topicsList = document.getElementById('topicsList');
const menuToggle = document.getElementById('menuToggle');
const topicsSidebar = document.getElementById('topicsSidebar');
const overlay = document.getElementById('overlay');


const mavzular = [
  { id: 1, mavzuRaqam: "1.1", nomi: "Gul", bet: 8, tugashBet:12 },
  { id: 2, mavzuRaqam: "1.2", nomi: "Gulli o‘simliklarning ko‘payishi", bet: 13, tugashBet:19 },
  { id: 3, mavzuRaqam: "1.3", nomi: "Urug‘larning unib chiqishi", bet: 20, tugashBet:23},
  { id: 4, mavzuRaqam: "2.1", nomi: "Yashash muhitiga moslanish", bet: 26 , tugashBet:33},
  { id: 5, mavzuRaqam: "2.2", nomi: "Gulli o‘simliklarning moslanishlari", bet: 34, tugashBet:37 },
  { id: 6, mavzuRaqam: "2.3", nomi: "Yirtqichlar va ularning o‘ljalaridagi moslanishlar", bet: 38, tugashBet:43 },
  { id: 7, mavzuRaqam: "3.1", nomi: "Qattiq, suyuq va gazsimon moddalarning tuzilishi", bet: 46 , tugashBet:49},
  { id: 8, mavzuRaqam: "3.2", nomi: "Bug'lanish va kondensatsiya", bet: 50 , tugashBet:58},
  { id: 9, mavzuRaqam: "4.1", nomi: "Suvning xossalari", bet: 61, tugashBet:67 },
  { id: 10, mavzuRaqam: "4.2", nomi: "Erituvchi, eruvchi va eritma", bet: 68 , tugashBet:72},
  { id: 11, mavzuRaqam: "5.1", nomi: "Kuchlarning turlari", bet: 75, tugashBet:81 },
  { id: 12, mavzuRaqam: "5.2", nomi: "Kuch chizmalari", bet: 82, tugashBet:86 },
  { id: 13, mavzuRaqam: "6.1", nomi: "Tovushning hosil bo'lishi", bet: 89, tugashBet:91 },
  { id: 14, mavzuRaqam: "6.2", nomi: "Tovushning balandligi va qattiqligi", bet: 92, tugashBet:98 },
  { id: 15, mavzuRaqam: "7.1", nomi: "Magnitlar va magnetik materiallar", bet: 101, tugashBet:104 },
  { id: 16, mavzuRaqam: "7.2", nomi: "Magnit kuchi", bet: 105, tugashBet:110 },
  { id: 17, mavzuRaqam: "8.1", nomi: "Atmosfera", bet: 113 , tugashBet:115},
  { id: 18, mavzuRaqam: "8.2", nomi: "Suvning tabiatda aylanishi", bet: 116, tugashBet:119 },
  { id: 19, mavzuRaqam: "8.3", nomi: "Yer sayyorasidagi suv", bet: 120, tugashBet:123 },
  { id: 20, mavzuRaqam: "9.1", nomi: "Atrof-muhitning ifloslanishi", bet: 126, tugashBet:128 },
  { id: 21, mavzuRaqam: "9.2", nomi: "Ifloslanish turlari", bet: 129, tugashBet:135 },
  { id: 22, mavzuRaqam: "10.1", nomi: "Yerning aylanish orbitasi", bet: 138, tugashBet:143 },
  { id: 23, mavzuRaqam: "10.2", nomi: "Sayyoralarning tabiy va sun'iy yo'ldoshlari", bet: 144 , tugashBet:149},
];



pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
  for (let page = 1; page <= pdf.numPages; page++) {
    renderPage(pdf, page);
  }
});

function renderPage(pdf, pageNumber) {
  pdf.getPage(pageNumber).then(page => {
    const viewportBase = page.getViewport({ scale: 1 });
    let scale = (window.innerWidth < 768) ? (window.innerWidth - 40) / viewportBase.width : 1.4;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width; canvas.height = viewport.height;
    canvas.className = 'pdf-page';
    canvas.dataset.page = pageNumber;
    pdfWrapper.appendChild(canvas);
    if (window.topicObserver) window.topicObserver.observe(canvas);
    page.render({ canvasContext: canvas.getContext('2d'), viewport });
  });
}

mavzular.forEach(mavzu => {
  const div = document.createElement('div');
  div.className = 'topic';
  div.textContent = `${mavzu.mavzuRaqam}. ${mavzu.nomi}`;
  div.onclick = () => {
    const target = document.querySelector(`.pdf-page[data-page='${mavzu.bet + MUNDARIJA_BETLARI}']`);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    if (window.innerWidth < 768) closeMenu();
  };
  topicsList.appendChild(div);
});

function openMenu() { topicsSidebar.classList.add('open'); overlay.classList.add('active'); }
function closeMenu() { topicsSidebar.classList.remove('open'); overlay.classList.remove('active'); }
menuToggle.onclick = () => topicsSidebar.classList.contains('open') ? closeMenu() : openMenu();
overlay.onclick = closeMenu;