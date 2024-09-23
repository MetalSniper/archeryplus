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


    // Definir el radio del círculo amarillo
    const yellowCircleRadius = 7; // Ajusta este valor según el tamaño deseado
    ctx.beginPath();
    ctx.arc(centerX, centerY, yellowCircleRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();


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

    const calcularpuntuacion = calcularPuntaje(x, y);
    currentFlecha = { 
        puntaje: calcularpuntuacion.puntaje, 
        coordenadaX: x, 
        coordenadaY: y, 
        esx: calcularpuntuacion.isitx,
        precision : calcularpuntuacion.precision
    };
    console.log(`Coordenadas: (${x}, ${y}), Puntaje: ${currentFlecha.puntaje}, Es X?: ${currentFlecha.esx}, Precisión: ${currentFlecha.precision}`);
    
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

    let puntaje = 0;

    if (distance <= 7) {
        isitx = true;
        puntaje = 10; // Devuelve 'X' si la flecha está dentro del círculo amarillo
    } else {
        for (let i = 0; i < radii.length; i++) {
            if (distance <= radii[i]) {
                puntaje = 10 - i;
                isitx = false;
                break;
            }
        }
    }
    // Calcular precisión con 1 decimal
    const distanciaMaxima = radii[radii.length - 1]; // Usar el radio más grande como distancia máxima
    const precision = Math.max(0, (100 - ((distance / distanciaMaxima) * 100)).toFixed(1));

    return { puntaje, isitx, precision };
}


let acumuladox = 0; //acumulado de X
let xrondas = 0; // X por ronda
let isitx= false; //Es una X?
let ronda = 1;
let flechaNumero = 1;
let resultados = { Rondas: [] };

let rondaactual = document.getElementById('rondaactual');
rondaactual.innerHTML = ronda;

let flechaactual = document.getElementById('flechaactual');
flechaactual.innerHTML = flechaNumero;

// Declaramos el puntaje total global
let puntajeTotal = 0;
let totaldeprecision = 0;



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

// Función para calcular el numero de X de una ronda específica
function calcularAcumuladoxRonda(rondaIndex) {
    let xxronda = 0;
    if (resultados.Rondas[rondaIndex]) {
        xxronda = resultados.Rondas[rondaIndex].XCount;
    }
    return xxronda;
}

function caclularPrecisionRonda(rondaIndex) {
    let sumaprecision = 0;
    let precisionxronda = 0;

    if (resultados.Rondas[rondaIndex]) {
        const numeroFlechas = resultados.Rondas[rondaIndex].Flechas.length;
        
        if (numeroFlechas > 0) {  // Asegurarte de no dividir por 0
            resultados.Rondas[rondaIndex].Flechas.forEach(flecha => {
                sumaprecision += flecha.precision;
            });

            precisionxronda = sumaprecision / numeroFlechas;
        }
    }

    return precisionxronda.toFixed(1); // Devuelve con un decimal
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
        tabla.classList.add('has-text-centered');
        tabla.classList.add('tabla-puntuaciones');
        tabla.border = 1; // Añadir borde a la tabla para mejor visibilidad
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Crear el encabezado de la tabla con las flechas
        const encabezadoFila = document.createElement('tr');
        for (let i = 1; i <= 6; i++) {
            const th = document.createElement('th');
            th.textContent = `${i}`;
            encabezadoFila.appendChild(th);
        }
        // Añadir columna para el acumulado de la ronda
        const thAcumulado = document.createElement('th');
        thAcumulado.textContent = 'Total';
        encabezadoFila.appendChild(thAcumulado);
        thead.appendChild(encabezadoFila);

        // Añadir columna para el acumulado de X la ronda
        const thAcumuladox = document.createElement('th');
        thAcumuladox.textContent = 'X';
        encabezadoFila.appendChild(thAcumuladox);
        thead.appendChild(encabezadoFila);

        

        // Crear la fila con los puntajes de las flechas
        const filaPuntajes = document.createElement('tr');
        ronda.Flechas.forEach((flecha, idx) => {
            const td = document.createElement('td');
            td.textContent = flecha.puntaje;
            // Añadir clase si es una X
            if (flecha.esx) {
                td.classList.add('has-background-warning');
            }
            filaPuntajes.appendChild(td);
        });

        // Rellenar con celdas vacías si faltan flechas
        for (let i = ronda.Flechas.length; i < 6; i++) {
            const tdVacio = document.createElement('td');
            tdVacio.textContent = '-'; // Mostrar un guion para las flechas no disparadas
            filaPuntajes.appendChild(tdVacio);
        }

        // Crear la fila con las precisiones de las flechas
        const filaPrecision = document.createElement('tr');
        ronda.Flechas.forEach((flecha, idx) => {
            const td = document.createElement('td');
            td.textContent = flecha.precision;
            // Añadir clase si es una X
            if (flecha.esx) {
                td.classList.add('has-background-warning');
            }
            td.classList.add('is-size-7');
            filaPrecision.appendChild(td);
        });

        // Rellenar con celdas vacías si faltan flechas
        for (let i = ronda.Flechas.length; i < 6; i++) {
            const tdVacio = document.createElement('td');
            tdVacio.textContent = '-'; // Mostrar un guion para las flechas no disparadas
            filaPrecision.appendChild(tdVacio);
        }

        // Añadir la celda del acumulado de la ronda
        const tdAcumulado = document.createElement('td');
        tdAcumulado.textContent = calcularAcumuladoRonda(index);
        filaPuntajes.appendChild(tdAcumulado);

        // Añadir la celda del acumulado de X la ronda
        const tdAcumuladox = document.createElement('td');
        tdAcumuladox.textContent = calcularAcumuladoxRonda(index);
        filaPuntajes.appendChild(tdAcumuladox);

        // Añadir la celda del acumulado de la ronda
        const tdTprecision = document.createElement('td');
        tdTprecision.textContent = caclularPrecisionRonda(index);
        filaPrecision.appendChild(tdTprecision);
        

        
        tbody.appendChild(filaPuntajes);
        tbody.appendChild(filaPrecision);
        tabla.appendChild(thead);
        tabla.appendChild(tbody);
        tablasPuntajes.appendChild(tabla);
    });

    // Actualizar el puntaje acumulado total de todas las rondas
    let acumuladoTotal = calcularAcumulado();
    
    
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


function calcularPresicionTotal() {
    let sumaprecisionrondas = 0;
    let contadorRondas = 0; // Contador para las rondas válidas

    resultados.Rondas.forEach(ronda => {
            let precisionsanitizada = Number(ronda.precisionRonda);
            sumaprecisionrondas += precisionsanitizada;
            contadorRondas++;
    });

    // Calcular el promedio total de precisión
    let promedioPrecision = 0;
    if (contadorRondas > 0) {
        promedioPrecision = sumaprecisionrondas / contadorRondas;
    }

    return promedioPrecision.toFixed(2); // Devuelve el promedio con un decimal
}






document.addEventListener('DOMContentLoaded', function() {

    
    document.getElementById('siguienteFlecha').addEventListener('click', function() {
        if (currentFlecha) {
            const flechaData = {
                Flecha: flechaNumero,
                puntaje: currentFlecha.puntaje,
                coordenadas: { x: currentFlecha.coordenadaX, y: currentFlecha.coordenadaY },
                esx : currentFlecha.esx,
                precision : currentFlecha.precision
            };
            if (!resultados.Rondas[ronda - 1]) {
                resultados.Rondas[ronda - 1] = { Ronda: ronda, Flechas: [], XCount: 0, TotalRonda : 0, precisionRonda : 0};
            }
            resultados.Rondas[ronda - 1].Flechas.push(flechaData);
            flechas.push(flechaData);
            currentFlecha = null;

            drawDiana();
            drawFlechas();

            flechaNumero++;
            flechaactual.innerHTML = flechaNumero;

            //Añadimos 1 a xrondas
            if (isitx === true) {
                xrondas ++;
                resultados.Rondas[ronda - 1].XCount++;
                console.log(`Esta flecha es X`);
            }
            
            // Reinicia isitx a false después del uso
            isitx = false;


            // Desactiva los botones cuando las flechas son mas de 6
            if (resultados.Rondas[ronda - 1].Flechas.length === 6) {
                document.getElementById('siguienteFlecha').disabled = true;
                document.getElementById('siguienteRonda').disabled = false;
            }

            // Desactiva el botón de siguiente ronda al llegar a la ronda 12
            const numeroDeRonda = ronda; // Esto te da el número actual de la ronda
            if (ronda >= 12) {
                document.getElementById('siguienteRonda').disabled = true;
            }

            // Actualiza TotalRonda para la ronda actual
            const totalesRonda = calcularAcumuladoRonda(ronda - 1);
            resultados.Rondas[ronda - 1].TotalRonda = totalesRonda;

            // Actualiza precisionRonda para la ronda actual
            const totalpresronda = caclularPrecisionRonda(ronda - 1);
            resultados.Rondas[ronda - 1].precisionRonda = totalpresronda;
            console.log('La precisión de la ronda es:' + totalpresronda);

            }

        actualizarTablasPuntajes();
    });
    
    document.getElementById('siguienteRonda').addEventListener('click', function() {
        document.getElementById('siguienteFlecha').disabled = false;
        document.getElementById('siguienteRonda').disabled = true;
        acumuladox +=xrondas; //primero sumamos las X a las rondas.
        xrondas = 0; //reseteamos el numero de X por ronda a 0
        console.log(`Ahora El acumulado de x es: ${acumuladox} .`);
        flechaNumero = 1;
        ronda++;
        flechas = [];
        rondaactual.innerHTML = ronda;
        flechaactual.innerHTML = flechaNumero;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawDiana();
        calcularAcumulado();

        totaldeprecision = calcularPresicionTotal();
        console.log('la presicion TOTAL del control es'+totaldeprecision);
        let elementopresicion = document.getElementById('precisiontotal');
        elementopresicion.innerHTML = '<h4>'+totaldeprecision+'</h4>';

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
            body: JSON.stringify({ control_id: controlId, resultados: resultados, sumatoriatotal: sumatoriatotal, presiciontotal : totaldeprecision })
        }).then(response => response.text()).then(data => {
            console.log(data);
            mostrarModal(data); // Mostrar el mensaje en el modal
            
        });
    });
});

// Función para mostrar el modal
function mostrarModal(mensaje) {
    document.getElementById('modalMessage').textContent = mensaje;
    document.getElementById('resultadosModal').classList.add('is-active');
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById('resultadosModal').classList.remove('is-active');
}

// Cerrar el modal cuando se hace clic en el botón de cerrar o en el fondo
document.getElementById('closeModal').addEventListener('click', cerrarModal);
document.querySelector('.modal-background').addEventListener('click', cerrarModal);
document.getElementById('closeModalFooter').addEventListener('click', cerrarModal);

drawDiana();

