const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

const TODAY = new Date();
const MINYEAR = 1920;
const MAXYEAR = TODAY.getFullYear(); //get latest year
const WEEKDAYCOUNT = 7;

// submit to server
let date;

let calendar = document.getElementById('calendar');
let bg_collider = document.getElementById('bg-collider');
let year_list = document.getElementById('calendar-year');
let month_list = document.getElementById('calendar-month');
let date_list = document.getElementById('calendar-dates');
let date_display = document.getElementById('date');

let date_value = document.getElementById('date_value');
date_value.value = TODAY.getDate();

// call all make calendar functions
document.addEventListener('DOMContentLoaded', () => {
    makeYear();
    makeMonth();
    makeDate();
    selectDate();
    bg_collider.style.display = 'none';

    date_display.addEventListener('click', () => {
        if (window.getComputedStyle(calendar).getPropertyValue('display') === 'none') {
            calendar.style.display = 'block';
            bg_collider.style.display = 'block';
        }
    });

    document.getElementById('close-button').addEventListener('click', () => {
        closeElement(calendar);
    });
    document.getElementById('bg-collider').addEventListener('click', () => {
        closeElement(calendar);
    });

    document.getElementById('year-left').addEventListener('click', () => {
        if (year_list.value > MINYEAR)
            year_list.value--;
        updateDates();
    });
    document.getElementById('year-right').addEventListener('click', () => {
        if (year_list.value < MAXYEAR)
            year_list.value++;
        updateDates();
    });
    document.getElementById('month-left').addEventListener('click', () => {
        if (month_list.value > 1)
            month_list.value--;
        updateDates();
    });
    document.getElementById('month-right').addEventListener('click', () => {
        if (month_list.value < 12)
            month_list.value++;
        updateDates();
    });

    year_list.addEventListener('change', () => {
        updateDates()
    });
    month_list.addEventListener('change', () => {
        updateDates()
    });
});

function selectDate() {
    date = document.querySelector('.active-date');
    Array.from(document.getElementById('calendar-dates').children).forEach((e) => {
        e.querySelectorAll('.active').forEach((f) => {
            f.addEventListener('click', () => {
                closeElement(calendar);
                if (date) {
                    date.classList.remove('active-date');
                }
                date = f;
                date.classList.add('active-date');
                date_value.value = date.innerHTML;
                date_display.value = `${date_value.value}/${month_list.value}/${year_list.value}`;
            });
        });
    });
    date_display.value = `${date_value.value}/${month_list.value}/${year_list.value}`;

    // delete table row AJAX
    Array.from(document.querySelectorAll('.bday-row')).forEach((row) => {
        row.querySelector('.rm-row').addEventListener('click', async () => {
            let del_req = await fetch('/delete?id=' + row.id);
            let response = await del_req;
            if (response.status == 204) {
                row.remove();
            } else {
                console.log("unable to delete data");
            }
        })
    });
}

function closeElement(element) {
    if (window.getComputedStyle(element).getPropertyValue('display') === 'block') {
        element.style.display = 'none';
        bg_collider.style.display = 'none';
    }
}

// update dates
function updateDates() {
    makeDate();
    selectDate();
}

// make calendar years
function makeYear() {
    for (let i = 0; i < MAXYEAR - MINYEAR + 1; i++) {
        year_list.innerHTML += `<option value='${MINYEAR + i}'>${MINYEAR+i}</option>`;
    }
    year_list.value = MAXYEAR;
}

// make calendar months
function makeMonth() {
    for (let i = 0; i < 12; i++) {
        month_list.innerHTML += `<option value='${i+1}'>${months[i]}</option>`;
    }
    month_list.value = `${TODAY.getMonth() + 1}`;
}

// make calendar dates
function makeDate() {
    let row_count = 0;
    let week_day = new Date(year_list.value, month_list.value - 1, 01).getDay();
    let current_day_count = new Date(year_list.value, month_list.value, 0).getDate();
    let last_date_count = new Date(year_list.value, month_list.value - 1, 0).getDate();

    date_list.innerHTML = "<ul class='calendar-row list-inline element-justified'></ul>";
    let row = date_list.querySelector('ul');
    for (let i = 0; i < week_day; i++) {
        row.innerHTML += `<li type='button' class='disabled'>${last_date_count + i - week_day + 1}</li>`;
    }
    for (let i = 0; i < current_day_count; i++) {
        if (week_day > 6) {
            week_day = 0;
            row_count++;
            date_list.innerHTML += "<ul class='calendar-row list-inline element-justified'></ul>";
            row = date_list.children[row_count];
        }
        if (i + 1 == date_value.value)
            row.innerHTML += `<li type='button' class='active active-date' id='${i + 1}'>${i + 1}</li>`;
        else
            row.innerHTML += `<li type='button' class='active' id='${i + 1}'>${i + 1}</li>`;
        week_day++;
    }
    if (week_day != 6) {
        for (i = 0; i < 7 - week_day; i++) {
            row.innerHTML += `<li type='button' class='disabled'>${i + 1}</li>`;
        }
    }
}
