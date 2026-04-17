const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = `${idx * 60}ms`;
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

reveals.forEach((item) => revealObserver.observe(item));

const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitButton = document.getElementById('contactSubmit');
const galleryImages = document.querySelectorAll('.gallery-image');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

const openLightbox = (sourceImage) => {
  lightboxImage.src = sourceImage.src;
  lightboxImage.alt = sourceImage.alt;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  lightboxImage.alt = '';
  document.body.style.overflow = '';
};

galleryImages.forEach((img) => {
  img.addEventListener('click', () => openLightbox(img));
});

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});

const setFormStatus = (type, message) => {
  formStatus.className = '';
  if (type) {
    formStatus.classList.add(type);
  }
  formStatus.textContent = message;
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    setFormStatus('error', 'Please complete all required fields before sending.');
    form.reportValidity();
    return;
  }

  const honeypot = form.querySelector('input[name="botcheck"]');
  if (honeypot && honeypot.checked) {
    setFormStatus('error', 'Submission blocked.');
    return;
  }

  submitButton.disabled = true;
  setFormStatus('loading', 'Sending your request...');

  try {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      headers: {
        Accept: 'application/json'
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      const errorMessage = data.message || 'Something went wrong. Please try again.';
      throw new Error(errorMessage);
    }

    setFormStatus('success', 'Thanks. Your request was sent successfully.');
    form.reset();
  } catch (error) {
    setFormStatus('error', error.message || 'Unable to send right now. Please try again.');
  } finally {
    submitButton.disabled = false;
  }
});
