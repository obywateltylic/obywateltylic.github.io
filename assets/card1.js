

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


  set("name", data.name.toUpperCase());
  set("surname", data.surname.toUpperCase());

  const birthday = `${data.day}.${data.month}.${data.year}`;
  set("birthday", birthday);

  set("pesel", data.pesel);

  const legit = generateLegitNumber();
  set("legitNumber", legit);



  const today = new Date();
  let schoolYear;

 
  if (today.getMonth() >= 8) {
    schoolYear = today.getFullYear();
  } else {

    schoolYear = today.getFullYear() - 1;
  }


  const givenDateObj = new Date(schoolYear, 8, 25);
  const givenDate = givenDateObj.toLocaleDateString("pl-PL");


  const expiryDateObj = new Date(schoolYear + 1, 8, 30);
  const expiryDate = expiryDateObj.toLocaleDateString("pl-PL");

  set("givenDate", givenDate);
  set("expiryDate", expiryDate);


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



function loadImage() {
  const url = params.get("image");
  if (!url) return;

  const img = document.querySelector(".id_own_image");
  img.style.backgroundImage = `url(${url})`;
}
