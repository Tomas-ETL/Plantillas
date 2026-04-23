document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('petals-container');
    if (!container) return;

    const colors = ['#FFB7C5', '#FFC8DD', '#FF69B4', '#FF1493', '#FFC0CB', '#FFE4E1'];

    // Replicando la lógica del useEffect de React
    for (let i = 0; i < 40; i++) {
        const left = Math.random() * 100;
        const animationDuration = 8 + Math.random() * 10;
        const size = 10 + Math.random() * 15;
        const delay = Math.random() * 5;
        const opacity = 0.5 + Math.random() * 0.5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        const petal = document.createElement('div');
        petal.className = 'absolute -top-10 animate-fall';

        // Aplicamos los estilos calculados dinámicamente
        petal.style.left = `${left}%`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size * 1.2}px`;
        petal.style.animationDuration = `${animationDuration}s`;
        petal.style.animationDelay = `${delay}s`;
        petal.style.opacity = opacity;

        // Inyectamos el SVG del pétalo
        petal.innerHTML = `
      <svg viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
        <path
          d="M10 0C10 0 5 4 3 8C1 12 2 16 4 18C6 20 8 20 10 18C12 20 14 20 16 18C18 16 19 12 17 8C15 4 10 0 10 0Z"
          fill="${color}"
          filter="drop-shadow(0 2px 4px rgba(255, 20, 147, 0.3))"
        />
        <path
          d="M10 2C10 2 7 5 6 7.5C5 10 5.5 12.5 7 14C8.5 15.5 10 15 10 15C10 15 11.5 15.5 13 14C14.5 12.5 15 10 14 7.5C13 5 10 2 10 2Z"
          fill="#FFFFFF"
          opacity="0.5"
        />
      </svg>
    `;

        container.appendChild(petal);
    }
});