// Inicializar los iconos de Lucide
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    // ---- Funcionalidad de WhatsApp ----
    const handleWhatsApp = () => {
        const phone = '5491123456789'; // Reemplazar con número real
        const message = '¡Hola! Me gustaría obtener más información sobre sus servicios.';
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // Asignar el evento a todos los botones de WhatsApp
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp');
    whatsappButtons.forEach(btn => {
        btn.addEventListener('click', handleWhatsApp);
    });

    // ---- Smooth Scroll al Formulario de Contacto ----
    const scrollToContact = () => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const headerBtn = document.getElementById('btn-header-consulta');
    if (headerBtn) headerBtn.addEventListener('click', scrollToContact);

    const heroBtn = document.getElementById('btn-hero-consulta');
    if (heroBtn) heroBtn.addEventListener('click', scrollToContact);

    // ---- Manejo de Formularios ----
    const setupForm = (formId, successId) => {
        const form = document.getElementById(formId);
        const successMsg = document.getElementById(successId);

        if (form && successMsg) {
            form.addEventListener('submit', (e) => {
                e.preventDefault(); // Evitar recarga de página
                
                // Mostrar mensaje de éxito
                successMsg.classList.remove('hidden');
                
                // Ocultar el mensaje después de 3 segundos
                setTimeout(() => {
                    successMsg.classList.add('hidden');
                }, 3000);
                
                // Limpiar el formulario
                form.reset();
            });
        }
    };

    // Configurar ambos formularios (el del hero y el principal abajo)
    setupForm('hero-form', 'hero-success');
    setupForm('main-contact-form', 'main-success');
});
