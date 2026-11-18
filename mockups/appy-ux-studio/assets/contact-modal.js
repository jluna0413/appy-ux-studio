// Contact Modal — Appy-UX Studio
// Replaces mailto: links with a modern inquiry form

(function() {
  'use strict';

  const API = (window.CONTACT_API_BASE || (window.location.origin + '/api'));

  let modalEl = null;
  let currentPackage = null;
  let currentService = null;

  function createModal() {
    if (modalEl) return modalEl;

    const overlay = document.createElement('div');
    overlay.className = 'contact-modal-overlay';
    overlay.id = 'contactModalOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'cmTitle');
    overlay.innerHTML = `
      <div class="contact-modal">
        <button class="cm-close" id="cmClose" aria-label="Close dialog">&times;</button>
        <h2 id="cmTitle">Start Your Project</h2>
        <p class="cm-subtitle">Tell us what you need and we'll get back to you within 24 hours.</p>
        <div id="cmPackageInfo" style="display:none;" class="cm-package">
          <div class="label">Interested in</div>
          <div id="cmPackageName"></div>
        </div>
        <div id="cmForm">
          <div class="cm-field">
            <label class="cm-label" for="cmName">Your Name</label>
            <input class="cm-input" id="cmName" type="text" placeholder="John Doe" required />
          </div>
          <div class="cm-field">
            <label class="cm-label" for="cmEmail">Email</label>
            <input class="cm-input" id="cmEmail" type="email" placeholder="john@example.com" required />
          </div>
          <div class="cm-field">
            <label class="cm-label" for="cmService">Service</label>
            <select class="cm-select" id="cmService">
              <option value="Image">Image Services</option>
              <option value="Video">Video Services</option>
              <option value="Music">Music & Sound</option>
              <option value="Games">Game Assets</option>
              <option value="Shop">Shop / Pre-made Assets</option>
              <option value="Custom">Custom Project</option>
            </select>
          </div>
          <div class="cm-field">
            <label class="cm-label" for="cmMessage">Message (optional)</label>
            <textarea class="cm-textarea" id="cmMessage" placeholder="Tell us about your project, timeline, and any reference links..."></textarea>
          </div>
          <div id="cmError" class="cm-error" style="display:none;"></div>
          <button class="cm-submit" id="cmSubmit">Send Inquiry</button>
        </div>
        <div id="cmSuccess" class="cm-success" style="display:none;">
          <div class="check">✅</div>
          <h3>Inquiry Sent!</h3>
          <p>We'll get back to you within 24 hours. Check your email for a confirmation.</p>
          <button class="cm-submit" id="cmDone" style="margin-top:16px;">Done</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    modalEl = overlay;

    // Event listeners
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    document.getElementById('cmClose').addEventListener('click', closeModal);
    document.getElementById('cmSubmit').addEventListener('click', submitInquiry);
    document.getElementById('cmDone').addEventListener('click', closeModal);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });

    return modalEl;
  }

  function openModal(service, packageName) {
    createModal();
    currentService = service || null;
    currentPackage = packageName || null;

    const overlay = document.getElementById('contactModalOverlay');
    const packageInfo = document.getElementById('cmPackageInfo');
    const packageNameEl = document.getElementById('cmPackageName');
    const serviceSelect = document.getElementById('cmService');

    if (currentPackage) {
      packageInfo.style.display = 'block';
      packageNameEl.textContent = currentPackage;
    } else {
      packageInfo.style.display = 'none';
    }

    if (currentService) {
      // Map service to select value
      const serviceMap = {
        'Image': 'Image', 'Video': 'Video', 'Music': 'Music',
        'Games': 'Games', 'Shop': 'Shop', 'Custom': 'Custom',
      };
      serviceSelect.value = serviceMap[currentService] || 'Custom';
    }

    // Reset form
    document.getElementById('cmForm').style.display = 'block';
    document.getElementById('cmSuccess').style.display = 'none';
    document.getElementById('cmError').style.display = 'none';
    document.getElementById('cmName').value = '';
    document.getElementById('cmEmail').value = '';
    document.getElementById('cmMessage').value = '';

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = document.getElementById('contactModalOverlay');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  async function submitInquiry() {
    const name = document.getElementById('cmName').value.trim();
    const email = document.getElementById('cmEmail').value.trim();
    const service = document.getElementById('cmService').value;
    const message = document.getElementById('cmMessage').value.trim();
    const errorEl = document.getElementById('cmError');
    const submitBtn = document.getElementById('cmSubmit');

    if (!name || !email) {
      errorEl.textContent = 'Please fill in your name and email.';
      errorEl.style.display = 'block';
      return;
    }

    if (!email.includes('@')) {
      errorEl.textContent = 'Please enter a valid email address.';
      errorEl.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    errorEl.style.display = 'none';

    try {
      const res = await fetch(`${API}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          service,
          message,
          package: currentPackage,
        }),
      });

      if (res.ok) {
        document.getElementById('cmForm').style.display = 'none';
        document.getElementById('cmSuccess').style.display = 'block';
      } else {
        const data = await res.json();
        errorEl.textContent = data.detail || 'Something went wrong. Please try again.';
        errorEl.style.display = 'block';
      }
    } catch (e) {
      errorEl.textContent = 'Network error. Please try again.';
      errorEl.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Inquiry';
    }
  }

  // Initialize: replace mailto links with modal triggers
  function init() {
    createModal();

    // Find all elements with data-inquiry attribute
    document.querySelectorAll('[data-inquiry]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const service = el.dataset.inquiryService || null;
        const packageName = el.dataset.inquiry || null;
        openModal(service, packageName);
      });
      // Keep href for keyboard accessibility, add role for screen readers
      if (el.tagName === 'A' && el.href && el.href.startsWith('mailto:')) {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.style.cursor = 'pointer';
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const service = el.dataset.inquiryService || null;
            const packageName = el.dataset.inquiry || null;
            openModal(service, packageName);
          }
        });
      }
    });

    // Also intercept remaining mailto links
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // Extract service/package from href
        const subject = decodeURIComponent(link.href.split('subject=')[1] || '');
        const service = subject.split(' - ')[0] || subject.split(' ')[0] || 'Custom';
        const packageName = subject.includes(' - ') ? subject.split(' - ')[1] : null;
        openModal(service, packageName);
      });
      // Add keyboard support
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const subject = decodeURIComponent(link.href.split('subject=')[1] || '');
          const service = subject.split(' - ')[0] || subject.split(' ')[0] || 'Custom';
          const packageName = subject.includes(' - ') ? subject.split(' - ')[1] : null;
          openModal(service, packageName);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for manual use
  window.AppyUXContact = { openModal, closeModal };
})();
