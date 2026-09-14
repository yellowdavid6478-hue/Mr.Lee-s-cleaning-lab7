/* ============================================================
   JS 1) 헤더 스크롤 상태 토글
============================================================ */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

/* ============================================================
   JS 2) 모바일 햄버거 메뉴 토글
============================================================ */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  menuBtn.setAttribute('aria-expanded', String(!isOpen));
  menuBtn.classList.toggle('is-active', !isOpen);
});
// 메뉴 항목 클릭 시 자동으로 닫기
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));

/* ============================================================
   JS 3) 스크롤 리빌 애니메이션 (IntersectionObserver)
============================================================ */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* ============================================================
   JS 4) 서비스 탭 전환
============================================================ */
const tabs = document.querySelectorAll('.service-tab');
const panels = document.querySelectorAll('.service-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
    tab.setAttribute('aria-selected', 'true');
    const target = tab.dataset.tab;
    panels.forEach(p => p.classList.toggle('active', p.id === `panel-${target}`));
  });
});

/* ============================================================
   JS 5) 비포&애프터 드래그 슬라이더 (시그니처 인터랙션)
============================================================ */
const baSlider = document.getElementById('baSlider');
const baAfterWrap = document.getElementById('baAfterWrap');
const baHandle = document.getElementById('baHandle');

function setSliderPosition(clientX) {
  const rect = baSlider.getBoundingClientRect();
  let ratio = (clientX - rect.left) / rect.width;
  ratio = Math.min(1, Math.max(0, ratio));
  baAfterWrap.style.width = `${ratio * 100}%`;
  baHandle.style.left = `${ratio * 100}%`;
}

let isDragging = false;
baSlider.addEventListener('pointerdown', (e) => { isDragging = true; setSliderPosition(e.clientX); });
window.addEventListener('pointermove', (e) => { if (isDragging) setSliderPosition(e.clientX); });
window.addEventListener('pointerup', () => { isDragging = false; });
// 키보드 접근성: 슬라이더에 포커스 후 좌우 화살표로도 조작 가능하게
baHandle.setAttribute('tabindex', '0');
baHandle.setAttribute('role', 'slider');
baHandle.setAttribute('aria-label', '청소 전후 비교 슬라이더');
baHandle.addEventListener('keydown', (e) => {
  const rect = baSlider.getBoundingClientRect();
  const currentRatio = parseFloat(baHandle.style.left) / 100;
  if (e.key === 'ArrowLeft') setSliderPosition(rect.left + rect.width * Math.max(0, currentRatio - 0.05));
  if (e.key === 'ArrowRight') setSliderPosition(rect.left + rect.width * Math.min(1, currentRatio + 0.05));
});

/* ============================================================
   JS 6) 고객 후기 캐러셀
============================================================ */
const reviewTrack = document.getElementById('reviewTrack');
const reviewPrev = document.getElementById('reviewPrev');
const reviewNext = document.getElementById('reviewNext');
let reviewIndex = 0;

function getCardsPerView() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function updateReviewTrack() {
  const totalCards = reviewTrack.children.length;
  const maxIndex = Math.max(0, totalCards - getCardsPerView());
  reviewIndex = Math.min(reviewIndex, maxIndex);
  const cardWidth = reviewTrack.children[0].getBoundingClientRect().width + 20; // gap 포함
  reviewTrack.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;
}

reviewNext.addEventListener('click', () => {
  const totalCards = reviewTrack.children.length;
  const maxIndex = Math.max(0, totalCards - getCardsPerView());
  reviewIndex = Math.min(reviewIndex + 1, maxIndex);
  updateReviewTrack();
});
reviewPrev.addEventListener('click', () => {
  reviewIndex = Math.max(reviewIndex - 1, 0);
  updateReviewTrack();
});
window.addEventListener('resize', updateReviewTrack);

/* ============================================================
   JS 7) 견적 신청 폼 제출 처리 (프론트엔드 검증 + 성공 메시지)
   ※ 실제 서버 연동 시 fetch()로 백엔드 API 호출부 교체 필요
============================================================ */
const estimateForm = document.getElementById('estimateForm');
const formSuccess = document.getElementById('formSuccess');
estimateForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!estimateForm.checkValidity()) {
    estimateForm.reportValidity();
    return;
  }
  // TODO: 실제 서비스 연동 시 이 위치에서 서버로 데이터 전송
  formSuccess.classList.remove('hidden');
  estimateForm.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.type === 'checkbox') { el.checked = false; } else { el.value = ''; }
  });
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
