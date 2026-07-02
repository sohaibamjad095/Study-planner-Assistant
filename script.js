let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

function addSubject(){

    const subjectInput = document.getElementById("subjectInput");
    const dateInput = document.getElementById("dateInput");

    const subject = subjectInput.value.trim();
    const examDate = dateInput.value;

    if(!subject || !examDate){
        alert("Enter subject and date");
        return;
    }

    const today = new Date();
    const exam = new Date(examDate);

    const daysLeft = Math.ceil(
        (exam - today) / (1000 * 60 * 60 * 24)
    );

let priority = "Low";

if(daysLeft < 0){
    priority = "Overdue";
} else if(daysLeft <= 5){
    priority = "High";
} else if(daysLeft <= 10){
    priority = "Medium";
}

    if(daysLeft <= 5){
        priority = "High";
    } else if(daysLeft <= 10){
        priority = "Medium";
    }

    subjects.push({
        subject,
        examDate,
        daysLeft,
        priority,
        completed:false
    });

    saveData();
    displaySubjects();
    updateProgress();

    subjectInput.value = "";
    dateInput.value = "";
}
const emptyState = document.getElementById("emptyState");
if(subjects.length === 0){
    emptyState.style.display = "block";
} else {
    emptyState.style.display = "none";
}
function displaySubjects(){

    const subjectList = document.getElementById("subjectList");
    subjectList.innerHTML = "";

    subjects.forEach((subject,index) => {

        const card = document.createElement("div");
        card.classList.add("subject-card");
        card.classList.add(subject.priority.toLowerCase());

        card.innerHTML = `
            <h3>${subject.subject}</h3>

            <p>Exam Date: ${subject.examDate}</p>

            <p>Days Left: ${subject.daysLeft}</p>

            <p>Priority: ${subject.priority}</p>

            <p>Status: ${subject.completed ? "✅ Completed" : "⏳ Pending"}</p>

            <button onclick="completeTask(${index})">Complete</button>
            <button onclick="deleteTask(${index})">Delete</button>
        `;

        subjectList.appendChild(card);
    });
}

function deleteTask(index){
    subjects.splice(index,1);
    saveData();
    displaySubjects();
    updateProgress();
}

function completeTask(index){

    subjects[index].completed = true;

    let streak =
        Number(localStorage.getItem("studyStreak")) || 0;

    streak++;

    localStorage.setItem(
        "studyStreak",
        streak
    );

    saveData();

    displaySubjects();

    updateProgress();

    updateStreak();
    updateWeeklyAnalytics();
}

function updateProgress(){

    const total = subjects.length;

    const completed = subjects.filter(s => s.completed).length;

    const pending = total - completed;

    let progress = 0;

    if(total > 0){
        progress = Math.round((completed / total) * 100);
    }

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("progressText").textContent =
        "Progress: " + progress + "%";

    document.getElementById("progressBar").style.width =
        progress + "%";
}

function saveData(){
    localStorage.setItem("subjects", JSON.stringify(subjects));
}

function toggleDarkMode(){
    document.body.classList.toggle("dark-mode");
}

function resetAll(){

    if(confirm("Are you sure you want to delete all tasks?")){
        subjects = [];
        saveData();
        displaySubjects();
        updateProgress();
    }
}

function askAssistant(){

    const response = document.getElementById("assistantResponse");

    const pending = subjects.filter(s => !s.completed);

    if(pending.length === 0){
        response.textContent = "Excellent work! All tasks completed.";
        return;
    }

    pending.sort((a,b) => new Date(a.examDate) - new Date(b.examDate));

    response.textContent =
        `Focus on ${pending[0].subject} first because its exam is approaching.`;
}

displaySubjects();
updateProgress();
function searchSubjects(){

    const input = document.getElementById("searchInput").value.toLowerCase();

    const cards = document.querySelectorAll(".subject-card");

    cards.forEach(card => {

        const text = card.innerText.toLowerCase();

        if(text.includes(input)){
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });
}
function sortByDate(){

    subjects.sort((a,b) =>
        new Date(a.examDate) - new Date(b.examDate)
    );

    displaySubjects();
}

function sortByPriority(){

    const order = {
        "High": 1,
        "Medium": 2,
        "Low": 3,
        "Overdue": 0
    };

    subjects.sort((a,b) =>
        order[a.priority] - order[b.priority]
    );

    displaySubjects();
}
displaySubjects();
saveData();
updateProgress();
function updateWeeklyAnalytics(){

    const el =
        document.getElementById("weeklyStats");

    if(!el) return;

    const completed =
        subjects.filter(s => s.completed).length;

    el.textContent =
        completed + " Tasks Completed";
}
updateWeeklyAnalytics();
let timer = null;
let timeLeft = 25 * 60;

function updateTimer(){
    const el = document.getElementById("timer");
    if(!el) return;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    el.textContent =
        `${minutes}:${seconds.toString().padStart(2,"0")}`;
}
function startPomodoro(){

    clearInterval(timer);

    timer = setInterval(() => {

        if(timeLeft > 0){
            timeLeft--;
            updateTimer();
        }

    },1000);
}

function pausePomodoro(){
    clearInterval(timer);
}

function resetPomodoro(){
    clearInterval(timer);
    timeLeft = 25 * 60;
    updateTimer();
}

updateTimer();
function updateStreak(){

    const el =
        document.getElementById("streakCount");

    if(!el) return; // prevents crash

    let streak =
        Number(localStorage.getItem("studyStreak")) || 0;

    el.textContent = streak + " Days";
}
updateStreak();
updateWeeklyAnalytics();
updateTimer();