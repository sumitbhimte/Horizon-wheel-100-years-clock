console.clear();
// array of JavaScript supported languages for local dates (not definitive)
const languageFlags = [
    { code: 'de-DE', name: 'German (Germany)', flag: '🇩🇪' },
    { code: 'el-GR', name: 'Greek (Greece)', flag: '🇬🇷' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'Marathi (India)', flag: '🇮🇳' },
    { code: 'it-IT', name: 'Italian (Italy)', flag: '🇮🇹' },
    { code: 'ja-JP', name: 'Japanese (Japan)', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean (South Korea)', flag: '🇰🇷' },
    { code: 'ro-RO', name: 'Romanian (Romania)', flag: '🇷🇴' },
    { code: 'ru-RU', name: 'Russian (Russia)', flag: '🇷🇺' },
    { code: 'zh-CN', name: 'Chinese (Simplified, China)', flag: '🇨🇳' },
];

const RADIUS = 140; // Radius of the circle for flag buttons
/*

  { code: 'zh-TW', name: 'Chinese (Traditional, Taiwan)', flag: '🇹🇼' },
*/

// map for default regions based on languageFlags
const defaultRegions = languageFlags.reduce((map, lang) => {
    const baseLang = lang.code.split('-')[0]; // Extract the base language (e.g., 'en' from 'en-US')
    if (!map[baseLang]) {
        map[baseLang] = lang.code;
    }
    return map;
}, {});

function getLocale() {
    // cet the primary language from navigator.languages or fallback to navigator.language
    let language = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';

    // not all browsers return the complete lang code so we have to add it from the mapped values
    if (language.length === 2) {
        language = defaultRegions[language] || `${language}-${language.toUpperCase()}`;
    }
    return language;
}

let locale = getLocale();

const currentLangDisplay = document.getElementById('current-lang');
const languageDialog = document.getElementById('language-dialog');
const languageOptionsContainer = document.getElementById('language-options');
const closeButton = document.getElementById('btn-dialog-close');

let horizonYear = null;
let horizonDate = null;
const horizonYearDialog = document.getElementById('horizon-year-dialog');
const horizonYearInput = document.getElementById('horizon-year');
const horizonDayInput = document.getElementById('horizon-day');
const horizonMonthInput = document.getElementById('horizon-month');
const submithorizonYear = document.getElementById('submit-horizon-year');
const btnhorizonDialogClose = document.getElementById('btn-horizon-dialog-close');
const countdownTimer = document.getElementById('countdown-timer');

const openhorizonYearDialogButton = document.getElementById('open-horizon-year-dialog');

const horizonDatePicker = document.getElementById('horizon-date-picker');

// Initialize Flatpickr
flatpickr(horizonDatePicker, {
    dateFormat: "Y-m-d",
    minDate: "2025-01-01",
    maxDate: "2100-12-31",
    appendTo: horizonDatePicker.parentElement, // Append calendar to the input field's parent element
    onOpen: function () {
        horizonYearDialog.style.zIndex = 10001; // Ensure dialog is above other elements

        // Move the calendar inside the dialog to ensure it is within the same stacking context
        const calendar = document.querySelector('.flatpickr-calendar');
        if (calendar) {
            horizonYearDialog.appendChild(calendar);
        }
    }
});

// Prevent dialog from closing when interacting with the date picker
horizonDatePicker.addEventListener('click', (event) => {
    event.stopPropagation();
});

// Show horizon year dialog on page load if not already set
window.addEventListener('load', () => {
    const savedhorizonDate = localStorage.getItem('horizonDate');
    if (savedhorizonDate) {
        horizonDate = new Date(savedhorizonDate);
        countdownTimer.style.display = 'block';
        updateCountdownTimer();
        setInterval(updateCountdownTimer, 1000);
    } else {
        horizonYearDialog.showModal();
        countdownTimer.style.display = 'none'; // Hide countdown timer initially
    }
});

// Handle horizon year dialog open button
openhorizonYearDialogButton.addEventListener('click', () => {
    horizonYearDialog.showModal();
});

// Handle horizon year submission
submithorizonYear.addEventListener('click', () => {
    const selectedDate = horizonDatePicker.value;
    if (selectedDate) {
        horizonDate = new Date(selectedDate);
        localStorage.setItem('horizonDate', horizonDate.toISOString()); // Save horizon date to local storage
        horizonYearDialog.close();
        countdownTimer.style.display = 'block'; // Show countdown timer when horizon date is set
        updateCountdownTimer();
        setInterval(updateCountdownTimer, 1000);
    } else {
        alert('Please select a valid date between 2025 and 2100');
    }
});

// Handle horizon year dialog close
btnhorizonDialogClose.addEventListener('click', () => {
    horizonYearDialog.close();
});

// Update countdown timer
function updateCountdownTimer() {
    if (!horizonDate) return;

    const now = new Date();
    const timeLeft = horizonDate - now;

    if (timeLeft <= 0) {
        countdownTimer.textContent = 'Time\'s up!';
        return;
    }

    const years = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor((timeLeft % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    countdownTimer.textContent = `Time left: ${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function drawClockFaces() {
    const clockFaces = document.querySelectorAll('.clock-face');

    // Get the current date details
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentWeekday = currentDate.getDay();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const weekdayNames = Array.from({ length: 7 }, (_, i) =>
        new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date(2021, 0, i + 3))
    );
    const monthNames = Array.from({ length: 12 }, (_, i) =>
        new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2021, i))
    );

    clockFaces.forEach(clockFace => {
        clockFace.innerHTML = '';

        const clockType = clockFace.getAttribute('data-clock');
        const numbers = parseInt(clockFace.getAttribute('data-numbers'), 10);
        const RADIUS = (clockFace.offsetWidth / 2) - 20;
        const center = clockFace.offsetWidth / 2;

        let valueSet;
        let currentValue;

        switch (clockType) {
            case 'seconds':
                valueSet = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
                currentValue = String(currentSeconds).padStart(2, '0');
                break;
            case 'minutes':
                valueSet = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
                currentValue = String(currentMinutes).padStart(2, '0');
                break;
            case 'hours':
                valueSet = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
                currentValue = String(currentHours).padStart(2, '0');
                break;
            case 'days':
                valueSet = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
                currentValue = currentDay;
                break;
            case 'months':
                valueSet = monthNames;
                currentValue = currentMonth;
                break;
            case 'years':
                valueSet = Array.from({ length: 101 }, (_, i) => 2000 + i);
                currentValue = currentYear;
                break;
            case 'day-names':
                valueSet = weekdayNames;
                currentValue = currentWeekday;
                break;
            default:
                return;
        }

        valueSet.forEach((value, i) => {
            const angle = (i * (360 / numbers));
            const x = center + RADIUS * Math.cos((angle * Math.PI) / 180);
            const y = center + RADIUS * Math.sin((angle * Math.PI) / 180);

            const element = document.createElement('span');
            element.classList.add('number');

            // Add 'dead' class to years that are past the horizon year
            if (clockType === 'years' && horizonYear && parseInt(value) >= horizonYear) {
                element.classList.add('dead');
            }

            element.textContent = value;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

            clockFace.appendChild(element);
        });

        const currentIndex = valueSet.indexOf(
            typeof valueSet[0] === 'string' ? String(currentValue) : currentValue
        );
        const rotationAngle = -((currentIndex / numbers) * 360);
        clockFace.style.transform = `rotate(${rotationAngle}deg)`;
    });
}

function rotateClockFaces() {
    const clockFaces = document.querySelectorAll('.clock-face');

    const lastAngles = {};
    function updateRotations() {
        const now = new Date();
        const currentSecond = now.getSeconds();
        const currentMinute = now.getMinutes();
        const currentHour = now.getHours();
        const currentDay = now.getDate();
        const currentMonth = now.getMonth(); // 0-indexed
        const currentYear = now.getFullYear();
        const currentWeekday = now.getDay(); // 0 = Sunday, 6 = Saturday

        clockFaces.forEach(clockFace => {
            const clockType = clockFace.getAttribute('data-clock');
            const totalNumbers = parseInt(clockFace.getAttribute('data-numbers'), 10);

            let currentValue;
            switch (clockType) {
                case 'seconds':
                    currentValue = currentSecond;
                    break;
                case 'minutes':
                    currentValue = currentMinute;
                    break;
                case 'hours':
                    currentValue = currentHour;
                    break;
                case 'days':
                    currentValue = currentDay - 1;
                    break;
                case 'months':
                    currentValue = currentMonth;
                    break;
                case 'years':
                    currentValue = currentYear - 2000;
                    break;
                case 'day-names':
                    currentValue = currentWeekday; // 0 = Sunday
                    break;
                default:
                    return;
            }

            const targetAngle = (360 / totalNumbers) * currentValue;

            // Retrieve the last angle for this clock face
            const clockId = clockFace.id || clockType;
            const lastAngle = lastAngles[clockId] || 0;

            // Adjust for shortest rotation direction
            const delta = targetAngle - lastAngle;
            const shortestDelta = ((delta + 540) % 360) - 180; // Normalize between -180 and 180

            // update the clock face rotation
            const newAngle = lastAngle + shortestDelta;
            clockFace.style.transform = `rotate(${newAngle * -1}deg)`;

            // store the new angle
            lastAngles[clockId] = newAngle;

            // "active" class
            const numbers = clockFace.querySelectorAll('.number');
            numbers.forEach((number, index) => {
                if (index === currentValue) {
                    number.classList.add('active');
                } else {
                    number.classList.remove('active');
                }
            });
        });
        // request next frame
        requestAnimationFrame(updateRotations);
    }

    updateRotations();
}

// create language options
function createLanguageOptions() {
    const centerX = languageOptionsContainer.offsetWidth / 2;
    const centerY = languageOptionsContainer.offsetHeight / 2;

    languageFlags.forEach((lang, index, arr) => {
        const angle = (index / arr.length) * 2 * Math.PI;
        const x = centerX + RADIUS * Math.cos(angle);
        const y = centerY + RADIUS * Math.sin(angle);

        const radioWrapper = document.createElement('label');
        radioWrapper.title = lang.name;
        radioWrapper.style.left = `${x}px`;
        radioWrapper.style.top = `${y}px`;

        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'language';
        radioInput.value = lang.code;

        if (lang.code === locale) {
            radioInput.checked = true;
            radioWrapper.classList.add('active');
        }

        const flag = document.createElement('span');
        flag.classList.add('flag-icon');
        flag.innerText = lang.flag;

        radioWrapper.appendChild(radioInput);
        radioWrapper.appendChild(flag);
        languageOptionsContainer.appendChild(radioWrapper);

        // Handle hover: display language name in the center of the parent container
        radioWrapper.addEventListener('mouseover', () => showTitle(lang.name, radioWrapper));
        radioWrapper.addEventListener('mouseleave', () => hideTitle());

        radioInput.addEventListener('change', () => {
            locale = radioInput.value;
            setCurrentLangDisplay(lang);
            drawClockFaces();
            document.querySelector('label.active')?.classList.remove('active');
            radioWrapper.classList.add('active');
            closeDialog();
        });
    });
}


// Show title (language name) in the center
let titleDisplay = null; // Declare titleDisplay globally for reuse
function showTitle(languageName) {
    if (titleDisplay) {
        titleDisplay.remove();
    }
    titleDisplay = document.createElement('div');
    titleDisplay.classList.add('language-title');
    titleDisplay.textContent = languageName;  // Update the title with the language name
    languageOptionsContainer.appendChild(titleDisplay);


}
function hideTitle() {
    if (titleDisplay) {
        titleDisplay.textContent = '';
    }
}
// Set current language display button flag and title
function setCurrentLangDisplay(lang) {
    currentLangDisplay.textContent = lang.flag;
    currentLangDisplay.title = lang.name;
    showTitle(lang.name)
}
function openDialog() {
    languageDialog.showModal();
    createLanguageOptions();
    addDialogCloseListener();
}
function closeDialog() {
    languageDialog.close();
    removeLanguageOptions();
    removeDialogCloseListener();
}
function removeLanguageOptions() {
    languageOptionsContainer.innerHTML = '';
}
function addDialogCloseListener() {
    languageDialog.addEventListener('click', closeDialogOnClickOutside);
}
function removeDialogCloseListener() {
    languageDialog.removeEventListener('click', closeDialogOnClickOutside);
}
function closeDialogOnClickOutside(e) {
    if (e.target === languageDialog) {
        closeDialog();
    }
}

// dialog close button event
closeButton.addEventListener('click', closeDialog);

// current language display - open dialog with lang buttons
currentLangDisplay.addEventListener('click', openDialog);
//console.log(locale);

// initalize
drawClockFaces();
rotateClockFaces();
setCurrentLangDisplay(languageFlags.find(lang => lang.code === locale));