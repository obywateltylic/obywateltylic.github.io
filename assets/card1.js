

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



async function loadData() {
  const data = Object.fromEntries(params);

  const db = await getDb();
  const saved = await getData(db, "data");


  set("name", saved.name.toUpperCase());
  set("surname", saved.surname.toUpperCase());
  set("birthday", saved.birthday);
  set("pesel", saved.pesel);   

  
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
  const expiryDateObj = new Date(schoolYear + 1, 8, 30);

  set("givenDate", givenDateObj.toLocaleDateString("pl-PL"));
  set("expiryDate", expiryDateObj.toLocaleDateString("pl-PL"));



  set("school", data.school || "");
  set("class", data.class || "");
  set("schoolAddress", data.schoolAddress || "");
  set("schoolPhone", data.schoolPhone || "");
  set("director", data.director || "");
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



function getDb() {
  return new Promise((resolve, reject) => {
    var request = window.indexedDB.open("cwelObywatel", 1);
    request.onerror = (event) => reject(event.target.error);

    request.onupgradeneeded = (event) => {
      var db = event.target.result;
      if (!db.objectStoreNames.contains("data")) {
        db.createObjectStore("data", { keyPath: "data" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

function getData(db, name) {
  return new Promise((resolve, reject) => {
    var store = db.transaction("data", "readonly").objectStore("data");
    var request = store.get(name);
    request.onsuccess = () => resolve(request.result || {});
    request.onerror = (event) => reject(event.target.error);
  });
}
