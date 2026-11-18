/* Appy-UX Studio — Slide-to-Revive Slider */
(function() {
  'use strict';

  function initSliders() {
    document.querySelectorAll('.revive-slider').forEach(function(slider) {
      if (slider._initialized) return;
      slider._initialized = true;

      var container = slider.querySelector('.slider-container');
      var before = slider.querySelector('.slider-before');
      var handle = slider.querySelector('.slider-handle');
      var isDragging = false;
      var rafId = null;

      function updatePosition(x) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function() {
          var rect = container.getBoundingClientRect();
          var pos = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
          var pct = pos * 100;
          before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
          handle.style.left = pct + '%';
          container.setAttribute('aria-valuenow', Math.round(pct));

          // Reset any transforms (true before/after comparison)
          var afterImg = slider.querySelector('.slider-after img');
          if (afterImg) {
            afterImg.style.transform = '';
          }
        });
      }

      function startDrag(e) {
        isDragging = true;
        slider.classList.add('dragging');
        var x = e.touches ? e.touches[0].clientX : e.clientX;
        updatePosition(x);
      }

      function onDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        var x = e.touches ? e.touches[0].clientX : e.clientX;
        updatePosition(x);
      }

      function endDrag() {
        isDragging = false;
        slider.classList.remove('dragging');
      }

      container.addEventListener('mousedown', startDrag);
      container.addEventListener('touchstart', startDrag, { passive: true });
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('touchmove', onDrag, { passive: false });
      window.addEventListener('mouseup', endDrag);
      window.addEventListener('touchend', endDrag);

      // ARIA accessibility
      container.setAttribute('role', 'slider');
      container.setAttribute('aria-valuemin', '0');
      container.setAttribute('aria-valuemax', '100');
      container.setAttribute('aria-valuenow', '50');
      container.setAttribute('aria-label', 'Before and after comparison slider');
      container.setAttribute('tabindex', '0');
      container.addEventListener('keydown', function(e) {
        var rect = container.getBoundingClientRect();
        var currentPct = parseFloat(container.getAttribute('aria-valuenow')) || 50;
        var currentPos = currentPct / 100;
        if (e.key === 'ArrowLeft') { currentPos = Math.max(0, currentPos - 0.05); e.preventDefault(); }
        else if (e.key === 'ArrowRight') { currentPos = Math.min(1, currentPos + 0.05); e.preventDefault(); }
        else if (e.key === 'Home') { currentPos = 0; e.preventDefault(); }
        else if (e.key === 'End') { currentPos = 1; e.preventDefault(); }
        else return;
        updatePosition(currentPos * rect.width + rect.left);
      });

      // Initial position at 50%
      updatePosition(container.getBoundingClientRect().left + container.getBoundingClientRect().width * 0.5);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSliders);
  } else {
    initSliders();
  }
})();
