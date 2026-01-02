const pdfUrl = 'pdf/6-sinf.pdf';
const MUNDARIJA_BETLARI = 0;

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const pdfWrapper = document.getElementById('pdfWrapper');
const topicsList = document.getElementById('topicsList');

/* ===== MAVZULAR ===== */
const mavzular = [
  { id: 1, mavzuRaqam: "1", nomi: "TABIATNI O'RGANISH", bet: 6, tugashBet: 14 },
  { id: 2, mavzuRaqam: "2", nomi: "MODDA VA UNING XOSSALARI", bet: 15, tugashBet: 36 },
  { id: 3, mavzuRaqam: "3", nomi: "TIRIK ORGANIZMLARNING XILMAXILLIGI", bet: 37, tugashBet: 46 },
  { id: 4, mavzuRaqam: "4", nomi: "TIRIK ORGANIZMLARNING TUZILISHI", bet: 47, tugashBet: 66 },
  { id: 5, mavzuRaqam: "5", nomi: "EKOLOGIYA VA BARQAROR RIVOJLANISH", bet: 67, tugashBet: 79 },
  { id: 6, mavzuRaqam: "6", nomi: "QUYOSH SISTEMASI VA KOINOT", bet: 80, tugashBet: 90 },
  { id: 7, mavzuRaqam: "7", nomi: "GEOGRAFIK XARITALAR", bet: 91, tugashBet: 103 },
  { id: 8, mavzuRaqam: "8", nomi: "YER QOBIQLARI", bet: 104, tugashBet: 120 },
  { id: 9, mavzuRaqam: "9", nomi: "MENING VATANIM", bet: 121, tugashBet: 131 },
  { id: 10, mavzuRaqam: "10", nomi: "HARAKAT VA KUCH", bet: 132, tugashBet: 156 },
  { id: 11, mavzuRaqam: "11", nomi: "ENERGIYA", bet: 157, tugashBet: 175 },
  { id: 12, mavzuRaqam: "12", nomi: "ELEKTR VA MAGNIT HODISALAR", bet: 176, tugashBet: 190 },
];

/* ===== PDF YUKLASH ===== */
pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
  for (let page = 1; page <= pdf.numPages; page++) {
    renderPage(pdf, page);
  }
});

function renderPage(pdf, pageNumber) {
  pdf.getPage(pageNumber).then(page => {
    const viewportBase = page.getViewport({ scale: 1 });
    const scale = window.innerWidth < 768
      ? (window.innerWidth - 40) / viewportBase.width
      : 1.4;

    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.className = 'pdf-page';
    canvas.dataset.page = pageNumber;

    pdfWrapper.appendChild(canvas);
    page.render({ canvasContext: canvas.getContext('2d'), viewport });
  });
}

/* ===== MUNDARIJA ===== */
mavzular.forEach(mavzu => {
  const div = document.createElement('div');
  div.className = 'topic';
  div.textContent = `${mavzu.mavzuRaqam}. ${mavzu.nomi}`;
  div.onclick = () => {
    const target = document.querySelector(
      `.pdf-page[data-page='${mavzu.bet}']`
    );
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };
  topicsList.appendChild(div);
});

/* ===== MOBIL MENYU ===== */
const menuToggle = document.getElementById("menuToggle");
const topicsSidebar = document.getElementById("topicsSidebar");
const overlay = document.getElementById("overlay");

if (menuToggle) {
  menuToggle.onclick = () => {
    topicsSidebar.classList.add("open");
    overlay.classList.add("active");
  };

  overlay.onclick = () => {
    topicsSidebar.classList.remove("open");
    overlay.classList.remove("active");
  };
}
