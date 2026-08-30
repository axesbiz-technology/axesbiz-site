/* ==========================================================================
   AxesBiz — Contact Form Script
   Validates fields, submits via fetch() to Formspree without a page reload,
   and shows loading / success / error states.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('contactSubmitBtn');
  const statusBox = document.getElementById('formStatus');

  const fields = {
    name: { el: document.getElementById('cf-name'), group: document.getElementById('cf-name-group'), msg: 'Please enter your full name.' },
    email: { el: document.getElementById('cf-email'), group: document.getElementById('cf-email-group'), msg: 'Please enter a valid email address.' },
    phone: { el: document.getElementById('cf-phone'), group: document.getElementById('cf-phone-group'), msg: 'Please enter a valid phone number.' },
    subject: { el: document.getElementById('cf-subject'), group: document.getElementById('cf-subject-group'), msg: 'Please enter a subject.' },
    message: { el: document.getElementById('cf-message'), group: document.getElementById('cf-message-group'), msg: 'Please enter your message.' }
  };

  function validateField(key) {
    const field = fields[key];
    const value = field.el.value.trim();
    let valid = true;

    if (key === 'email') {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (key === 'phone') {
      valid = /^[0-9+\-\s()]{7,15}$/.test(value);
    } else {
      valid = value.length > 1;
    }

    field.group.classList.toggle('invalid', !valid);
    return valid;
  }

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let allValid = true;
    Object.keys(fields).forEach(key => {
      if (!validateField(key)) allValid = false;
    });

    if (!allValid) {
      showStatus('error', 'Please fix the highlighted fields and try again.');
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    hideStatus();

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(response => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        if (response.ok) {
          showStatus('success', 'Message sent successfully! Our team will get back to you within 24 hours.');
          form.reset();
        } else {
          response.json().then(data => {
            const errMsg = (data && data.errors) ? data.errors.map(er => er.message).join(', ') : 'Something went wrong. Please try again.';
            showStatus('error', errMsg);
          }).catch(() => {
            showStatus('error', 'Something went wrong. Please try again later.');
          });
        }
      })
      .catch(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        showStatus('error', 'Network error — please check your connection and try again.');
      });
  });

  function showStatus(type, message) {
    if (!statusBox) return;
    statusBox.className = 'form-status ' + type;
    statusBox.innerHTML = (type === 'success'
      ? '<i class="fa-solid fa-circle-check"></i>'
      : '<i class="fa-solid fa-triangle-exclamation"></i>') + '<span>' + message + '</span>';
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideStatus() {
    if (!statusBox) return;
    statusBox.className = 'form-status';
    statusBox.innerHTML = '';
  }

});
