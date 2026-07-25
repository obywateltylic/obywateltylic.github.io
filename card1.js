

var params = new URLSearchParams(window.location.search);

loadData();
loadImage();
setClock();

function setClock() {
  const now = new Date();
  document.getElementById("time").innerHTML =
    "Czas: " + now.toLocaleTimeString("pl-PL");
  setTimeout(setClock, 1000);
}

function loadData() {
  const data = Object.fromEntries(params);

  // Imię i nazwisko
  set("firstname", data.name.toUpperCase());
  set("surname", data.surname.toUpperCase());

  // Data urodzenia
  const birthday = `${data.day}.${data.month}.${data.year}`;
  set("birthday", birthday);

  // PESEL
  set("pesel", data.pesel);

  // Numer legitymacji
  const legit = generateLegitNumber();
  set("legitNumber", legit);

  // Daty
  const given = new Date();
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 3);

  set("givenDate", given.toLocaleDateString("pl-PL"));
  set("expiryDate", expiry.toLocaleDateString("pl-PL"));

  // Szkoła
  set("school", data.school);
  set("class", data.class);
  set("schoolAddress", data.schoolAddress);
  set("schoolPhone", data.schoolPhone);
  set("director", data.director);
}

function set(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

function generateLegitNumber() {
  let num = "";
  for (let i = 0; i < 8; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return "LS-" + num;
}

// Zdjęcie

function loadImage() {
  const url = params.get("image");
  if (!url) return;

  const img = document.querySelector(".id_own_image");
  img.style.backgroundImage = `url(${url})`;
}
