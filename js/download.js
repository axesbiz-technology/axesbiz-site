/* ==========================================================================
   AxesBiz — Download Page Script
   Handles: animated Android download trigger, Windows "Coming Soon" modal,
   and the inline Notify Me form.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Android download button ---------- */
  const androidBtn = document.getElementById('androidDownloadBtn');
  const androidSuccess = document.getElementById('androidSuccess');

  if (androidBtn) {
    androidBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (androidBtn.classList.contains('loading')) return;

      androidBtn.classList.add('loading');
      if (androidSuccess) androidSuccess.classList.remove('show');

      // Simulate a short preparation delay, then trigger the actual file download
      setTimeout(function () {
        androidBtn.classList.remove('loading');

        // Programmatically trigger the download using the hidden anchor
        const link = document.createElement('a');
        link.href = 'assets/AxesBiz.apk';
        link.download = 'AxesBiz.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (androidSuccess) {
          androidSuccess.classList.add('show');
          setTimeout(() => androidSuccess.classList.remove('show'), 5000);
        }
      }, 1600);
    });
  }

  /* ---------- Windows "Coming Soon" modal ---------- */
  const windowsBtn = document.getElementById('windowsDownloadBtn');
  const modalOverlay = document.getElementById('comingSoonModal');
  const modalClose = document.getElementById('modalCloseBtn');

  function openModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  if (windowsBtn) windowsBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openModal();
  });
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Notify Me form (inside modal) ---------- */
  const notifyForm = document.getElementById('notifyForm');
  const notifyThanks = document.getElementById('notifyThanks');

  if (notifyForm) {
    notifyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = document.getElementById('notifyEmail');
      const email = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        emailInput.style.borderColor = 'var(--danger)';
        emailInput.focus();
        return;
      }

      emailInput.style.borderColor = '';
      notifyForm.style.display = 'none';
      if (notifyThanks) notifyThanks.classList.add('show');
      emailInput.value = '';
    });
  }

});
