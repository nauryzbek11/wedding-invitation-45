const cover = document.getElementById("cover");
const openInvitationBtn = document.getElementById("openInvitationBtn");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bg-music");
const galleryItems = document.querySelectorAll(".gallery-item");
const galleryModal = document.getElementById("galleryModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");
const rsvpForm = document.getElementById("rsvpForm");

const weddingDate = new Date("2026-09-26T18:00:00+05:00");
const dayEls = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  const timerWrap = document.getElementById("timer");

  if (diff <= 0) {
    timerWrap.innerHTML = '<div class="time-box" style="grid-column: 1 / -1;"><span>Сегодня</span><small>наш особенный день!</small></div>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  dayEls.days.textContent = String(days).padStart(2, "0");
  dayEls.hours.textContent = String(hours).padStart(2, "0");
  dayEls.minutes.textContent = String(minutes).padStart(2, "0");
  dayEls.seconds.textContent = String(seconds).padStart(2, "0");
}

function revealInvitation() {
  cover.classList.add("hidden");
  document.getElementById("mainPage").scrollIntoView({ behavior: "smooth", block: "start" });
}

function toggleMusic() {
  if (!bgMusic.paused) {
    bgMusic.pause();
    musicToggle.textContent = "▶ Музыка";
    musicToggle.classList.remove("is-playing");
    return;
  }

  bgMusic.play().catch(() => {
    console.log("Автовоспроизведение заблокировано — будет играть после взаимодействия пользователя.");
  });

  musicToggle.textContent = "❚❚ Музыка";
  musicToggle.classList.add("is-playing");
}

function openGallery(imageSrc) {
  modalImage.src = imageSrc;
  galleryModal.classList.add("active");
  galleryModal.setAttribute("aria-hidden", "false");
}

function closeGallery() {
  galleryModal.classList.remove("active");
  galleryModal.setAttribute("aria-hidden", "true");
}

openInvitationBtn.addEventListener("click", revealInvitation);
musicToggle.addEventListener("click", toggleMusic);

setInterval(updateCountdown, 1000);
updateCountdown();

musicToggle.addEventListener("click", () => {
  if (bgMusic.muted) {
    bgMusic.muted = false;
  }
});

galleryItems.forEach((item) => {
  item.addEventListener("click", () => openGallery(item.dataset.full));
});

modalClose.addEventListener("click", closeGallery);
galleryModal.addEventListener("click", (event) => {
  if (event.target === galleryModal) closeGallery();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeGallery();
});

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const payload = {
    guestName: formData.get("guestName"),
    attendance: formData.get("attendance"),
    guestCount: formData.get("guestCount"),
    submittedAt: new Date().toISOString(),
  };

  const saved = JSON.parse(localStorage.getItem("weddingRsvp") || "[]");
  saved.push(payload);
  localStorage.setItem("weddingRsvp", JSON.stringify(saved));

  const submitButton = rsvpForm.querySelector(".submit-button");
  submitButton.textContent = "Подтверждено";
  submitButton.disabled = true;
  submitButton.style.opacity = "0.8";
});
