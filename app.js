/**
 * OS System Call Analyzer Simulation
 * Generates mock system calls and updates the UI.
 */

// Configuration
const CONFIG = {
    maxRows: 150, // Keep more rows for logs
    intervalMs: 3000, // Update every 3 seconds as requested
    errorProbability: 0.15 // 15% chance of an error call
};

// Mock Data Generators
const syscalls = [
    'NtCreateFile', 'NtReadFile', 'NtWriteFile', 
    'NtAllocateVirtualMemory', 'NtFreeVirtualMemory', 
    'NtOpenProcess', 'NtTerminateProcess',
    'NtDeviceIoControlFile', 'WSASocketW',
    'NtOpenKey', 'NtSetValueKey'
];

// State
let isRunning = true;
let totalCalls = 0;
let errorCalls = 0;
let activeProcesses = new Set();
let logsData = []; // Store logs for download
let streamInterval;
let statusChartInstance;

// DOM Elements
const streamContainer = document.getElementById('streamContainer');
const toggleBtn = document.getElementById('toggleBtn');
const downloadBtn = document.getElementById('downloadBtn');
const metricTotal = document.getElementById('metricTotal');
const metricError = document.getElementById('metricError');
const metricActive = document.getElementById('metricActive');
const liveIndicator = document.getElementById('liveIndicator');
const statusBadge = document.getElementById('statusBadge');

// Initialize Chart.js
function initChart() {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    Chart.defaults.color = '#a1a1aa';
    Chart.defaults.font.family = "'Inter', sans-serif";
    
    statusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Success', 'Error'],
            datasets: [{
                data: [0, 0],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)', // Success Green
                    'rgba(239, 68, 68, 0.8)'   // Error Red
                ],
                borderColor: [
                    '#10b981',
                    '#ef4444'
                ],
                borderWidth: 1,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 20, usePointStyle: true }
                }
            },
            animation: { duration: 500 }
        }
    });
}

// Utilities
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPID() {
    return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
}

function getCurrentTimeStr() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 23); // YYYY-MM-DD HH:MM:SS.mmm
}

// Data Generation
function generateCall() {
    const isError = Math.random() < CONFIG.errorProbability;
    const syscall = getRandomItem(syscalls);
    const pid = getRandomPID();
    const status = isError ? 'ERROR' : 'SUCCESS';

    return {
        time: getCurrentTimeStr(),
        pid: pid,
        syscall: syscall,
        status: status,
        isError: isError
    };
}

// UI Updates
function appendToStream(data) {
    const row = document.createElement('div');
    row.className = `syscall-row ${data.isError ? 'error-row' : ''}`;
    
    const statusClass = data.status === 'SUCCESS' ? 'status-success' : 'status-error';

    row.innerHTML = `
        <span class="col-time">${data.time.split(' ')[1]}</span>
        <span class="col-pid">${data.pid}</span>
        <span class="col-syscall">${data.syscall}</span>
        <span class="col-status"><span class="status-pill ${statusClass}">${data.status}</span></span>
    `;

    // Append to bottom
    streamContainer.appendChild(row);

    // Keep max rows by removing from top
    if (streamContainer.children.length > CONFIG.maxRows) {
        streamContainer.removeChild(streamContainer.firstChild);
    }
    
    // Auto scroll to bottom
    streamContainer.scrollTop = streamContainer.scrollHeight;
}

function updateMetrics(data) {
    totalCalls++;
    if (data.isError) errorCalls++;
    
    activeProcesses.add(data.pid);
    
    // Periodically clean up old PIDs to simulate processes ending
    if (totalCalls % 50 === 0) {
        let pids = Array.from(activeProcesses);
        pids = pids.slice(Math.floor(pids.length * 0.2)); // remove 20%
        activeProcesses = new Set(pids);
    }

    // Update DOM
    metricTotal.textContent = totalCalls.toLocaleString();
    metricError.textContent = errorCalls.toLocaleString();
    metricActive.textContent = activeProcesses.size.toLocaleString();

    // Update Chart
    if (statusChartInstance) {
        statusChartInstance.data.datasets[0].data = [totalCalls - errorCalls, errorCalls];
        statusChartInstance.update();
    }
}

// Main Loop
function tick() {
    if (!isRunning) return;

    // Generate a batch of calls every 3 seconds
    const callsThisTick = Math.floor(Math.random() * 5) + 3;

    for (let i = 0; i < callsThisTick; i++) {
        const data = generateCall();
        
        // Store for download
        logsData.push(data);
        if (logsData.length > 5000) logsData.shift(); // Keep memory somewhat bounded
        
        appendToStream(data);
        updateMetrics(data);
    }

    // Schedule next tick
    streamInterval = setTimeout(tick, CONFIG.intervalMs);
}

// Event Listeners
toggleBtn.addEventListener('click', () => {
    isRunning = !isRunning;
    
    if (isRunning) {
        toggleBtn.textContent = 'Stop Monitoring';
        toggleBtn.className = 'btn btn-primary';
        
        statusBadge.className = 'badge status-live';
        statusBadge.textContent = 'LIVE MONITORING';
        liveIndicator.className = 'pulse-ring';
        
        tick(); // Restart loop
    } else {
        toggleBtn.textContent = 'Start Monitoring';
        toggleBtn.className = 'btn btn-secondary';
        
        clearTimeout(streamInterval);
        
        statusBadge.className = 'badge status-paused';
        statusBadge.textContent = 'PAUSED';
        liveIndicator.className = 'pulse-ring paused';
    }
});

downloadBtn.addEventListener('click', () => {
    if (logsData.length === 0) {
        alert("No logs to download yet.");
        return;
    }
    
    // Create text report
    let reportContent = "OS System Call Analyzer Report\n";
    reportContent += `Generated: ${getCurrentTimeStr()}\n`;
    reportContent += `Total Calls: ${totalCalls} | Error Calls: ${errorCalls}\n`;
    reportContent += "------------------------------------------------------\n";
    reportContent += "TIME\t\t\tPID\t\tSTATUS\t\tCALL NAME\n";
    reportContent += "------------------------------------------------------\n";
    
    logsData.forEach(log => {
        reportContent += `${log.time}\t${log.pid}\t${log.status}\t\t${log.syscall}\n`;
    });
    
    // Trigger download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `syscall_report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Initialization
function init() {
    initChart();
    
    // Generate initial set of data
    let tempRunning = isRunning;
    isRunning = false;
    for(let i=0; i<10; i++) {
        const data = generateCall();
        logsData.push(data);
        appendToStream(data);
        updateMetrics(data);
    }
    isRunning = tempRunning;
    
    // Start main loop
    tick();
}

// Start
document.addEventListener('DOMContentLoaded', init);
