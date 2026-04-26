# 🔍 OS System Call Analyzer

> A real-time, web-based OS System Call monitoring dashboard — built as a university mini-project aligned with **UN SDG 16: Peace, Justice and Strong Institutions**.

---

## 📌 Overview

The **OS System Call Analyzer** is a front-end simulation dashboard that mimics the behavior of an operating system-level call monitor. It tracks and visualizes system calls made by processes in real time, providing transparency into how software interacts with the OS kernel.

This project demonstrates how technology can promote accountability and transparency — core pillars of **SDG 16**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🟢 **Live System Call Feed** | Streams simulated system calls every 3 seconds with timestamps, PIDs, call names, and statuses |
| 📊 **Real-Time Analytics** | Doughnut chart showing the ratio of successful vs. failed calls, updated live |
| 🧮 **Metrics Dashboard** | Counters for total calls, error calls, and active processes |
| ⏸️ **Start / Stop Monitoring** | Toggle monitoring on and off with live status indicators |
| 📥 **Download Report** | Export the full session log as a `.txt` report file |
| 📱 **Responsive Layout** | Adapts to smaller screens (stacks to single column on ≤ 1024px) |
| 🎨 **Glassmorphism UI** | Dark-mode design with glass panels, blur effects, and micro-animations |

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (Semantic) |
| Styling | Vanilla CSS (Glassmorphism, CSS Variables, Animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Charts | [Chart.js](https://www.chartjs.org/) (CDN) |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (Google Fonts) |

No build tools, no frameworks, no dependencies to install — runs entirely in the browser.

---

## 🗂️ Project Structure

```
system call/
│
├── index.html      # Main HTML shell — layout, panels, and semantic structure
├── styles.css      # Full CSS — theme tokens, glassmorphism, animations, responsive
├── app.js          # JavaScript — data simulation, chart, metrics, event handlers
└── README.md       # You are here
```

---

## 🚀 Getting Started

No installation or build step required.

1. **Clone or download** this repository.
2. Open `index.html` directly in any modern browser (Chrome, Edge, Firefox).

```bash
# Option 1: Open directly
start index.html

# Option 2: Serve locally (optional, avoids CORS quirks)
npx serve .
```

> ✅ Internet access is required on first load to fetch Google Fonts and Chart.js from their CDNs.

---

## ⚙️ Configuration

You can tweak the simulation behavior at the top of `app.js`:

```js
const CONFIG = {
    maxRows: 150,          // Maximum log rows to keep in the DOM
    intervalMs: 3000,      // How often a new batch of calls is generated (ms)
    errorProbability: 0.15 // Probability (0–1) that a call results in an ERROR
};
```

---

## 📡 Simulated System Calls

The dashboard simulates the following Windows NT-style kernel calls:

| Call Name | Category |
|---|---|
| `NtCreateFile` | File I/O |
| `NtReadFile` | File I/O |
| `NtWriteFile` | File I/O |
| `NtAllocateVirtualMemory` | Memory |
| `NtFreeVirtualMemory` | Memory |
| `NtOpenProcess` | Process |
| `NtTerminateProcess` | Process |
| `NtDeviceIoControlFile` | Device |
| `WSASocketW` | Network |
| `NtOpenKey` | Registry |
| `NtSetValueKey` | Registry |

---

## 🌍 SDG 16 Alignment

This project is developed in alignment with **UN Sustainable Development Goal 16 — Peace, Justice and Strong Institutions**.

| Pillar | How This Tool Contributes |
|---|---|
| 🔍 **Transparency** | Uncovers hidden software behaviors and background data access in real time |
| 🛡️ **Accountability** | Identifies and flags unauthorized or anomalous resource usage by processes |

By visualizing what happens at the OS kernel level, this tool empowers users and administrators to understand and audit what software is doing on their machines — a key step toward digital accountability.

---

## 📸 UI Highlights

- **Glassmorphism panels** with `backdrop-filter: blur` for a premium dark-mode aesthetic
- **Pulsing live indicator** that animates while monitoring is active
- **Slide-in animation** for each new log row (`@keyframes slideIn`)
- **Error rows** highlighted with a red left-border and subtle red background
- **Doughnut chart** with smooth 500ms update transitions

---

## 📄 Report Download

Click **"Download Report"** to export a structured `.txt` log of the current session:

```
OS System Call Analyzer Report
Generated: 2026-04-26 14:32:01.123
Total Calls: 87 | Error Calls: 13
------------------------------------------------------
TIME                    PID     STATUS      CALL NAME
------------------------------------------------------
14:31:55.402            4821    SUCCESS     NtReadFile
14:31:55.402            7103    ERROR       NtOpenProcess
...
```

---

## 👤 Author

**Sandy** — University Mini-Project  
*Built for academic demonstration purposes.*

---

## 📜 License

This project is submitted as a university mini-project. All code is original and free to use for educational purposes.
