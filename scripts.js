const canvas = document.getElementById('diana');
const ctx = canvas.getContext('2d');
let flechas = [];
let currentFlecha = null;

function drawDiana() {
    const maxCanvasSize = 350;
    canvas.width = maxCanvasSize;
    canvas.height = maxCanvasSize;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Reducir el factor de escala ligeramente para ajustar mejor
    const scaleFactor = 0.65; // Ajuste más preciso para encajar la diana
    const colors = ['yellow', 'yellow', 'red', 'red', 'cyan', 'cyan', 'black', 'black', 'white', 'white', 'white'];
    const radii = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275].map(r => r * scaleFactor);

    for (let i = radii.length - 1; i >= 0; i--) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radii[i], 0, 2 * Math.PI, false);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = (colors[i] === 'black') ? 'lightgray' : 'black'; // Contorno gris claro para los círculos negros
        ctx.lineWidth = 1; // Mantener el borde delgado
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

function drawFlechas() {
    flechas.forEach(flecha => {
        ctx.beginPath();
        ctx.arc(flecha.coordenadas.x, flecha.coordenadas.y, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'black'; // Color de la flecha
        ctx.fill();
        ctx.strokeStyle = 'white'; // Borde de la flecha
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    currentFlecha = { puntaje: calcularPuntaje(x, y), coordenadaX: x, coordenadaY: y };
    console.log(`Coordenadas: (${x}, ${y}), Puntaje: ${currentFlecha.puntaje}`);
    var elemento = document.getElementById ('valoractual');
    elemento.innerHTML = currentFlecha.puntaje;
    drawDiana();
    drawFlechas();
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
});

function calcularPuntaje(x, y) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    // Ajustar los radios para la escala
    const scaleFactor = 0.65;
    const radii = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275].map(r => r * scaleFactor);

    for (let i = 0; i < radii.length; i++) {
        if (distance <= radii[i]) {
            return 10 - i;
        }
    }
    return 0;
}

let ronda = 1;
let flechaNumero = 1;
let resultados = { Rondas: [] };

let rondaactual = document.getElementById('rondaactual');
rondaactual.innerHTML = ronda;

let flechaactual = document.getElementById('flechaactual');
flechaactual.innerHTML = flechaNumero;

// Declaramos el puntaje total global
let puntajeTotal = 0;



// Función para calcular el puntaje acumulado de una ronda específica
function calcularAcumuladoRonda(rondaIndex) {
    let totalRonda = 0;
    if (resultados.Rondas[rondaIndex]) {
        resultados.Rondas[rondaIndex].Flechas.forEach(flecha => {
            totalRonda += flecha.puntaje;
        });
    }
    puntajeTotal += totalRonda;
    return totalRonda;
    
}

// Función para actualizar las tablas con los puntajes de las rondas
function actualizarTablasPuntajes() {
    const tablasPuntajes = document.getElementById('tablasPuntajes');
    tablasPuntajes.innerHTML = ''; // Limpiar el contenido anterior

    resultados.Rondas.forEach((ronda, index) => {
        // Crear un encabezado con el número de la ronda
        const encabezado = document.createElement('h3');
        encabezado.textContent = `Ronda #${ronda.Ronda}`;
        tablasPuntajes.appendChild(encabezado);

        // Crear la tabla para mostrar los puntajes
        const tabla = document.createElement('table');
        tabla.classList.add('table');
        tabla.border = 1; // Añadir borde a la tabla para mejor visibilidad
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Crear el encabezado de la tabla con las flechas
        const encabezadoFila = document.createElement('tr');
        for (let i = 1; i <= 6; i++) {
            const th = document.createElement('th');
            th.textContent = `F ${i}`;
            encabezadoFila.appendChild(th);
        }
        // Añadir columna para el acumulado de la ronda
        const thAcumulado = document.createElement('th');
        thAcumulado.textContent = 'Total';
        encabezadoFila.appendChild(thAcumulado);
        thead.appendChild(encabezadoFila);

        

        // Crear la fila con los puntajes de las flechas
        const filaPuntajes = document.createElement('tr');
        ronda.Flechas.forEach((flecha, idx) => {
            const td = document.createElement('td');
            td.textContent = flecha.puntaje;
            filaPuntajes.appendChild(td);
        });

        // Rellenar con celdas vacías si faltan flechas
        for (let i = ronda.Flechas.length; i < 6; i++) {
            const tdVacio = document.createElement('td');
            tdVacio.textContent = '-'; // Mostrar un guion para las flechas no disparadas
            filaPuntajes.appendChild(tdVacio);
        }

        // Añadir la celda del acumulado de la ronda
        const tdAcumulado = document.createElement('td');
        tdAcumulado.textContent = calcularAcumuladoRonda(index);
        filaPuntajes.appendChild(tdAcumulado);

        tbody.appendChild(filaPuntajes);
        tabla.appendChild(thead);
        tabla.appendChild(tbody);
        tablasPuntajes.appendChild(tabla);
    });

    // Actualizar el puntaje acumulado total de todas las rondas
    let acumuladoTotal = calcularAcumulado();
    console.log(acumuladoTotal);
    

    puntajeTotal = acumuladoTotal;
    

}

// Función para calcular el puntaje acumulado de todas las rondas
function calcularAcumulado() {
    let total = 0;
    resultados.Rondas.forEach(ronda => {
        ronda.Flechas.forEach(flecha => {
            total += flecha.puntaje;
        });
    });
    return total;

}



document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('siguienteFlecha').addEventListener('click', function() {
        if (currentFlecha) {
            const flechaData = {
                Flecha: flechaNumero,
                puntaje: currentFlecha.puntaje,
                coordenadas: { x: currentFlecha.coordenadaX, y: currentFlecha.coordenadaY }
            };
            if (!resultados.Rondas[ronda - 1]) {
                resultados.Rondas[ronda - 1] = { Ronda: ronda, Flechas: [] };
            }
            resultados.Rondas[ronda - 1].Flechas.push(flechaData);
            flechas.push(flechaData);
            currentFlecha = null;

            drawDiana();
            drawFlechas();

            flechaNumero++;
            flechaactual.innerHTML = flechaNumero;

            if (resultados.Rondas[ronda - 1].Flechas.length === 6) {
                document.getElementById('siguienteFlecha').disabled = true;
                document.getElementById('siguienteRonda').disabled = false;
            }
            const numeroDeRonda = ronda; // Esto te da el número actual de la ronda
            if (ronda >= 12) {
                document.getElementById('siguienteRonda').disabled = true;
            }
        }
        actualizarTablasPuntajes();
    });
    
    document.getElementById('siguienteRonda').addEventListener('click', function() {
        document.getElementById('siguienteFlecha').disabled = false;
        document.getElementById('siguienteRonda').disabled = true;
        flechaNumero = 1;
        ronda++;
        flechas = [];
        rondaactual.innerHTML = ronda;
        flechaactual.innerHTML = flechaNumero;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawDiana();
        calcularAcumulado();
        let elementosuma = document.getElementById('puntajeAcumuladoTotal');
        sumatoriatotal = calcularAcumulado();
        if (elementosuma) {
            elementosuma.innerHTML = '<h4 class=title>'+sumatoriatotal+'</h4>'; // Esto funcionará si elementosuma no es null
        } else {
            console.error('El elemento con ID "puntajeAcumuladoTotal" no fue encontrado.');
        }
        

    });

    document.getElementById('terminarControl').addEventListener('click', function() {
        fetch('save_results.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ control_id: controlId, resultados: resultados })
        }).then(response => response.text()).then(data => {
            console.log(data);
            window.location.href = 'dashboard.php';
        });
    });
});

drawDiana();
