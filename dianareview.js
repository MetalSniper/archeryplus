const canvas = document.getElementById('diana');
const ctx = canvas.getContext('2d');


function drawDiana() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Radios ajustados para que se ajusten al canvas de 350x350
    const maxRadius = Math.min(centerX, centerY); // Máximo radio que cabe en el canvas
    const scaleFactor = maxRadius / 275; // Escala para ajustar los radios al tamaño del canvas
    const colors = [
        'yellow',
        'yellow',
        'red',
        'red',
        'cyan',
        'cyan',
        'black',
        'black',
        'white',
        'white',
        'white',
    ];
    const radii = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275].map(
        (radius) => radius * scaleFactor
    );

    for (let i = radii.length - 1; i >= 0; i--) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radii[i], 0, 2 * Math.PI, false);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = colors[i] === 'black' ? 'lightgray' : 'black';
        ctx.stroke();
    }

    // Dibujar una pequeña cruz en el centro
    ctx.beginPath();
    ctx.moveTo(centerX - 5, centerY);
    ctx.lineTo(centerX + 5, centerY);
    ctx.moveTo(centerX, centerY - 5);
    ctx.lineTo(centerX, centerY + 5);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawFlechas(flechas) {
    // No es necesario ajustar la escala aquí porque ya se hizo en la captura de la coordenada
    flechas.forEach((flecha) => {
        ctx.beginPath();
        ctx.arc(flecha.coordenadas.x, flecha.coordenadas.y, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function mostrarTodas() {
    drawDiana();
    flechasData.Rondas.forEach((ronda) => {
        drawFlechas(ronda.Flechas);
    });
}

function filtrarRonda(rondaNum) {
    drawDiana();
    const ronda = flechasData.Rondas.find((r) => r.Ronda === rondaNum);
    if (ronda) {
        drawFlechas(ronda.Flechas);
    }
    // Actualiza los botones de filtro
    actualizarBotonesFiltro(rondaNum);
}

function actualizarBotonesFiltro(rondaNum) {
    // Selecciona todos los botones de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Elimina la clase 'is-primary' de todos los botones
    filterButtons.forEach(button => button.classList.remove('is-primary'));

    // Añade la clase 'is-primary' al botón correspondiente
    const botonSeleccionado = document.querySelector(`.filter-btn[data-filter="${rondaNum}"]`);
    if (botonSeleccionado) {
        botonSeleccionado.classList.add('is-primary');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    drawDiana();
    mostrarTodas();
});
