/* ── Testimonials infinite carousel ── */
(function () {
  const track = document.getElementById('testimonials-track');
  if (!track) return;

  const prevBtn = document.getElementById('t-prev');
  const nextBtn = document.getElementById('t-next');
  const dotsWrap = document.getElementById('t-dots');

  const origCards = Array.from(track.children);
  const total = origCards.length;

  // Clone all cards and append so the loop feels seamless
  origCards.forEach(card => track.appendChild(card.cloneNode(true)));

  let idx = 0;
  let busy = false;

  function cardStep() {
    const allCards = track.children;
    if (allCards.length < 2) return 0;
    // Distance from card[0] left edge to card[1] left edge = card width + gap
    return allCards[1].getBoundingClientRect().left - allCards[0].getBoundingClientRect().left;
  }

  function moveTo(i, animate) {
    track.style.transition = animate ? 'transform 0.42s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none';
    track.style.transform = `translateX(${-i * cardStep()}px)`;
    idx = i;
    updateDots();
  }

  function next() {
    if (busy) return;
    busy = true;
    const ni = idx + 1;
    moveTo(ni, true);
    if (ni >= total) {
      setTimeout(() => { moveTo(ni - total, false); busy = false; }, 430);
    } else {
      setTimeout(() => { busy = false; }, 430);
    }
  }

  function prev() {
    if (busy) return;
    busy = true;
    if (idx === 0) {
      moveTo(total, false);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        moveTo(total - 1, true);
        setTimeout(() => { busy = false; }, 430);
      }));
    } else {
      moveTo(idx - 1, true);
      setTimeout(() => { busy = false; }, 430);
    }
  }

  // Dots (one per original card)
  if (dotsWrap) {
    origCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Ir para testemunho ${i + 1}`);
      dot.addEventListener('click', () => { if (!busy) { busy = true; moveTo(i, true); setTimeout(() => { busy = false; }, 430); } });
      dotsWrap.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsWrap) return;
    const dots = dotsWrap.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === idx % total));
  }

  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);

  // Auto-advance every 3.5 s; pause on hover
  let timer = setInterval(next, 3500);
  const carousel = track.closest('.testimonials-carousel');
  carousel?.addEventListener('mouseenter', () => clearInterval(timer));
  carousel?.addEventListener('mouseleave', () => { timer = setInterval(next, 3500); });

  // Recalculate on resize without animation
  window.addEventListener('resize', () => moveTo(idx, false));

  updateDots();
})();

const portugalCitiesList = document.getElementById("portugal-cities");
const portugalToggle = document.getElementById("portugal-toggle");

if (portugalToggle && portugalCitiesList) {
  portugalCitiesList.style.display = "none";

  portugalToggle.addEventListener("click", () => {
    const expanded = portugalToggle.getAttribute("aria-expanded") === "true";
    portugalToggle.setAttribute("aria-expanded", String(!expanded));
    portugalCitiesList.style.display = expanded ? "none" : "flex";
  });
}
