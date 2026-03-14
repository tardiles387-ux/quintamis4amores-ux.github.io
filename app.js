window.reservas = [];

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBRSXrkJSL6H3uB3-cHSMTtM8dG5_tHD-s",
  authDomain: "quinta-reservas.firebaseapp.com",
  projectId: "quinta-reservas",
  storageBucket: "quinta-reservas.firebasestorage.app",
  messagingSenderId: "851228964363",
  appId: "1:851228964363:web:feb3bfc1597fbd823f390e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("reservaForm");
const mensaje = document.getElementById("mensaje");

const botonesHorario = document.querySelectorAll(".horarioBtn");
const horarioInputs = document.getElementById("horarioInputs");

botonesHorario.forEach(btn => {

btn.addEventListener("click", () => {

botonesHorario.forEach(b => b.classList.remove("activo"));
btn.classList.add("activo");

document.getElementById("horarioSeleccionado").value = btn.dataset.horario;

horarioInputs.style.display = "block";

botonesHorario.forEach(b => b.classList.remove("activo"));
btn.classList.add("activo");

horarioInputs.style.display = "block";

if(btn.dataset.horario === "dia"){
horarioInputs.dataset.inicio = "09:00";
horarioInputs.dataset.fin = "19:00";
}

if(btn.dataset.horario === "noche"){
horarioInputs.dataset.inicio = "19:00";
horarioInputs.dataset.fin = "07:00";
}

});

});

function guardarHorario() {
  const inicio = document.getElementById("horaInicio").value;
  const fin = document.getElementById("horaFin").value;
  const divInputs = document.getElementById("horarioInputs");
  const horarioSeleccionado = document.getElementById("horarioSeleccionado");

  if (!inicio || !fin) {
    alert("Por favor ingresá hora de inicio y fin.");
    return false;
  }

  // Rango del botón seleccionado
  let horarioMin = divInputs.dataset.inicio;
  let horarioMax = divInputs.dataset.fin;

  // Validación Día/Noche simple
  if (horarioMax > horarioMin) { // día
    if (inicio < horarioMin || fin > horarioMax || fin <= inicio) {
      alert(`El horario debe estar entre ${horarioMin} y ${horarioMax}`);
      return false;
    }
  } else { // noche, que pasa a madrugada
    const toMinutes = t => { const [h,m]=t.split(":").map(Number); return h*60+m; };
    const inicioMin = toMinutes(inicio);
    const finMin = toMinutes(fin);
    const minHorario = toMinutes(horarioMin);
    const maxHorario = toMinutes(horarioMax);

    if (!(inicioMin >= minHorario || inicioMin <= maxHorario) ||
        !(finMin >= minHorario || finMin <= maxHorario)) {
      alert(`El horario debe estar entre ${horarioMin} y ${horarioMax}`);
      return false;
    }
    if (finMin === inicioMin) {
      alert("La hora de fin debe ser mayor que la de inicio.");
      return false;
    }
  }

  // Guardar en hidden
  horarioSeleccionado.value = `${inicio} - ${fin}`;
  return true;
}

async function cargarReservas(){

 const q = query(collection(db, "reservas"), orderBy("fecha"));
 const querySnapshot = await getDocs(q);

 reservas = [];

 querySnapshot.forEach((doc)=>{

   const data = doc.data();

   reservas.push({
     fecha: data.fecha,
     horario: data.horario
   });

 });

 generarCalendario();

}


form.addEventListener("submit", async (e) => {

e.preventDefault();

if(!guardarHorario()) return;

const evento = document.getElementById("evento").value;
const fecha = document.getElementById("fechaSeleccionada").value;
const horario = document.getElementById("horarioSeleccionado").value;
let personas = document.getElementById("personas").value;
const nombre = document.getElementById("nombre").value;
const telefono = document.getElementById("telefono").value;

if(personas < 20){
personas = 20;
}

if(!fecha){
alert("Seleccioná una fecha");
return;
}

const precio = personas * 15000;
const sena = precio * 0.20;

try{

await addDoc(collection(db, "reservas"), {

evento: evento,
fecha: fecha,
horario: horario,
personas: personas,
nombre: nombre,
telefono: telefono,
precio: precio,
sena: sena,
fechaReserva: new Date()

});

mensaje.innerHTML = `
<h3>✅ Reserva enviada</h3>

💰 Total del evento: <b>$${precio.toLocaleString()}</b><br>
💵 Seña (20%): <b>$${sena.toLocaleString()}</b><br><br>

Para confirmar la reserva enviar la seña a:

<div class="pagos">

  <a href="https://link.mercadopago.com.ar/quintamis4amores" target="_blank" class="btnPago">
  💳 Pagar seña con Mercado Pago
  </a>

  <button class="btnEfectivo" onclick="toggleEfectivo()">
  💵 Pagar en efectivo
  </button>

  <div class="efectivoOpciones" id="efectivoOpciones">

  <p><b>Elegí con quíen comunicarte:</b></p>

  <a href="https://wa.me/5491133781543?text=Hola%20quiero%20pagar%20la%20seña%20en%20efectivo%20para%20la%20reserva" target="_blank">
  WhatsApp de Mariana
  </a>

  <a href="https://wa.me/5491163834135?text=Hola%20quiero%20pagar%20la%20seña%20en%20efectivo%20para%20la%20reserva" target="_blank">
  WhatsApp de Leo
  </a>

  </div>

</div>
`;

form.reset();

}catch(error){

console.error(error);
mensaje.innerText = "❌ Error al enviar reserva";

}

});


cargarReservas();

});

