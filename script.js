class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.displayDate = new Date();
        this.events = {
            "2025-10-15": [{"title": "Team Meeting", "time": "10:00", "type": "work"}],
            "2025-10-20": [{"title": "Doctor Appointment", "time": "14:00", "type": "personal"}],
            "2025-10-25": [{"title": "Birthday Party", "time": "18:00", "type": "celebration"}]
        };

        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

        this.init();
    }

    init() {
        this.populateYearDropdown();
        this.bindEvents();
        this.updateCalendar();
        this.updateCurrentDateDisplay();
        this.updateDropdownHighlights();
    }

    populateYearDropdown() {
        const yearDropdown = document.getElementById('yearDropdown');
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 50;
        const endYear = currentYear + 50;

        yearDropdown.innerHTML = '';

        for (let year = startYear; year <= endYear; year++) {
            const yearItem = document.createElement('button');
            yearItem.className = 'dropdown-item';
            yearItem.textContent = year;
            yearItem.dataset.year = year;

            if (year === this.displayDate.getFullYear()) {
                yearItem.classList.add('current');
            }

            yearDropdown.appendChild(yearItem);
        }
    }

    updateDropdownHighlights() {
        
        document.querySelectorAll('#monthDropdown .dropdown-item').forEach(btn => {
            btn.classList.remove('current');
            if (parseInt(btn.dataset.month) === this.displayDate.getMonth()) {
                btn.classList.add('current');
            }
        });

       
        document.querySelectorAll('#yearDropdown .dropdown-item').forEach(btn => {
            btn.classList.remove('current');
            if (parseInt(btn.dataset.year) === this.displayDate.getFullYear()) {
                btn.classList.add('current');
            }
        });
    }

    bindEvents() {
    
        document.getElementById('prevMonth').addEventListener('click', () => this.previousMonth());
        document.getElementById('nextMonth').addEventListener('click', () => this.nextMonth());

  
        const monthYearDisplay = document.getElementById('monthYearDisplay');
        const monthDropdown = document.getElementById('monthDropdown');

        monthYearDisplay.addEventListener('click', (e) => {
            e.stopPropagation();
            monthDropdown.classList.toggle('show');
            document.getElementById('yearDropdown').classList.remove('show');
        });

        
        const currentYear = document.getElementById('currentYear');
        const yearDropdown = document.getElementById('yearDropdown');

        currentYear.addEventListener('click', (e) => {
            e.stopPropagation();
            yearDropdown.classList.toggle('show');
            monthDropdown.classList.remove('show');

         
            const currentYearItem = yearDropdown.querySelector('.current');
            if (currentYearItem) {
                currentYearItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        document.querySelectorAll('#monthDropdown .dropdown-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const monthIndex = parseInt(e.target.dataset.month);
                this.displayDate.setMonth(monthIndex);
                this.selectedDate = null;
                this.updateCalendar();
                this.updateCurrentDateDisplay();
                this.updateDropdownHighlights();
                monthDropdown.classList.remove('show');
            });
        });

      
        document.addEventListener('click', (e) => {
            if (e.target.matches('#yearDropdown .dropdown-item')) {
                e.stopPropagation();
                const year = parseInt(e.target.dataset.year);
                this.displayDate.setFullYear(year);
                this.selectedDate = null;
                this.updateCalendar();
                this.updateCurrentDateDisplay();
                this.updateDropdownHighlights();
                yearDropdown.classList.remove('show');
            }
        });

     
        document.addEventListener('click', () => {
            monthDropdown.classList.remove('show');
            yearDropdown.classList.remove('show');
        });

        
        const mobileToggle = document.getElementById('mobileMenuToggle');
        mobileToggle.addEventListener('click', () => {
          
            monthDropdown.classList.remove('show');
            yearDropdown.classList.remove('show');
        });

       
        document.getElementById('addEventBtn').addEventListener('click', () => {
            this.openEventModal();
        });

        document.getElementById('eventForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal('eventModal');
        });

        document.getElementById('cancelEvent').addEventListener('click', () => {
            this.closeModal('eventModal');
        });

        document.getElementById('closeViewModal').addEventListener('click', () => {
            this.closeModal('viewEventModal');
        });

        document.getElementById('addEventToDate').addEventListener('click', () => {
            this.closeModal('viewEventModal');
            this.openEventModal(this.selectedDate);
        });

        document.addEventListener('click', (e) => {
            const modals = document.querySelectorAll('.modal:not(.hidden)');
            modals.forEach(modal => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
           
                monthDropdown.classList.remove('show');
                yearDropdown.classList.remove('show');

          
                const openModal = document.querySelector('.modal:not(.hidden)');
                if (openModal) {
                    this.closeModal(openModal.id);
                }
            }
        });
    }

    updateCalendar() {
        const year = this.displayDate.getFullYear();
        const month = this.displayDate.getMonth();

        document.getElementById('monthYearDisplay').textContent = `${this.months[month]} ${year}`;
        document.getElementById('currentYear').textContent = year.toString();

        this.generateCalendarDays();
    }

    generateCalendarDays() {
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        const year = this.displayDate.getFullYear();
        const month = this.displayDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const prevMonth = new Date(year, month - 1, 0);
        const daysInPrevMonth = prevMonth.getDate();


        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayNum = daysInPrevMonth - i;
            const dayCell = this.createDayCell(dayNum, true, new Date(year, month - 1, dayNum));
            calendarDays.appendChild(dayCell);
        }

      
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const dayCell = this.createDayCell(day, false, currentDate);
            calendarDays.appendChild(dayCell);
        }

     
        const totalCells = calendarDays.children.length;
        const remainingCells = 42 - totalCells;

        for (let day = 1; day <= remainingCells; day++) {
            const dayCell = this.createDayCell(day, true, new Date(year, month + 1, day));
            calendarDays.appendChild(dayCell);
        }
    }

    createDayCell(dayNum, isOtherMonth, date) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = dayNum;

        if (isOtherMonth) {
            dayCell.classList.add('other-month');
        }

        const isToday = this.isSameDay(date, this.currentDate);
        if (isToday) {
            dayCell.classList.add('today');
        }

        const isSelected = this.selectedDate && this.isSameDay(date, this.selectedDate);
        if (isSelected) {
            dayCell.classList.add('selected');

            if (isToday) {
                dayCell.classList.add('today-selected');
            }
        }

        const dateStr = this.formatDateKey(date);
        if (this.events[dateStr] && this.events[dateStr].length > 0) {
            dayCell.classList.add('has-events');
        }

        dayCell.addEventListener('click', () => {
            if (isOtherMonth) {
                if (dayNum > 15) {
                    this.previousMonth();
                } else {
                    this.nextMonth();
                }
                this.selectedDate = date;
                this.updateCurrentDateDisplay();
            } else {
                this.selectDate(date);
            }
        });

        dayCell.addEventListener('dblclick', () => {
            if (!isOtherMonth) {
                this.openEventModal(date);
            }
        });

        dayCell.dataset.date = dateStr;

        return dayCell;
    }

    selectDate(date) {
        document.querySelectorAll('.day-cell.selected').forEach(cell => {
            cell.classList.remove('selected', 'today-selected');
        });

        this.selectedDate = new Date(date);

        const dateStr = this.formatDateKey(date);
        const dayCell = document.querySelector(`[data-date="${dateStr}"]`);
        if (dayCell && !dayCell.classList.contains('other-month')) {
            dayCell.classList.add('selected');

            if (dayCell.classList.contains('today')) {
                dayCell.classList.add('today-selected');
            }
        }

        if (this.events[dateStr] && this.events[dateStr].length > 0) {
            this.showEventModal(date);
        }

        this.updateCurrentDateDisplay();
    }

    updateCurrentDateDisplay() {
        let displayDate;

        if (this.selectedDate) {
            displayDate = this.selectedDate;
        } else {
            displayDate = new Date(this.displayDate.getFullYear(), this.displayDate.getMonth(), 1);
        }

        const options = { month: 'short', day: 'numeric', weekday: 'short' };
        const dateStr = displayDate.toLocaleDateString('en-US', options);
        document.getElementById('currentDateText').textContent = dateStr;
    }

    previousMonth() {
        this.displayDate.setMonth(this.displayDate.getMonth() - 1);
        this.selectedDate = null;
        this.updateCalendar();
        this.updateCurrentDateDisplay();
        this.updateDropdownHighlights();
    }

    nextMonth() {
        this.displayDate.setMonth(this.displayDate.getMonth() + 1);
        this.selectedDate = null;
        this.updateCalendar();
        this.updateCurrentDateDisplay();
        this.updateDropdownHighlights();
    }

    openEventModal(date = null) {
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');

        if (date) {
            this.selectedDate = new Date(date);
            modalTitle.textContent = `Add Event for ${date.toLocaleDateString()}`;
        } else if (this.selectedDate) {
            modalTitle.textContent = `Add Event for ${this.selectedDate.toLocaleDateString()}`;
        } else {
            modalTitle.textContent = 'Add Event';
        }

        document.getElementById('eventForm').reset();
        modal.classList.remove('hidden');
    }

    showEventModal(date) {
        const modal = document.getElementById('viewEventModal');
        const dateElement = document.getElementById('viewEventDate');
        const eventsList = document.getElementById('eventsList');

        dateElement.textContent = date.toLocaleDateString();

        const dateStr = this.formatDateKey(date);
        const events = this.events[dateStr] || [];

        eventsList.innerHTML = '';

        if (events.length === 0) {
            eventsList.innerHTML = '<p>No events for this date.</p>';
        } else {
            events.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';

                const time = event.time ? this.formatTime(event.time) : '';

                eventItem.innerHTML = `
                    <h4>${event.title}</h4>
                    ${time ? `<p>Time: ${time}</p>` : ''}
                    <span class="event-type ${event.type}">${event.type}</span>
                `;

                eventsList.appendChild(eventItem);
            });
        }

        modal.classList.remove('hidden');
    }

    saveEvent() {
        const title = document.getElementById('eventTitle').value.trim();
        const time = document.getElementById('eventTime').value;
        const type = document.getElementById('eventType').value;

        if (!title) {
            alert('Please enter an event title');
            return;
        }

        if (!this.selectedDate) {
            alert('Please select a date');
            return;
        }

        const dateStr = this.formatDateKey(this.selectedDate);

        if (!this.events[dateStr]) {
            this.events[dateStr] = [];
        }

        this.events[dateStr].push({
            title: title,
            time: time,
            type: type
        });

        this.updateCalendar();
        this.closeModal('eventModal');
        this.showNotification('Event added successfully!');
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('hidden');
    }

    showNotification(message) {
        alert(message);
    }

    formatDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatTime(timeStr) {
        if (!timeStr) return '';

        const [hours, minutes] = timeStr.split(':');
        const hour24 = parseInt(hours);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const ampm = hour24 >= 12 ? 'PM' : 'AM';

        return `${hour12}:${minutes} ${ampm}`;
    }

    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CalendarApp();
});

window.addEventListener('resize', () => {
    
    document.getElementById('monthDropdown').classList.remove('show');
    document.getElementById('yearDropdown').classList.remove('show');
});
