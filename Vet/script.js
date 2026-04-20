// Registration State
let currentStep = 1;
let selectedPetType = null;
let registrationData = {
    owner: {},
    pet: {}
};

// Booking State
let selectedDate = null;
let selectedService = null;
let selectedTime = null;
let currentMonth = new Date(2026, 3, 1); // April 2026

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    initializeFormListeners();
    renderCalendar();

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Smooth scroll helper
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Form Step Navigation
function nextStep() {
    if (currentStep === 1) {
        // Validate step 1
        const name = document.getElementById('ownerName').value;
        const email = document.getElementById('ownerEmail').value;
        const phone = document.getElementById('ownerPhone').value;

        if (!name || !email || !phone) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        registrationData.owner = {
            name,
            email,
            phone,
            address: document.getElementById('ownerAddress').value
        };

        currentStep = 2;
        updateFormSteps();
    }
}

function prevStep() {
    if (currentStep === 2) {
        currentStep = 1;
        updateFormSteps();
    }
}

function updateFormSteps() {
    // Update step indicators
    document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        if (stepNum === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update form visibility
    document.querySelectorAll('.form-step').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`step${currentStep}`).classList.add('active');
}

// Form Input Listeners for Live Preview
function initializeFormListeners() {
    // Owner inputs
    document.getElementById('ownerName').addEventListener('input', function (e) {
        document.getElementById('previewOwnerName').textContent = e.target.value || '-';
    });

    document.getElementById('ownerEmail').addEventListener('input', function (e) {
        document.getElementById('previewOwnerEmail').textContent = e.target.value || '-';
    });

    document.getElementById('ownerPhone').addEventListener('input', function (e) {
        document.getElementById('previewOwnerPhone').textContent = e.target.value || '-';
    });

    // Pet inputs
    document.getElementById('petName').addEventListener('input', function (e) {
        document.getElementById('previewPetName').textContent = e.target.value || '-';
        updatePetPreview();
    });

    document.getElementById('petBreed').addEventListener('input', function (e) {
        updatePetPreview();
    });

    document.getElementById('petAge').addEventListener('input', function (e) {
        updatePetPreview();
    });
}

function updatePetPreview() {
    const breed = document.getElementById('petBreed').value;
    const age = document.getElementById('petAge').value;

    let info = '';
    if (breed && age) {
        info = `${breed}, ${age} años`;
    } else if (breed) {
        info = breed;
    } else if (age) {
        info = `${age} años`;
    } else {
        info = '-';
    }

    document.getElementById('previewPetInfo').textContent = info;
}

// Pet Type Selection
function selectPetType(type) {
    selectedPetType = type;

    // Update UI
    document.querySelectorAll('.pet-type-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-type="${type}"]`).classList.add('selected');

    // Update preview avatar
    const avatars = {
        dog: '🐕',
        cat: '🐱',
        bird: '🐦',
        other: '🐰'
    };
    document.getElementById('previewPetAvatar').textContent = avatars[type];
}

// Registration Submission
function submitRegistration(event) {
    event.preventDefault();

    const petName = document.getElementById('petName').value;
    const petBreed = document.getElementById('petBreed').value;
    const petAge = document.getElementById('petAge').value;

    if (!petName || !petBreed || !petAge || !selectedPetType) {
        alert('Por favor completa todos los campos y selecciona el tipo de mascota');
        return;
    }

    registrationData.pet = {
        name: petName,
        type: selectedPetType,
        breed: petBreed,
        age: petAge,
        notes: document.getElementById('petNotes').value
    };

    alert('¡Registro completado exitosamente!\n\nDueño: ' + registrationData.owner.name + '\nMascota: ' + registrationData.pet.name);

    // Reset form
    currentStep = 1;
    updateFormSteps();
    document.getElementById('step1').reset();
    document.getElementById('step2').reset();

    // Reset preview
    document.getElementById('previewOwnerName').textContent = '-';
    document.getElementById('previewOwnerEmail').textContent = '-';
    document.getElementById('previewOwnerPhone').textContent = '-';
    document.getElementById('previewPetName').textContent = '-';
    document.getElementById('previewPetInfo').textContent = '-';
    document.getElementById('previewPetAvatar').textContent = '🐾';

    selectedPetType = null;
    document.querySelectorAll('.pet-type-option').forEach(option => {
        option.classList.remove('selected');
    });
}

// Calendar Functions
function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Update header
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    document.getElementById('calendarMonth').textContent = `${monthNames[month]} ${year}`;

    // Calculate days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Adjust for Monday start

    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';

    // Add previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const dayElement = createDayElement(day, true, false);
        calendarDays.appendChild(dayElement);
    }

    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isPast = date < today.setHours(0, 0, 0, 0);
        const dayElement = createDayElement(day, false, isPast);
        calendarDays.appendChild(dayElement);
    }

    // Add next month's days
    const remainingCells = 42 - (startingDayOfWeek + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, true, false);
        calendarDays.appendChild(dayElement);
    }
}

function createDayElement(day, isOtherMonth, isPast) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;

    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }

    if (isPast && !isOtherMonth) {
        dayElement.classList.add('disabled');
    } else if (!isOtherMonth) {
        dayElement.addEventListener('click', function () {
            selectDate(day);
        });
    }

    return dayElement;
}

function selectDate(day) {
    selectedDate = day;

    document.querySelectorAll('.calendar-day').forEach(dayEl => {
        dayEl.classList.remove('selected');
    });

    event.target.classList.add('selected');
}

function changeMonth(direction) {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1);
    renderCalendar();
}

// Service Selection
function selectService(service) {
    selectedService = service;

    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
    });

    event.target.closest('.service-card').classList.add('selected');
}

// Time Selection
function selectTime(time) {
    selectedTime = time;

    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });

    event.target.classList.add('selected');
}

// Booking Confirmation
function confirmBooking() {
    if (!selectedDate || !selectedService || !selectedTime) {
        alert('Por favor selecciona una fecha, servicio y horario');
        return;
    }

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const month = monthNames[currentMonth.getMonth()];
    const year = currentMonth.getFullYear();

    alert(`¡Cita confirmada!\n\nFecha: ${selectedDate} de ${month} ${year}\nHora: ${selectedTime}\nServicio: ${selectedService}`);

    // Reset selections
    selectedDate = null;
    selectedService = null;
    selectedTime = null;

    document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.service-card.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));
}