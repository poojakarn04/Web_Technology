class Process1 {
    constructor(at, bt) {
        this.at = at;
        this.bt = bt;
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
    let wtSum = 0,
        sum = 0,
        tatSum = 0;
    const arrivalTimes = new Set();

    // taking elements arrival and burst time from the table
    for (let i = 1; i < rowCount; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        processes.push(new Process1(arrivalTime, burstTime));
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

    // Pooja's code algorithm
    for (let i = 0; i < rowCount - 1; i++) {
        if (i === 0) {
            wtSum = 0;
        } else {
            wtSum += processes[i - 1].bt;
        }
        processes[i].wt = wtSum - processes[i].at;
        sum += processes[i].wt;
        tatSum += wtSum + processes[i].bt - processes[i].at;
    }
    const awt = sum / (rowCount - 1);
    const atat = tatSum / (rowCount - 1);

    // Hide input section, show output section
    document.getElementById('inputSection').classList.add('hidden');
    document.getElementById('outputSection').classList.remove('hidden');

    // Display results in a table
    displayResultTable(processes, awt, atat);
}

function displayResultTable(processes, awt, atat) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    let output = '<table>';
    output += '<tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Waiting Time</th><th>Turnaround Time</th><th>Complete Time</th></tr>';
    for (let i = 0; i < processes.length; i++) {
        output += `<tr><td>P${i + 1}</td><td>${processes[i].at}</td><td>${processes[i].bt}</td><td>${processes[i].wt}</td><td>${processes[i].wt + processes[i].bt}</td><td>${calculateCompleteTime(processes, i)}</td></tr>`;
    }
    output += '</table>';

    // Display Gantt Chart
    let ganttChart = '<div class="gantt">';
    let currentTime = 0;
    for (let i = 0; i < processes.length; i++) {
        ganttChart += `<div class="bar" style="width:${processes[i].bt * 20}px;">P${i + 1}<br/>(${calculateCompleteTime(processes, i)})</div>`;
        currentTime += processes[i].bt;
    }
    ganttChart += '</div>';

    // Display the result table and averages
    output += `<p class="result">The Average Waiting Time: ${awt.toFixed(2)}</p>`;
    output += `<p class="result">The Average Turnaround Time: ${atat.toFixed(2)}</p>`;
    output += '<br><h3>Gantt Chart :</h3>';
    outputDiv.innerHTML = output + ganttChart;
}

function calculateCompleteTime(processes, index) {
    let completeTime = 0;
    for (let i = 0; i <= index; i++) {
        completeTime += processes[i].bt;
    }
    return completeTime;
}

// To call the function to add process
addProcessRow();
