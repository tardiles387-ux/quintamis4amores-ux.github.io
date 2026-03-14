const diasContainer = document.getElementById("dias");
const mesActual = document.getElementById("mesActual");

let fecha = new Date();

function generarCalendario() {

  diasContainer.innerHTML = "";

  const year = fecha.getFullYear();
  const month = fecha.getMonth();

  const primerDia = new Date(year, month, 1).getDay();
  const ultimoDia = new Date(year, month + 1, 0).getDate();

  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  mesActual.innerText = meses[month] + " " + year;

  // espacios vacíos antes del primer día
  for (let i = 0; i < primerDia; i++) {
    const empty = document.createElement("div");
    diasContainer.appendChild(empty);
  }

  // generar días
  for (let d = 1; d <= ultimoDia; d++) {

    const dia = document.createElement("div");
    dia.classList.add("dia");

    const fechaCompleta =
      year + "-" +
      String(month + 1).padStart(2,"0") + "-" +
      String(d).padStart(2,"0");

    dia.innerText = d;

    // verificar si está ocupado
    const ocupado = window.reservas && window.reservas.some(r => r.fecha === fechaCompleta);

    if (ocupado) {

      dia.classList.add("ocupado");

    } else {

      dia.onclick = () => {

        document.querySelectorAll(".dia").forEach(d => d.classList.remove("seleccionado"));

        dia.classList.add("seleccionado");

        document.getElementById("fechaSeleccionada").value = fechaCompleta;

      };

    }

    diasContainer.appendChild(dia);
  }
}

// botones de navegación
document.getElementById("prev").onclick = () => {
  fecha.setMonth(fecha.getMonth() - 1);
  generarCalendario();
}

document.getElementById("next").onclick = () => {
  fecha.setMonth(fecha.getMonth() + 1);
  generarCalendario();
}