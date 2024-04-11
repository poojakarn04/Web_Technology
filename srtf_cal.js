class Process {
    constructor(at, bt) {
        this.at = at;
        this.bt = bt;
        this.rt = bt;
        this.wt = 0;
    }
}

function addProcessRow() {
    const processTable = document.getElementById('processTable');
    const rowCount = processTable.rows.length;
    const row = processTable.insertRow(rowCount);
    const processNumber = rowCount;
    row.insertCell(0).innerHTML = `P${processNumber}`;
    row.insertCell(1).innerHTML = `<input type="number" id="arrival${processNumber}" placeholder="Arrival time">`;
    row.insertCell(2).innerHTML = `<input type="number" id="burst${processNumber}" placeholder="Burst time">`;
}

function calculate() {
    const processTable = document.getElementById('processTable');
    const rowCount = processTable.rows.length;

    const processes = [];
    let wtSum = 0, sum = 0, tat = 0;
    const arrivalTimes = new Set();
    // takes data from the table for however many processes there are (number of rows added)
    for (let i = 1; i < rowCount; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        processes.push(new Process(arrivalTime, burstTime));
        if (isNaN(arrivalTime) || isNaN(burstTime)) {
            alert("Arrival time or burst time cannot be left empty.");
            return false;
        }
        if (arrivalTime < 0 || burstTime < 0) {
            alert("Arrival time or burst time cannot be negative.");
            return false;
        }
        if (arrivalTimes.has(arrivalTime)) {
            alert("No two processes should have the same arrival time.");
            return;
        }

        arrivalTimes.add(arrivalTime);
    }

    // change in the algorithm
    let currentTime = 0;
    let completed = 0;
    let shortest = Number.MAX_SAFE_INTEGER;
    let shortestIndex = -1;
    let preempted = false;

    let ganttChart = '<div class="gantt">';
    ganttChart += '<div class="bar">0</div>';

    while (completed !== rowCount - 1) {
        for (let i = 0; i < rowCount - 1; i++) {
            if (processes[i].at <= currentTime && processes[i].rt < shortest && processes[i].rt > 0) {
                shortest = processes[i].rt;
                shortestIndex = i;
                preempted = true;
            }
        }

        if (!preempted) {
            currentTime++;
            ganttChart += `<div class="bar">${currentTime}</div>`;
            continue;
        }

        processes[shortestIndex].rt--;

        if (processes[shortestIndex].rt === 0) {
            completed++;
            let finishTime = currentTime + 1;
            processes[shortestIndex].wt = finishTime - processes[shortestIndex].bt - processes[shortestIndex].at;
            if (processes[shortestIndex].wt < 0) processes[shortestIndex].wt = 0;
            sum += processes[shortestIndex].wt;
            tat += finishTime - processes[shortestIndex].at;
            shortest = Number.MAX_SAFE_INTEGER;
            preempted = false;
            ganttChart += `<div class="bar">P${shortestIndex + 1}<br>${finishTime}</div>`;
        } else {
            ganttChart += `<div class="bar">P${shortestIndex + 1}</div>`;
        }

        currentTime++;
    }

    ganttChart += '</div>';

    const awt = sum / (rowCount - 1);
    const atat = tat / (rowCount - 1);

    document.getElementById('inputSection').classList.add('hidden');
    document.getElementById('outputSection').classList.remove('hidden');

    displayResultTable(processes, awt, atat, ganttChart);
}

function displayResultTable(processes, awt, atat, ganttChart) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    let output = '<table>';
    output += '<tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Waiting Time</th><th>Turnaround Time</th></tr>';
    for (let i = 0; i < processes.length; i++) {
        output += `<tr><td>P${i + 1}</td><td>${processes[i].at}</td><td>${processes[i].bt}</td><td>${processes[i].wt}</td><td>${processes[i].wt + processes[i].bt}</td></tr>`;
    }
    output += '</table>';

    output += `<p class="result">The Average Waiting Time: ${awt.toFixed(2)}</p>`;
    output += `<p class="result">The Average Turnaround Time: ${atat.toFixed(2)}</p>`;

    outputDiv.innerHTML = output + ganttChart;
}

addProcessRow();
