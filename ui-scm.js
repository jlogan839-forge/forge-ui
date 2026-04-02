/**
 * Forge UI — SCM Module JavaScript
 * Version: 1.0.0
 *
 * Requires: forge-ui-kit.js
 *
 * Usage:
 *   <script src="forge-ui-kit.js"></script>
 *   <script src="ui-scm.js"></script>
 *
 * API:
 *   SCM.Approval.approve(stepEl)
 *   SCM.Approval.reject(stepEl, reason)
 *   SCM.Shipment.setStep(trackerEl, stepIndex)
 *   SCM.PO.setStatus(poEl, status)
 *   SCM.Inventory.flagLow(rowEl)
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.SCM = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /* ─────────────────────────────────────────
     APPROVAL FLOW
     ───────────────────────────────────────── */
  const Approval = {
    /**
     * Approve the current active step in an approval flow.
     * @param {HTMLElement} approvalEl — the .scm-approval container
     */
    approve(approvalEl) {
      const active = approvalEl.querySelector('.scm-approval-step.step-active');
      if (!active) return;

      active.classList.remove('step-active');
      active.classList.add('step-done');

      const icon = active.querySelector('.scm-approval-step-icon');
      if (icon) icon.textContent = '✓';

      const meta = active.querySelector('.scm-approval-step-meta');
      if (meta) meta.textContent = 'Approved ' + SCM._now();

      const next = active.nextElementSibling;
      if (next && next.classList.contains('scm-approval-step')) {
        next.classList.remove('step-pending');
        next.classList.add('step-active');
        const nextIcon = next.querySelector('.scm-approval-step-icon');
        if (nextIcon) nextIcon.textContent = '…';
      } else {
        SCM._setApprovalComplete(approvalEl);
      }

      approvalEl.dispatchEvent(new CustomEvent('scm-approval-step', {
        bubbles: true,
        detail: { action: 'approved', step: active }
      }));
    },

    /**
     * Reject the current active step.
     * @param {HTMLElement} approvalEl — the .scm-approval container
     * @param {string} [reason]
     */
    reject(approvalEl, reason) {
      const active = approvalEl.querySelector('.scm-approval-step.step-active');
      if (!active) return;

      active.classList.remove('step-active');
      active.classList.add('step-rejected');
      active.style.background = 'var(--scm-bg-cancelled)';
      active.style.borderColor = 'var(--scm-color-cancelled)';

      const icon = active.querySelector('.scm-approval-step-icon');
      if (icon) {
        icon.textContent = '✕';
        icon.style.background = 'var(--scm-color-cancelled)';
      }

      const meta = active.querySelector('.scm-approval-step-meta');
      if (meta) meta.textContent = (reason || 'Rejected') + ' · ' + SCM._now();

      const actions = approvalEl.querySelector('.scm-approval-actions');
      if (actions) {
        actions.innerHTML = '<p style="font-size:13px;color:var(--scm-color-cancelled);font-family:var(--forge-font-body)">Purchase order rejected.</p>';
      }

      approvalEl.dispatchEvent(new CustomEvent('scm-approval-rejected', {
        bubbles: true,
        detail: { reason, step: active }
      }));
    }
  };

  /* ─────────────────────────────────────────
     SHIPMENT TRACKER
     ───────────────────────────────────────── */
  const Shipment = {
    /**
     * Set the active step in a shipment tracker.
     * @param {HTMLElement} trackerEl — the .scm-shipment container
     * @param {number} stepIndex — 0-based index of the current step
     */
    setStep(trackerEl, stepIndex) {
      const steps = trackerEl.querySelectorAll('.scm-shipment-step');
      const progressLine = trackerEl.querySelector('.scm-shipment-progress-line');

      steps.forEach((step, i) => {
        step.classList.remove('done', 'active');
        const dot = step.querySelector('.scm-shipment-step-dot');
        if (dot) dot.textContent = '';

        if (i < stepIndex) {
          step.classList.add('done');
          if (dot) dot.textContent = '✓';
        } else if (i === stepIndex) {
          step.classList.add('active');
        }
      });

      if (progressLine && steps.length > 1) {
        const pct = (stepIndex / (steps.length - 1)) * 100;
        progressLine.style.width = 'calc(' + pct + '% - 48px)';
      }

      trackerEl.dispatchEvent(new CustomEvent('scm-shipment-step', {
        bubbles: true,
        detail: { stepIndex }
      }));
    }
  };

  /* ─────────────────────────────────────────
     PURCHASE ORDER
     ───────────────────────────────────────── */
  const PO = {
    /**
     * Update the status badge on a PO card.
     * @param {HTMLElement} poEl — the .scm-po container
     * @param {string} status — draft|pending|approved|shipped|delivered|cancelled|overdue
     */
    setStatus(poEl, status) {
      const badge = poEl.querySelector('.scm-badge');
      if (!badge) return;

      const labels = {
        draft: 'Draft', pending: 'Pending approval',
        approved: 'Approved', shipped: 'Shipped',
        delivered: 'Delivered', cancelled: 'Cancelled', overdue: 'Overdue'
      };

      badge.className = 'scm-badge scm-badge-' + status;
      badge.textContent = labels[status] || status;

      poEl.dispatchEvent(new CustomEvent('scm-po-status', {
        bubbles: true,
        detail: { status }
      }));
    }
  };

  /* ─────────────────────────────────────────
     INVENTORY
     ───────────────────────────────────────── */
  const Inventory = {
    /**
     * Flag a table row as low stock.
     * @param {HTMLElement} rowEl — a <tr> in .scm-inventory-table
     */
    flagLow(rowEl) {
      const qty = rowEl.querySelector('.scm-inventory-qty');
      if (qty) qty.classList.add('low');
      rowEl.setAttribute('aria-label', (rowEl.getAttribute('aria-label') || '') + ' — low stock');
    },

    /** Remove low stock flag from a row */
    clearLow(rowEl) {
      const qty = rowEl.querySelector('.scm-inventory-qty');
      if (qty) qty.classList.remove('low');
    },

    /**
     * Auto-flag rows where quantity is at or below reorder threshold.
     * Reads data-qty and data-reorder attributes from each <tr>.
     * @param {HTMLElement} tableEl — the .scm-inventory container
     */
    autoFlag(tableEl) {
      const rows = tableEl.querySelectorAll('tbody tr[data-qty][data-reorder]');
      rows.forEach(row => {
        const qty = parseInt(row.dataset.qty, 10);
        const reorder = parseInt(row.dataset.reorder, 10);
        if (!isNaN(qty) && !isNaN(reorder) && qty <= reorder) {
          Inventory.flagLow(row);
        }
      });
    }
  };

  /* ─────────────────────────────────────────
     AUTO-INIT
     ───────────────────────────────────────── */
  function init() {
    // Wire approve buttons
    document.querySelectorAll('[data-scm-approve]').forEach(btn => {
      if (btn.dataset.scmInit) return;
      btn.dataset.scmInit = '1';
      btn.addEventListener('click', () => {
        const approval = btn.closest('.scm-approval');
        if (approval) Approval.approve(approval);
      });
    });

    // Wire reject buttons
    document.querySelectorAll('[data-scm-reject]').forEach(btn => {
      if (btn.dataset.scmInit) return;
      btn.dataset.scmInit = '1';
      btn.addEventListener('click', () => {
        const approval = btn.closest('.scm-approval');
        const reason = btn.dataset.scmRejectReason || 'Rejected';
        if (approval) Approval.reject(approval, reason);
      });
    });

    // Auto-init shipment trackers with data-scm-step attribute
    document.querySelectorAll('.scm-shipment[data-scm-step]').forEach(tracker => {
      const step = parseInt(tracker.dataset.scmStep, 10);
      if (!isNaN(step)) Shipment.setStep(tracker, step);
    });

    // Auto-flag low inventory
    document.querySelectorAll('.scm-inventory').forEach(table => {
      Inventory.autoFlag(table);
    });
  }

  /* ─────────────────────────────────────────
     INTERNAL HELPERS
     ───────────────────────────────────────── */
  function _now() {
    return new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  function _setApprovalComplete(approvalEl) {
    const actions = approvalEl.querySelector('.scm-approval-actions');
    if (actions) {
      actions.innerHTML = '<p style="font-size:13px;color:var(--scm-color-shipped);font-weight:500;font-family:var(--forge-font-body)">✓ All approvals complete — PO is confirmed.</p>';
    }
    approvalEl.dispatchEvent(new CustomEvent('scm-approval-complete', { bubbles: true }));
  }

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    Approval,
    Shipment,
    PO,
    Inventory,
    _now,
    _setApprovalComplete
  };

}));
