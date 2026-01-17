function openFeatures() {
    var allElems = document.querySelectorAll('.elem')
    var fullElemPage = document.querySelectorAll('.fullElem')
    var fullElemPageBackBtn = document.querySelectorAll('.fullElem .back')

    allElems.forEach(function (elem) {
        elem.addEventListener('click', function () {
            fullElemPage[elem.id].style.display = 'block'
        })
    })

    fullElemPageBackBtn.forEach(function (back) {
        back.addEventListener('click', function () {
            fullElemPage[back.id].style.display = 'none'
        })
    })
}

openFeatures()


function todoList() {

    var currentTask = []

    if (localStorage.getItem('currentTask')) {
        currentTask = JSON.parse(localStorage.getItem('currentTask'))
    } else {
        console.log('Task list is Empty');
    }



    function renderTask() {

        var allTask = document.querySelector('.allTask')

        var sum = ''

        currentTask.forEach(function (elem, idx) {
           sum += `
<div class="task">
    <div class="task-text">
        <h5>
            ${elem.task}
            <span class="${elem.imp ? 'true' : 'false'}">imp</span>
        </h5>
        <p>${elem.details || ''}</p>
    </div>
    <button id="${idx}">Done</button>
</div>
`

        })

        allTask.innerHTML = sum

        localStorage.setItem('currentTask', JSON.stringify(currentTask))

        document.querySelectorAll('.task button').forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentTask.splice(btn.id, 1)
                renderTask()
            })
        })
    }
    renderTask()

    let form = document.querySelector('.addTask form')
    let taskInput = document.querySelector('.addTask form #task-input')
    let taskDetailsInput = document.querySelector('.addTask form textarea')
    let taskCheckbox = document.querySelector('.addTask form #check')

    form.addEventListener('submit', function (e) {
        e.preventDefault()
        currentTask.push(
            {
                task: taskInput.value,
                details: taskDetailsInput.value,
                imp: taskCheckbox.checked
            }
        )
        renderTask()

        taskCheckbox.checked = false
        taskInput.value = ''
        taskDetailsInput.value = ''
    })



}

todoList()


function dailyPlanner() {
    var dayPlanner = document.querySelector('.day-planner')

    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}

    var hours = Array.from({ length: 18 }, (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`)


    var wholeDaySum = ''
    hours.forEach(function (elem, idx) {

        var savedData = dayPlanData[idx] || ''

        wholeDaySum = wholeDaySum + `<div class="day-planner-time">
    <p>${elem}</p>
    <input id=${idx} type="text" placeholder="..." value=${savedData}>
</div>`
    })

    dayPlanner.innerHTML = wholeDaySum


    var dayPlannerInput = document.querySelectorAll('.day-planner input')

    dayPlannerInput.forEach(function (elem) {
        elem.addEventListener('input', function () {
            console.log('hello');
            dayPlanData[elem.id] = elem.value

            localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData))
        })
    })
}

dailyPlanner()


function motivationalQuote() {
    var motivationQuoteContent = document.querySelector('.motivation-2 h1')
    var motivationAuthor = document.querySelector('.motivation-3 h2')

    async function fetchQuote() {
        try {
            let response = await fetch('https://api.quotable.io/quotes/random')
            let data = await response.json()

            motivationQuoteContent.innerHTML = data[0].content
            motivationAuthor.innerHTML = `— ${data[0].author}`
        } catch (err) {
            motivationQuoteContent.innerHTML = "Stay focused. Keep building."
            motivationAuthor.innerHTML = "— Productivity Dashboard"
        }
    }

    fetchQuote()
}


motivationalQuote()


function pomodoroTimer() {


    let timer = document.querySelector('.pomo-timer h1')
    var startBtn = document.querySelector('.pomo-timer .start-timer')
    var pauseBtn = document.querySelector('.pomo-timer .pause-timer')
    var resetBtn = document.querySelector('.pomo-timer .reset-timer')
    var session = document.querySelector('.pomodoro-fullpage .session')
    var isWorkSession = true

    let totalSeconds = 25 * 60
    let timerInterval = null

    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = totalSeconds % 60

        timer.innerHTML = `${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')}`
    }

    function startTimer() {
        clearInterval(timerInterval)

        if (isWorkSession) {

            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = false
                    clearInterval(timerInterval)
                    timer.innerHTML = '05:00'
                    session.innerHTML = 'Take a Break'
                    session.style.backgroundColor = 'var(--blue)'
                    totalSeconds = 5 * 60
                }
            }, 1000)
        } else {


            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = true
                    clearInterval(timerInterval)
                    timer.innerHTML = '25:00'
                    session.innerHTML = 'Work Session'
                    session.style.backgroundColor = 'var(--green)'
                    totalSeconds = 25 * 60
                }
            }, 1000)
        }

    }

    function pauseTimer() {
        clearInterval(timerInterval)
    }
    function resetTimer() {
        totalSeconds = 25 * 60
        clearInterval(timerInterval)
        updateTimer()

    }
    startBtn.addEventListener('click', startTimer)
    pauseBtn.addEventListener('click', pauseTimer)
    resetBtn.addEventListener('click', resetTimer)



}

pomodoroTimer()



function weatherFunctionality() {


    // I have removed API key for security purpose
    var apiKey = null
    var city = 'Surat'



    var header1Time = document.querySelector('.header1 h1')
    var header1Date = document.querySelector('.header1 h2')
    var header2Temp = document.querySelector('.header2 h2')
    var header2Condition = document.querySelector('.header2 h4')
    var precipitation = document.querySelector('.header2 .precipitation')
    var humidity = document.querySelector('.header2 .humidity')
    var wind = document.querySelector('.header2 .wind')

    var data = null

    async function weatherAPICall() {
        var response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
        data = await response.json()

        header2Temp.innerHTML = `${data.current.temp_c}°C`
        header2Condition.innerHTML = `${data.current.condition.text}`
        wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`
        humidity.innerHTML = `Humidity: ${data.current.humidity}%`
        precipitation.innerHTML = `Heat Index : ${data.current.heatindex_c}%`
    }

    weatherAPICall()


    function timeDate() {
        const totalDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var date = new Date()
        var dayOfWeek = totalDaysOfWeek[date.getDay()]
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var tarik = date.getDate()
        var month = monthNames[date.getMonth()]
        var year = date.getFullYear()

        header1Date.innerHTML = `${tarik} ${month}, ${year}`

        if (hours > 12) {
            header1Time.innerHTML = `${dayOfWeek}, ${String(hours - 12).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} PM`

        } else {
            header1Time.innerHTML = `${dayOfWeek}, ${String(hours).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} AM`
        }
    }

    setInterval(() => {
        timeDate()
    }, 1000);

}

weatherFunctionality()
function updateCardImages(theme) {
    document.querySelectorAll('.elem img').forEach(img => {
        if (theme === 'dark') {
            img.src = img.dataset.dark
        } else {
            img.src = img.dataset.light
        }
    })
}



function changeTheme() {

    const toggle = document.getElementById('themeToggle')
    const rootElement = document.documentElement

    let currentTheme = localStorage.getItem('theme') || 'dark'

    function applyTheme(mode) {

        if (mode === 'dark') {
            rootElement.classList.add('dark-theme')
            rootElement.classList.remove('light-theme')

            rootElement.style.setProperty('--pri', '#F8F4E1')
            rootElement.style.setProperty('--sec', '#0b0b0b')
            rootElement.style.setProperty('--tri1', '#948979')
            rootElement.style.setProperty('--tri2', '#393E46')
            rootElement.style.setProperty('--page-bg', '#0b0b0b')

            toggle.checked = false
        } 
        else {
            rootElement.classList.add('light-theme')
            rootElement.classList.remove('dark-theme')

            rootElement.style.setProperty('--pri', '#111111')
            rootElement.style.setProperty('--sec', '#FFFFFF')
            rootElement.style.setProperty('--tri1', '#2563EB')
            rootElement.style.setProperty('--tri2', '#F1F5F9')
            rootElement.style.setProperty('--page-bg', '#eef3ff')

            toggle.checked = true
        }

        // 🔥 SAVE THEME
        localStorage.setItem('theme', mode)

        // 🔥 VERY IMPORTANT
        updateCardImages(mode)
    }

    // 🔥 PAGE LOAD PE APPLY
    applyTheme(currentTheme)

    // 🔥 TOGGLE CHANGE
    toggle.addEventListener('change', function () {
        currentTheme = toggle.checked ? 'light' : 'dark'
        applyTheme(currentTheme)
    })
}

changeTheme()

function dailyGoals() {

    const goalInput = document.getElementById('goalInput')
    const addGoalBtn = document.getElementById('addGoalBtn')
    const goalsList = document.getElementById('goalsList')

    let goals = JSON.parse(localStorage.getItem('dailyGoals')) || []

    function renderGoals() {
        goalsList.innerHTML = ''

        goals.forEach((goal, index) => {
            const div = document.createElement('div')
            div.className = `goal-item ${goal.done ? 'completed' : ''}`

            div.innerHTML = `
                <div class="goal-left">
                    <input type="checkbox" ${goal.done ? 'checked' : ''} data-id="${index}">
                    <span>${goal.text}</span>
                </div>

                <div class="goal-actions">
                    <span class="goal-status">
                        ${goal.done ? 'Completed' : 'Pending'}
                    </span>
                    <button class="goal-remove" data-id="${index}">🗑</button>
                </div>
            `

            goalsList.appendChild(div)
        })

        localStorage.setItem('dailyGoals', JSON.stringify(goals))

        /* checkbox */
        document.querySelectorAll('.goal-left input').forEach(cb => {
            cb.addEventListener('change', () => {
                goals[cb.dataset.id].done = cb.checked
                renderGoals()
            })
        })

        /* remove button */
        document.querySelectorAll('.goal-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                goals.splice(btn.dataset.id, 1)
                renderGoals()
            })
        })
    }

    addGoalBtn.addEventListener('click', () => {
        if (goalInput.value.trim() === '') return

        goals.push({
            text: goalInput.value.trim(),
            done: false
        })

        goalInput.value = ''
        renderGoals()
    })

    renderGoals()
}

dailyGoals()







window.onload = () => {
    document.querySelectorAll('.fullElem').forEach(p => {
        p.style.display = 'none'
    })
}
