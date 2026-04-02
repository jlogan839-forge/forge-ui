/* Forge UI — MIT License — https://github.com/jlogan839-forge/forge-ui */

/**
 * Universal UI Kit — Core JavaScript
 * Version: 1.0.0
 * Backend-agnostic | WCAG 2.1 AA | Keyboard navigable | Screen reader ready
 *
 * Usage:
 *   <script src="ui-kit.js"></script>
 *   or: import UIKit from './ui-kit.js';
 *
 * All behaviors auto-initialize on DOMContentLoaded.
 * You can also call UIKit.init() manually after dynamic DOM changes.
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();            // CommonJS / Node
  } else if (typeof define === 'function' && define.amd) {
    define(factory);                       // AMD
  } else {
    root.UIKit = factory();                // Browser global
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /* ─────────────────────────────────────────
     UTILITIES
     ───────────────────────────────────────── */

  /** Generate a unique ID string */
  function uid(prefix) {
    return (prefix || 'ui') + '-' + Math.random().toString(36).slice(2, 9);
  }

  /** Get all focusable elements within a container */
  function getFocusable(container) {
    return Array.from(container.querySelectorAll(
      'a[href], button:not(:disabled), input:not(:disabled), ' +
      'select:not(:disabled), textarea:not(:disabled), ' +
      '[tabindex]:not([tabindex="-1"]), details > summary'
    )).filter(el => !el.closest('[hidden]') && !el.closest('[aria-hidden="true"]'));
  }

  /** Trap Tab/Shift-Tab focus within a container */
  function trapFocus(container, e) {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable(container);
    if (!focusable.length) { e.preventDefault(); return; }
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  /* ─────────────────────────────────────────
     BUTTON — loading state helpers
     ───────────────────────────────────────── */

  const Button = {
    /**
     * Put a button into loading state.
     * @param {HTMLButtonElement} btn
     * @param {string} [label] - accessible label while loading (default: "Loading")
     */
    startLoading(btn, label) {
      btn.classList.add('ui-btn-loading');
      btn.setAttribute('aria-busy', 'true');
      btn.setAttribute('aria-label', label || 'Loading');
      btn.disabled = true;
    },

    /**
     * Remove loading state from a button.
     * @param {HTMLButtonElement} btn
     * @param {string} [label] - restore original aria-label
     */
    stopLoading(btn, label) {
      btn.classList.remove('ui-btn-loading');
      btn.removeAttribute('aria-busy');
      if (label) btn.setAttribute('aria-label', label);
      else btn.removeAttribute('aria-label');
      btn.disabled = false;
    }
  };

  /* ─────────────────────────────────────────
     INPUT — validation helpers
     ───────────────────────────────────────── */

  const Input = {
    /**
     * Mark an input as invalid and show an error message.
     * @param {HTMLInputElement} input
     * @param {string} message
     */
    setError(input, message) {
      input.classList.add('ui-input-error');
      input.setAttribute('aria-invalid', 'true');

      let errEl = document.getElementById(input.getAttribute('aria-describedby'));
      if (!errEl || !errEl.classList.contains('ui-error-msg')) {
        errEl = document.createElement('span');
        errEl.id = uid('ui-err');
        errEl.className = 'ui-error-msg visible';
        errEl.setAttribute('role', 'alert');
        errEl.setAttribute('aria-live', 'polite');
        input.parentNode.appendChild(errEl);
        input.setAttribute('aria-describedby',
          [input.getAttribute('aria-describedby'), errEl.id].filter(Boolean).join(' '));
      }
      errEl.textContent = message;
      errEl.classList.add('visible');
    },

    /** Clear error state from an input */
    clearError(input) {
      input.classList.remove('ui-input-error');
      input.removeAttribute('aria-invalid');
      const errId = (input.getAttribute('aria-describedby') || '')
        .split(' ')
        .find(id => {
          const el = document.getElementById(id);
          return el && el.classList.contains('ui-error-msg');
        });
      if (errId) {
        const errEl = document.getElementById(errId);
        if (errEl) errEl.classList.remove('visible');
      }
    },

    /**
     * Wire a character counter to a textarea or input.
     * @param {HTMLElement} input
     * @param {HTMLElement} counterEl
     * @param {number} max
     */
    charCounter(input, counterEl, max) {
      function update() {
        const len = input.value.length;
        counterEl.textContent = len + ' / ' + max + ' characters';
        counterEl.style.color = len > max ? 'var(--color-text-danger)' : '';
      }
      input.addEventListener('input', update);
      update();
    },

    /**
     * Toggle password visibility for a password input.
     * @param {HTMLInputElement} input
     * @param {HTMLButtonElement} [toggleBtn]
     */
    togglePassword(input, toggleBtn) {
      const visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      if (toggleBtn) {
        toggleBtn.textContent = visible ? 'Show' : 'Hide';
        toggleBtn.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
      }
    }
  };

  /* ─────────────────────────────────────────
     TOGGLE — switch behavior
     ───────────────────────────────────────── */

  const Toggle = {
    /** Toggle a .ui-toggle-wrap element's state */
    toggle(wrapEl) {
      const track = wrapEl.querySelector('.ui-toggle-track');
      if (!track) return;
      track.classList.toggle('on');
      const on = track.classList.contains('on');
      wrapEl.setAttribute('aria-checked', String(on));
      wrapEl.dispatchEvent(new CustomEvent('ui-toggle-change', {
        bubbles: true,
        detail: { checked: on }
      }));
    },

    /** Set a toggle to a specific state */
    set(wrapEl, checked) {
      const track = wrapEl.querySelector('.ui-toggle-track');
      if (!track) return;
      track.classList.toggle('on', checked);
      wrapEl.setAttribute('aria-checked', String(checked));
    }
  };

  /* ─────────────────────────────────────────
     ALERT — creation and dismissal
     ───────────────────────────────────────── */

  const Alert = {
    ICONS: {
      info: 'ℹ',
      success: '✓',
      warn: '⚠',
      danger: '✕'
    },
    ROLES: {
      info: 'status',
      success: 'status',
      warn: 'alert',
      danger: 'alert'
    },

    /**
     * Create and insert an alert into a container.
     * @param {HTMLElement} container - where to insert
     * @param {object} opts
     * @param {string} opts.type - 'info' | 'success' | 'warn' | 'danger'
     * @param {string} opts.title
     * @param {string} [opts.desc]
     * @param {boolean} [opts.dismissible]
     * @returns {HTMLElement} the alert element
     */
    show(container, opts) {
      const { type = 'info', title, desc, dismissible = true } = opts;
      const el = document.createElement('div');
      el.className = 'ui-alert ui-alert-' + type;
      el.setAttribute('role', Alert.ROLES[type] || 'status');
      el.setAttribute('aria-live', type === 'danger' || type === 'warn' ? 'assertive' : 'polite');

      el.innerHTML =
        '<span class="ui-alert-icon" aria-hidden="true">' + (Alert.ICONS[type] || 'ℹ') + '</span>' +
        '<div class="ui-alert-body">' +
          '<div class="ui-alert-title">' + title + '</div>' +
          (desc ? '<div class="ui-alert-desc">' + desc + '</div>' : '') +
        '</div>' +
        (dismissible
          ? '<button class="ui-alert-close" aria-label="Dismiss ' + type + ' alert">✕</button>'
          : '');

      container.prepend(el);

      if (dismissible) {
        el.querySelector('.ui-alert-close').addEventListener('click', () => Alert.dismiss(el));
      }
      return el;
    },

    /** Dismiss (remove) an alert element */
    dismiss(alertEl) {
      alertEl.remove();
    }
  };

  /* ─────────────────────────────────────────
     MODAL — open / close / focus management
     ───────────────────────────────────────── */

  const Modal = {
    _boundKey: null,
    _returnFocus: null,

    /**
     * Open a modal by its backdrop element or ID.
     * @param {HTMLElement|string} backdropOrId
     */
    open(backdropOrId) {
      const backdrop = typeof backdropOrId === 'string'
        ? document.getElementById(backdropOrId)
        : backdropOrId;
      if (!backdrop) return;

      Modal._returnFocus = document.activeElement;
      backdrop.classList.add('open');
      document.body.setAttribute('aria-hidden-except', '');

      // Focus first focusable inside the modal
      const focusable = getFocusable(backdrop);
      if (focusable.length) {
        setTimeout(() => focusable[0].focus(), 50);
      }

      // Bind keyboard handler
      Modal._boundKey = (e) => {
        if (e.key === 'Escape') { e.preventDefault(); Modal.close(backdrop); }
        trapFocus(backdrop, e);
      };
      document.addEventListener('keydown', Modal._boundKey);

      // Backdrop click
      backdrop._backdropClick = (e) => {
        if (e.target === backdrop) Modal.close(backdrop);
      };
      backdrop.addEventListener('click', backdrop._backdropClick);

      backdrop.dispatchEvent(new CustomEvent('ui-modal-open', { bubbles: true }));
    },

    /**
     * Close a modal by its backdrop element or ID.
     * @param {HTMLElement|string} backdropOrId
     */
    close(backdropOrId) {
      const backdrop = typeof backdropOrId === 'string'
        ? document.getElementById(backdropOrId)
        : backdropOrId;
      if (!backdrop) return;

      backdrop.classList.remove('open');
      document.body.removeAttribute('aria-hidden-except');

      if (Modal._boundKey) {
        document.removeEventListener('keydown', Modal._boundKey);
        Modal._boundKey = null;
      }
      if (backdrop._backdropClick) {
        backdrop.removeEventListener('click', backdrop._backdropClick);
        delete backdrop._backdropClick;
      }

      // Return focus to the element that opened the modal
      if (Modal._returnFocus && typeof Modal._returnFocus.focus === 'function') {
        Modal._returnFocus.focus();
        Modal._returnFocus = null;
      }

      backdrop.dispatchEvent(new CustomEvent('ui-modal-close', { bubbles: true }));
    }
  };

  /* ─────────────────────────────────────────
     AUTO-INIT — wire declarative HTML attributes
     ───────────────────────────────────────── */

  function initToggles() {
    document.querySelectorAll('.ui-toggle-wrap').forEach(wrap => {
      if (wrap.dataset.uiInit) return;
      wrap.dataset.uiInit = '1';

      // Keyboard: Space/Enter activate
      wrap.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          Toggle.toggle(wrap);
        }
      });
      // Click activate
      wrap.addEventListener('click', () => Toggle.toggle(wrap));
    });
  }

  function initModalTriggers() {
    // data-ui-open="#modal-id" opens a modal
    document.querySelectorAll('[data-ui-open]').forEach(btn => {
      if (btn.dataset.uiInit) return;
      btn.dataset.uiInit = '1';
      btn.addEventListener('click', () => Modal.open(btn.dataset.uiOpen));
    });

    // data-ui-close (inside a modal) closes its parent backdrop
    document.querySelectorAll('[data-ui-close]').forEach(btn => {
      if (btn.dataset.uiInit) return;
      btn.dataset.uiInit = '1';
      btn.addEventListener('click', () => {
        const backdrop = btn.closest('.ui-modal-backdrop');
        if (backdrop) Modal.close(backdrop);
      });
    });

    // .ui-modal-close buttons inside a modal
    document.querySelectorAll('.ui-modal-close').forEach(btn => {
      if (btn.dataset.uiInit) return;
      btn.dataset.uiInit = '1';
      btn.addEventListener('click', () => {
        const backdrop = btn.closest('.ui-modal-backdrop');
        if (backdrop) Modal.close(backdrop);
      });
    });
  }

  function initAlertDismiss() {
    document.querySelectorAll('.ui-alert-close').forEach(btn => {
      if (btn.dataset.uiInit) return;
      btn.dataset.uiInit = '1';
      btn.addEventListener('click', () => Alert.dismiss(btn.closest('.ui-alert')));
    });
  }

  function initCharCounters() {
    // data-ui-counter="#counter-id" data-ui-max="500" on inputs/textareas
    document.querySelectorAll('[data-ui-counter]').forEach(input => {
      if (input.dataset.uiInit) return;
      input.dataset.uiInit = '1';
      const counterEl = document.querySelector(input.dataset.uiCounter);
      const max = parseInt(input.dataset.uiMax || '500', 10);
      if (counterEl) Input.charCounter(input, counterEl, max);
    });
  }

  function initPasswordToggles() {
    // data-ui-toggle-pass="#input-id" on a button toggles that input's type
    document.querySelectorAll('[data-ui-toggle-pass]').forEach(btn => {
      if (btn.dataset.uiInit) return;
      btn.dataset.uiInit = '1';
      const input = document.querySelector(btn.dataset.uiTogglePass);
      if (input) {
        btn.addEventListener('click', () => Input.togglePassword(input, btn));
      }
    });
  }

  /**
   * Initialize all declarative UI Kit behaviors.
   * Call again after adding new elements to the DOM.
   */
  function init() {
    initToggles();
    initModalTriggers();
    initAlertDismiss();
    initCharCounters();
    initPasswordToggles();
  }

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ─────────────────────────────────────────
     PUBLIC API
     ───────────────────────────────────────── */
  return {
    init,
    Button,
    Input,
    Toggle,
    Alert,
    Modal,
    uid,
    getFocusable
  };

}));
