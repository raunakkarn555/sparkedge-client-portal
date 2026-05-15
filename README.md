# SparkEdge Client Portal

A professional, frontend-only client portal for SparkEdge Creative Agency — built with plain HTML, CSS, and JavaScript. Hosted on GitHub Pages. 

---

## 📁 Folder Structure

```
sparkedge-portal/
│
├── index.html                  ← Login / entry page (share this URL with clients)
│
├── clients/
│   ├── _TEMPLATE.html          ← Duplicate this to add a new client
│   ├── SE-001.html             ← Client: Rohan Mehta
│   ├── SE-002.html             ← Client: Priya Sharma
│   └── SE-003.html             ← (add more here)
│
├── assets/
│   ├── css/
│   │   └── style.css           ← All styles (edit to retheme)
│   └── js/
│       └── portal.js           ← Dashboard renderer (shared logic)
│
└── README.md                   ← This file
```

---

## 🚀 How to Add a New Client (Step-by-Step)

### Step 1 — Decide the ticket ID
Use format `SE-XXX` — next in sequence. Example: `SE-003`

### Step 2 — Duplicate the template
- Copy `clients/_TEMPLATE.html`
- Rename it `clients/SE-003.html`

### Step 3 — Fill in the client data
Open the new file and edit **only** the `clientData` object:
- `ticketId`, `clientName`, `projectName`
- `startDate`, `deadline`, `status`, `progress`
- `payment.total` and `payment.stages`
- `files` (paste Google Drive / Figma links)
- `deliverables` (list all project outputs)
- `timeline` (most recent entry first)
- `managerNote` (optional HTML message)

### Step 4 — Register the ticket in index.html
Open `index.html` and find:
```js
const validTickets = ['SE-001', 'SE-002', 'SE-003'];
```
Add the new ID:
```js
const validTickets = ['SE-001', 'SE-002', 'SE-003', 'SE-004'];
```

### Step 5 — Push to GitHub
```bash
git add .
git commit -m "Add client SE-003 – [Client Name]"
git push
```

That's it! The portal is live in ~60 seconds.

---

## 🔗 Sharing with Clients

Your portal URL will be:
```
https://YOUR-USERNAME.github.io/sparkedge-portal/
```

Share this with clients. They enter their Ticket ID (e.g. `SE-001`) and land on their private dashboard.

**Direct link** (bookmark for yourself):
```
https://YOUR-USERNAME.github.io/sparkedge-portal/clients/SE-001.html
```

---

## ✏️ How to Update an Existing Client

1. Open `clients/SE-001.html` (or whichever)
2. Edit the `clientData` object:
   - Change `status` → `"In Progress"` or `"Completed"`
   - Bump `progress` percentage
   - Add new `timeline` entries (at the TOP of the array)
   - Mark `deliverables` as `done: true`
   - Change payment stage `status` from `"pending"` to `"paid"`
   - Add new file links
3. Commit and push → live in 60 seconds

---

## 🎨 How to Change the Theme / Colors

Open `assets/css/style.css` and edit the `:root` variables at the top:

```css
:root {
  --accent:   #FF6B35;   /* Primary brand color */
  --accent-2: #FF3CAC;   /* Secondary / gradient color */
  --bg:       #0A0A0F;   /* Page background */
  --bg-card:  #111118;   /* Card background */
  ...
}
```

---

## ⚠️ Limitations (and How to Upgrade Later)

| Limitation | Now | Future Upgrade |
|---|---|---|
| Security | Ticket ID in URL = "security by obscurity" | Add Firebase Auth or Supabase login |
| Data storage | Data hardcoded in HTML | Use a database (Supabase, Airtable, Firebase) |
| Client can't message | No | Add Tally form or WhatsApp link |
| File uploads | Not possible | Add Google Drive/Dropbox integration |
| Notifications | None | Add email via EmailJS or Resend |
| Admin panel | Not included | Build a separate admin.html |

---

## 📬 Contact

SparkEdge Creative Agency
📧 sparkedge555@gmail.com
