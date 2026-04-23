// Registration State
let currentStep = 1;
let selectedPetType = null;
let registrationData = { owner: {}, pet: {} };

// Booking State
let selectedDate = null;
let selectedService = null;
let selectedTime = null;
let currentMonth = new Date(2026, 3, 1); // Abril 2026

document.addEventListener('DOMContentLoaded', function () {
    initializeFormListeners();
    renderCalendar();
});

// Helper de navegación suavizada
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Navegación de Formulario (Registro)
function nextStep() {
    const name = document.getElementById('ownerName').value;
    const email = document.getElementById('ownerEmail').value;
    const phone = document.getElementById('ownerPhone').value;

    if (!name || !email || !phone) {
        alert('Por favor completa todos los campos requeridos del dueño.');
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

function prevStep() {
    currentStep = 1;
    updateFormSteps();
}

function updateFormSteps() {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
    });
    document.querySelectorAll('.form-step').forEach((form, index) => {
        form.classList.toggle('active', index + 1 === currentStep);
    });
}

// Live Preview
function initializeFormListeners() {
    const mappings = {
        'ownerName': 'previewOwnerName',
        'ownerEmail': 'previewOwnerEmail',
        'ownerPhone': 'previewOwnerPhone',
        'petName': 'previewPetName'
    };

    Object.keys(mappings).forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            document.getElementById(mappings[id]).textContent = e.target.value || '-';
            if (id === 'petName') updatePetPreview();
        });
    });

    document.getElementById('petBreed').addEventListener('input', updatePetPreview);
    document.getElementById('petAge').addEventListener('input', updatePetPreview);
}

function updatePetPreview() {
    const breed = document.getElementById('petBreed').value;
    const age = document.getElementById('petAge').value;

    let info = '-';
    if (breed && age) info = `${breed}, ${age} años`;
    else if (breed) info = breed;
    else if (age) info = `${age} años`;

    document.getElementById('previewPetInfo').textContent = info;
}

// Selección de Mascota
function selectPetType(type, event) {
    selectedPetType = type;
    document.querySelectorAll('.pet-type-option').forEach(opt => opt.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    const avatars = { dog: '🐕', cat: '🐱', bird: '🐦', other: '🐰' };
    document.getElementById('previewPetAvatar').textContent = avatars[type];
}

// Envío del registro
function submitRegistration(e) {
    e.preventDefault();
    const petName = document.getElementById('petName').value;
    const petBreed = document.getElementById('petBreed').value;
    const petAge = document.getElementById('petAge').value;

    if (!petName || !selectedPetType) {
        alert('Por favor completa el nombre de la mascota y selecciona su tipo.');
        return;
    }

    registrationData.pet = {
        name: petName,
        type: selectedPetType,
        breed: petBreed,
        age: petAge,
        notes: document.getElementById('petNotes').value
    };

    alert(`¡Registro completado exitosamente!\n\nDueño: ${registrationData.owner.name}\nMascota: ${registrationData.pet.name}`);

    // Limpieza de formulario
    currentStep = 1;
    updateFormSteps();
    document.getElementById('step1').reset();
    document.getElementById('step2').reset();

    // Limpiar vista previa
    document.getElementById('previewOwnerName').textContent = '-';
    document.getElementById('previewOwnerEmail').textContent = '-';
    document.getElementById('previewOwnerPhone').textContent = '-';
    document.getElementById('previewPetName').textContent = '-';
    document.getElementById('previewPetInfo').textContent = '-';
    document.getElementById('previewPetAvatar').textContent = '🐾';

    selectedPetType = null;
    document.querySelectorAll('.pet-type-option').forEach(opt => opt.classList.remove('selected'));
}

// Lógica del Calendario
function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    document.getElementById('calendarMonth').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();

    // Ajuste para que la semana empiece en Lunes (Lunes = 0, Domingo = 6)
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';

    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const div = document.createElement('div');
        div.className = 'calendar-day other-month';
        div.textContent = prevMonthLastDay - i;
        calendarDays.appendChild(div);
    }

    // Días del mes actual
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        div.textContent = day;

        const currentDate = new Date(year, month, day);
        const isPast = currentDate < today.setHours(0, 0, 0, 0);

        if (isPast) {
            div.classList.add('disabled');
        } else {
            div.onclick = (e) => selectDate(day, e);
        }

        calendarDays.appendChild(div);
    }

    // Días del próximo mes
    const daysRendered = startingDayOfWeek + lastDay.getDate();
    const remainingCells = 42 - daysRendered; // Grilla de 6x7

    for (let day = 1; day <= remainingCells; day++) {
        const div = document.createElement('div');
        div.className = 'calendar-day other-month';
        div.textContent = day;
        calendarDays.appendChild(div);
    }
}

function changeMonth(direction) {
    currentMonth.setMonth(currentMonth.getMonth() + direction);
    renderCalendar();
}

// Selecciones de Citas
function selectDate(day, event) {
    selectedDate = day;
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    event.target.classList.add('selected');
}

function selectService(service, event) {
    selectedService = service;
    document.querySelectorAll('.service-card').forEach(s => s.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

function selectTime(time, event) {
    selectedTime = time;
    document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
    event.target.classList.add('selected');
}

function confirmBooking() {
    if (!selectedDate || !selectedService || !selectedTime) {
        alert('Por favor selecciona una fecha, servicio y horario.');
        return;
    }

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthName = monthNames[currentMonth.getMonth()];
    const year = currentMonth.getFullYear();

    alert(`¡Cita confirmada!\n\nFecha: ${selectedDate} de ${monthName} ${year}\nHora: ${selectedTime}\nServicio: ${selectedService}`);

    // Limpiar selecciones
    selectedDate = null;
    selectedService = null;
    selectedTime = null;

    document.querySelectorAll('.calendar-day.selected, .service-card.selected, .time-slot.selected')
        .forEach(el => el.classList.remove('selected'));
}