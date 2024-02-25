import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startBtn = document.querySelector('button');
startBtn.disabled = true;
const pickingDate = document.querySelector('#datetime-picker');

const daysClock = document.querySelector('[data-days]');
const hoursClock = document.querySelector('[data-hours]');
const minutesClock = document.querySelector('[data-minutes]');
const secondsClock = document.querySelector('[data-seconds]');

let timerID = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: selectedDates => {
    if (selectedDates[0] < options.defaultDate) {
      Notiflix.Notify.failure('Please choose a date in the future');
    } else {
      startBtn.disabled = false;
    }
  },
};

const fp = flatpickr(pickingDate, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function actualClock() {
  const choosenDate = fp.selectedDates[0];
  const currentDate = new Date();
  const timeDifference = choosenDate - currentDate;

  if (timeDifference <= 0) {
    clearInterval(timer);
    daysClock.textContent = '00';
    hoursClock.textContent = '00';
    minutesClock.textContent = '00';
    secondsClock.textContent = '00';
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDifference);

  daysClock.textContent = addLeadingZero(days);
  hoursClock.textContent = addLeadingZero(hours);
  minutesClock.textContent = addLeadingZero(minutes);
  secondsClock.textContent = addLeadingZero(seconds);
}

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  pickingDate.disabled = true;
  const selectedDates = fp.selectedDates;
  actualClock(selectedDates[0]);
  timerID = setInterval(actualClock, 1000);
});
