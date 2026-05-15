/* ============================================================
   SparkEdge Client Portal — portal.js  (flat folder version)
   Features: payment + discount, freebies/free services,
             documents section, referral popup, feedback link
   Email: sparkedge555@gmail.com
   ============================================================ */

function renderDashboard(client) {

  /* ─── Helpers ─────────────────────────────────────────── */
  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  const statusClass = {
    'Not Started': 'not-started',
    'In Progress':  'in-progress',
    'Completed':    'completed'
  };

  const fileIcon = (type) => ({
    pdf:'📄', figma:'🎨', drive:'📁', doc:'📝',
    sheet:'📊', zip:'🗜️', video:'🎬', image:'🖼️',
    contract:'📋', invoice:'🧾', welcome:'👋',
    thankyou:'🎁', guide:'📘', link:'🔗'
  }[type] || '📎');

  /* ─── Payment Calculations ─────────────────────────────── */
  // Support discount from both client.payment.discount and client.discount
  const discountData  = client.payment.discount || client.discount || null;
  const originalTotal = client.payment.originalTotal || client.payment.total;

  // Auto-calculate finalTotal after discount subtraction
  let finalTotal = client.payment.total;
  let discount   = null;
  if (discountData) {
    let discAmt = 0;
    if (discountData.type === 'percent') {
      discAmt = Math.round(originalTotal * discountData.value / 100);
    } else {
      discAmt = discountData.amount || discountData.value || 0;
    }
    discount   = { ...discountData, amount: discAmt };
    finalTotal = originalTotal - discAmt;
    // Re-scale pending stage amounts proportionally if stages still use originalTotal
  }

  const paidAmt    = client.payment.stages
    .filter(s => s.status === 'paid')
    .reduce((sum, s) => sum + s.amount, 0);
  const pendingAmt = finalTotal - paidAmt;
  const payPct     = finalTotal > 0 ? Math.round((paidAmt / finalTotal) * 100) : 0;

  /* ─── Payment Stages HTML ──────────────────────────────── */
  const stagesHTML = client.payment.stages.map(stage => `
    <div class="stage-item">
      <div class="stage-dot ${stage.status}"></div>
      <div class="stage-info">
        <span class="stage-name">${stage.name}</span>
        ${stage.note ? `<span class="stage-note">${stage.note}</span>` : ''}
      </div>
      <span class="stage-amount">${fmt(stage.amount)}</span>
      <span class="stage-status ${stage.status}">
        ${stage.status === 'paid' ? '✓ Paid' : stage.status === 'pending' ? '⏳ Pending' : '🔒 Upcoming'}
      </span>
    </div>`).join('');

  /* ─── Project Files HTML ───────────────────────────────── */
  const projectFilesHTML = (client.files && client.files.length)
    ? client.files.map(f => `
      <a href="${f.url}" target="_blank" rel="noopener noreferrer" class="file-item">
        <span class="file-icon">${fileIcon(f.type)}</span>
        <span class="file-name">${f.name}</span>
        <span class="file-type">${f.type.toUpperCase()}</span>
        <span class="file-arrow">↗</span>
      </a>`).join('')
    : `<p class="empty-state">No project files yet — will appear here once ready.</p>`;

  /* ─── Documents HTML ───────────────────────────────────── */
  const docsHTML = (client.documents && client.documents.length)
    ? client.documents.map(f => `
      <a href="${f.url}" target="_blank" rel="noopener noreferrer" class="file-item doc-file">
        <span class="file-icon">${fileIcon(f.type)}</span>
        <div class="file-info">
          <span class="file-name">${f.name}</span>
          ${f.desc ? `<span class="file-desc">${f.desc}</span>` : ''}
        </div>
        <span class="file-type">${f.type.toUpperCase()}</span>
        <span class="file-arrow">↗</span>
      </a>`).join('')
    : `<p class="empty-state">No documents shared yet.</p>`;

  /* ─── Freebies HTML ────────────────────────────────────── */
  const freebiesHTML = (client.freebies && client.freebies.length)
    ? client.freebies.map(f => `
      <div class="freebie-item ${f.active ? 'active' : 'inactive'}">
        <div class="freebie-icon">${f.icon || '🎁'}</div>
        <div class="freebie-info">
          <div class="freebie-name">${f.name}</div>
          ${f.note ? `<div class="freebie-note">${f.note}</div>` : ''}
        </div>
        <div class="freebie-badge ${f.active ? 'included' : 'not-included'}">
          ${f.active ? '✓ Included' : '✗ Not Included'}
        </div>
      </div>`).join('')
    : '';

  /* ─── Deliverables HTML ────────────────────────────────── */
  const deliverablesHTML = client.deliverables.map(d => `
    <div class="deliverable-item ${d.done ? 'done' : ''}">
      <span class="deliverable-check">${d.done ? '✓' : '○'}</span>
      <span class="deliverable-name">${d.name}</span>
      ${d.free ? '<span class="free-badge">FREE</span>' : ''}
      ${d.done ? '<span class="done-badge">Done</span>' : ''}
    </div>`).join('');

  /* ─── Timeline HTML ────────────────────────────────────── */
  const timelineHTML = client.timeline.map((item, i) => `
    <div class="timeline-item">
      <div class="timeline-dot ${i === 0 ? '' : 'muted'}"></div>
      <div class="timeline-date">${item.date}</div>
      <div class="timeline-text">${item.text}</div>
      ${item.tag ? `<span class="timeline-tag">${item.tag}</span>` : ''}
    </div>`).join('');

  /* ─── Feedback URL ─────────────────────────────────────── */
  const feedbackURL = client.feedbackUrl ||
    `mailto:sparkedge555@gmail.com?subject=Feedback – ${client.ticketId} (${client.clientName})&body=Hi SparkEdge Team,%0A%0AHere is my feedback for the project:%0A%0A`;

  /* ─── INJECT HTML ──────────────────────────────────────── */
  document.getElementById('app').innerHTML = `

    <!-- ══ NAVBAR ══ -->
    <nav class="navbar">
      <div class="nav-brand">
        <div class="brand-icon" style="width:32px;height:32px;">
          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
            <polygon points="14,2 26,20 2,20" fill="url(#gn)"/>
            <defs>
              <linearGradient id="gn" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FF6B35"/>
                <stop offset="100%" style="stop-color:#FF3CAC"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="nav-brand-name">SparkEdge</span>
      </div>
      <div class="nav-ticket">
        <span class="ticket-badge">${client.ticketId}</span>
        <a href="${feedbackURL}" target="_blank" class="btn-feedback">💬 Feedback</a>
       <a href="https://sparkedge555.github.io/sparkedge-client-portal/" class="btn-logout">
  ← Exit
</a>
      </div>
    </nav>

    <div class="page-wrap">

      <!-- ══ CLIENT HERO ══ -->
      <div class="client-hero">
        <div class="client-hero-top">
          <div>
            <div class="client-greeting">Welcome back</div>
            <div class="client-name">${client.clientName}</div>
            <div class="client-project">Project: <strong>${client.projectName}</strong></div>
          </div>
          <div class="status-pill ${statusClass[client.status] || 'not-started'}">
            <div class="dot"></div>${client.status}
          </div>
        </div>
        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">Overall Progress</span>
            <span class="progress-pct" id="pctDisplay">0%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" id="progressFill" style="width:0%"></div>
          </div>
        </div>
      </div>

      <!-- ══ STATS GRID ══ -->
      <div class="cards-grid" style="margin-bottom:28px">
        <div class="card">
          <div class="card-header"><div class="card-icon">📅</div><div class="card-title">Start Date</div></div>
          <div class="stat-value">${client.startDate}</div><div class="stat-label">Project kicked off</div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-icon">🎯</div><div class="card-title">Deadline</div></div>
          <div class="stat-value">${client.deadline}</div><div class="stat-label">Expected delivery</div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-icon">✅</div><div class="card-title">Deliverables</div></div>
          <div class="stat-value">${client.deliverables.length}</div><div class="stat-label">Total items</div>
        </div>
      </div>

      <!-- ══ PAYMENT TRACKER ══ -->
      <div class="section-card">
        <div class="card-header">
          <div class="card-icon">💰</div>
          <div class="card-title">Payment Tracker</div>
        </div>

        ${discount ? `
        <div class="discount-banner">
          <div class="discount-left">
            <span class="discount-emoji">🎉</span>
            <div>
              <div class="discount-title">Discount Applied — <em>${discount.reason}</em></div>
              <div class="discount-saved">You saved <strong>${fmt(discount.amount)}</strong> on this project!</div>
            </div>
          </div>
          <div class="discount-pill">-${fmt(discount.amount)}</div>
        </div>` : ''}

        <div class="payment-summary-grid">
          <div class="pay-box">
            <div class="pay-box-label">Project Total</div>
            <div class="pay-box-value">${fmt(finalTotal)}</div>
            ${discount ? `<div class="pay-box-original"><s>${fmt(originalTotal)}</s> original</div>` : ''}
          </div>
          <div class="pay-box green">
            <div class="pay-box-label">💚 Amount Paid</div>
            <div class="pay-box-value">${fmt(paidAmt)}</div>
          </div>
          <div class="pay-box ${pendingAmt > 0 ? 'amber' : 'green'}">
            <div class="pay-box-label">🟡 Balance Due</div>
            <div class="pay-box-value">${fmt(pendingAmt)}</div>
          </div>
        </div>

        <div style="margin:20px 0 24px">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-dim);margin-bottom:8px;">
            <span>Payment Progress</span><span>${payPct}% paid</span>
          </div>
          <div class="progress-track">
            <div style="height:100%;width:${payPct}%;background:linear-gradient(90deg,#22C55E,#16A34A);border-radius:99px;transition:width 1.2s cubic-bezier(.4,0,.2,1)"></div>
          </div>
        </div>

        <div class="section-sub-label">Payment Stages</div>
        <div class="stages-list">${stagesHTML}</div>

        ${pendingAmt > 0 ? `
        <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,.07);">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
            <div>
              <div style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#7A7A9A;margin-bottom:4px;">Amount Due Now</div>
              <div style="font-size:24px;font-weight:800;font-family:'Syne',sans-serif;color:#F59E0B;">${fmt(pendingAmt)}</div>
            </div>
            <button onclick="document.getElementById('payModal').classList.add('open')" style="background:linear-gradient(135deg,#FF6B35,#FF3CAC);border:none;border-radius:12px;padding:14px 28px;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:#fff;cursor:pointer;display:flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(255,107,53,.35);">
              Pay Now
            </button>
          </div>
          <div style="margin-top:12px;font-size:11px;color:#3A3A5A;">
            Secure payment via UPI or Bank Transfer. After paying, share screenshot on WhatsApp or email <strong style="color:#7A7A9A;">sparkedge555@gmail.com</strong>
          </div>
        </div>` : `
        <div style="margin-top:20px;padding:14px 18px;background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.2);border-radius:10px;display:flex;align-items:center;gap:10px;">
          <span style="font-size:20px;">&#10004;</span>
          <div style="font-size:13px;font-weight:700;color:#22C55E;">All payments received - Thank you!</div>
        </div>`}
      </div>

      <!-- ══ FREE SERVICES & FREEBIES ══ -->
      ${(client.freebies && client.freebies.length) ? `
      <div class="section-card">
        <div class="card-header">
          <div class="card-icon">🎁</div>
          <div class="card-title">Free Services & Gifts</div>
        </div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">Complimentary add-ons and gifts included with your project.</p>
        <div class="freebies-list">${freebiesHTML}</div>
      </div>` : ''}

      <!-- ══ PROJECT FILES ══ -->
      <div class="section-card">
        <div class="card-header">
          <div class="card-icon">📁</div>
          <div class="card-title">Project Files</div>
        </div>
        <div class="files-list">${projectFilesHTML}</div>
      </div>

      <!-- ══ DOCUMENTS ══ -->
      <div class="section-card">
        <div class="card-header">
          <div class="card-icon">📋</div>
          <div class="card-title">Your Documents</div>
        </div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">Official letters, contracts, invoices &amp; notes from SparkEdge.</p>
        <div class="files-list">${docsHTML}</div>
      </div>

      <!-- ══ DELIVERABLES ══ -->
      <div class="section-card">
        <div class="card-header">
          <div class="card-icon">🎯</div>
          <div class="card-title">Deliverables</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">${deliverablesHTML}</div>
      </div>

      <!-- ══ UPDATE LOG ══ -->
      <div class="section-card">
        <div class="card-header">
          <div class="card-icon">🗓️</div>
          <div class="card-title">Update Log</div>
        </div>
        <div class="timeline">${timelineHTML}</div>
      </div>

      <!-- ══ MANAGER NOTE ══ -->
      ${client.managerNote ? `
      <div class="section-card">
        <div class="card-header">
          <div class="card-icon">💬</div>
          <div class="card-title">Note from Your Manager</div>
        </div>
        <div class="note-box">${client.managerNote}</div>
      </div>` : ''}

    </div><!-- /page-wrap -->

    <!-- ══ FOOTER ══ -->
    <div class="dashboard-footer">
      <div class="footer-inner">
        <div class="footer-left">
          <span class="footer-brand">SparkEdge</span>
          <span class="footer-sep">·</span>
          <a href="mailto:sparkedge555@gmail.com">sparkedge555@gmail.com</a>
          <span class="footer-sep">·</span>
          <span>© ${new Date().getFullYear()}</span>
        </div>
        <div class="footer-right">
          <a href="${feedbackURL}" target="_blank" class="footer-link">💬 Feedback</a>
          <button class="footer-referral-btn" onclick="openReferralPopup()">🤝 Refer &amp; Earn</button>
        </div>
      </div>
    </div>

    <!-- ══ REFERRAL POPUP ══ -->
    <div id="referralOverlay" class="popup-overlay" onclick="closeReferralPopup(event)">
      <div class="popup-card referral-popup">
        <button class="popup-close" onclick="closeReferralPopup()">✕</button>

        <div class="referral-header">
          <div class="referral-emoji">🤝</div>
          <h2 class="referral-title">Refer &amp; Earn with SparkEdge</h2>
          <p class="referral-sub">Share the love — earn real cash rewards every time someone you refer becomes our client.</p>
        </div>

        <div class="referral-steps">
          <div class="referral-step">
            <div class="step-num">1</div>
            <div class="step-text">
              <strong>Refer someone you know</strong>
              <span>A friend, colleague, or business owner who needs design, branding, or web development.</span>
            </div>
          </div>
          <div class="referral-step">
            <div class="step-num">2</div>
            <div class="step-text">
              <strong>They sign up &amp; pay</strong>
              <span>Once their project is confirmed and first payment is received — the reward is unlocked.</span>
            </div>
          </div>
          <div class="referral-step">
            <div class="step-num">3</div>
            <div class="step-text">
              <strong>Both of you get rewarded 💸</strong>
              <span>The cash reward is split between you and your referral — everyone wins.</span>
            </div>
          </div>
        </div>

        <div class="referral-rewards">
          <div class="reward-card web-dev">
            <div class="reward-top">
              <span class="reward-emoji">🌐</span>
              <div>
                <div class="reward-category">Web Development Projects</div>
                <div class="reward-total">₹1,000 per successful payment stage</div>
              </div>
            </div>
            <div class="reward-split">
              <div class="split-box you">
                <span class="split-label">You earn</span>
                <span class="split-amt">₹500</span>
                <span class="split-sub">per payment</span>
              </div>
              <div class="split-plus">+</div>
              <div class="split-box friend">
                <span class="split-label">Your friend gets</span>
                <span class="split-amt">₹500</span>
                <span class="split-sub">discount / cashback</span>
              </div>
            </div>
            <p class="reward-note">✦ Reward repeats on every payment stage, not just the first!</p>
          </div>

          <div class="reward-card design-brand">
            <div class="reward-top">
              <span class="reward-emoji">🎨</span>
              <div>
                <div class="reward-category">Design &amp; Branding Projects</div>
                <div class="reward-total">₹500 on project completion</div>
              </div>
            </div>
            <div class="reward-split">
              <div class="split-box you">
                <span class="split-label">You earn</span>
                <span class="split-amt">₹300</span>
                <span class="split-sub">on completion</span>
              </div>
              <div class="split-plus">+</div>
              <div class="split-box friend">
                <span class="split-label">Your friend gets</span>
                <span class="split-amt">₹200</span>
                <span class="split-sub">discount on project</span>
              </div>
            </div>
          </div>
        </div>

        <div class="referral-terms">
          <strong>📩 How to refer:</strong> Email or WhatsApp us with your Ticket ID + your friend's name &amp; contact.
          We'll reach out to them and confirm everything. Rewards are sent via UPI within <strong>7 working days</strong>
          of confirmed payment. No limit on how many people you refer — refer 10 clients, earn 10× rewards! 🚀
          <br><br>
          <a href="mailto:sparkedge555@gmail.com">sparkedge555@gmail.com</a>
        </div>

        <a href="mailto:sparkedge555@gmail.com?subject=Referral from ${client.ticketId} – ${client.clientName}&body=Hi SparkEdge Team,%0A%0AI'd like to refer someone to you!%0A%0AMy Details:%0ATicket ID: ${client.ticketId}%0AName: ${client.clientName}%0A%0AReferral Details:%0AFriend's Name:%0AFriend's Phone/Email:%0AType of Project Needed:%0A%0AThank you!"
           target="_blank" class="btn-primary referral-cta">
          ✉️ Send My Referral Now
        </a>
      </div>
    </div>
  `;

  /* ── Animate project progress bar ── */
  setTimeout(() => {
    document.getElementById('progressFill').style.width = client.progress + '%';
    document.getElementById('pctDisplay').textContent   = client.progress + '%';
  }, 300);
}

/* ── Referral Popup Controls ── */
function openReferralPopup() {
  document.getElementById('referralOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeReferralPopup(e) {
  if (!e || e.target === document.getElementById('referralOverlay')) {
    document.getElementById('referralOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeReferralPopup(); });
