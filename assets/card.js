// ==================== CARD.JS - WERSJA DLA IMGBB ====================

var confirmElement = document.querySelector(".confirm");
var time = document.getElementById("time");

if (localStorage.getItem("update") == null) {
  localStorage.setItem("update", "18.04.2026");
}

var date = new Date();
var updateText = document.querySelector(".bottom_update_value");
updateText.innerHTML = localStorage.getItem("update");

var update = document.querySelector(".update");
update.addEventListener("click", () => {
  var newDate = date.toLocaleDateString("pl-PL", options);
  localStorage.setItem("update", newDate);
  updateText.innerHTML = newDate;
  scroll(0, 0);
});

setClock();

function setClock() {
  date = new Date();
  time.innerHTML =
    "Czas: " +
    date.toLocaleTimeString("pl-PL", optionsTime) +
    " " +
    date.toLocaleDateString("pl-PL", options);
  delay(1000).then(() => {
    setClock();
  });
}

var unfold = document.querySelector(".info_holder");
unfold.addEventListener("click", () => {
  if (unfold.classList.contains("unfolded")) {
    unfold.classList.remove("unfolded");
  } else {
    unfold.classList.add("unfolded");
  }
});

var params = new URLSearchParams(window.location.search);

// ==================== ŁADOWANIE DANYCH ====================
loadData();

async function loadData() {
  var db = await getDb();
  var data = await getData(db, "data");

  if (data) {
    loadReadyData(data);
  }

  let result = Object.fromEntries(params);
  result["data"] = "data";

  // Proste porównanie – czy dane się zmieniły
  if (JSON.stringify(result) !== JSON.stringify(data)) {
    loadReadyData(result);
    saveData(db, result);
  }
}

function loadReadyData(result) {
  Object.keys(result).forEach((key) => {
    result[key] = htmlEncode(result[key]);
  });

  const birthdayDate = new Date();
  birthdayDate.setFullYear(result["year"], result["month"] - 1, result["day"]);

  var sex = result["sex"];
  let day = birthdayDate.getDay();
  let month = birthdayDate.getMonth();
  let year = birthdayDate.getFullYear();

  var textSex = sex === "m" ? "Mężczyzna" : "Kobieta";

  // Generowanie serii i numeru dowodu
  var seriesAndNumber = localStorage.getItem("seriesAndNumber");
  if (!seriesAndNumber) {
    seriesAndNumber = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUWXYZ".split("");
    for (var i = 0; i < 4; i++) {
      seriesAndNumber += chars[getRandom(0, chars.length)];
    }
    seriesAndNumber += " ";
    for (var i = 0; i < 5; i++) {
      seriesAndNumber += getRandom(0, 9);
    }
    localStorage.setItem("seriesAndNumber", seriesAndNumber);
  }

  day = birthdayDate.getDate() > 9 ? birthdayDate.getDate() : "0" + birthdayDate.getDate();
  month = (birthdayDate.getMonth() + 1) > 9 ? (birthdayDate.getMonth() + 1) : "0" + (birthdayDate.getMonth() + 1);

  setData("seriesAndNumber", seriesAndNumber);
  setData("name", result["name"].toUpperCase());
  setData("surname", result["surname"].toUpperCase());
  setData("nationality", result["nationality"].toUpperCase());
  setData("fathersName", "PIOTR");
  setData("mothersName", "KINGA");
  setData("birthday", day + "." + month + "." + birthdayDate.getFullYear());
  setData("familyName", result["familyName"]);
  setData("sex", textSex);
  setData("fathersFamilyName", result["fathersFamilyName"]);
  setData("mothersFamilyName", result["mothersFamilyName"]);
  setData("birthPlace", result["birthPlace"]);
  setData("countryOfBirth", result["countryOfBirth"]);
  setData(
    "adress",
    "ul. " + result["address1"] + "<br>" + result["address2"] + " " + result["city"]
  );

  var givenDate = new Date(birthdayDate);
  givenDate.setFullYear(givenDate.getFullYear() + 18);
  setData("givenDate", givenDate.toLocaleDateString("pl-PL", options));

  var expiryDate = new Date(givenDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 10);
  setData("expiryDate", expiryDate.toLocaleDateString("pl-PL", options));

  if (!localStorage.getItem("homeDate")) {
    var homeDay = getRandom(1, 25);
    var homeMonth = getRandom(0, 12);
    var homeYear = getRandom(2012, 2019);
    var homeDate = new Date(homeYear, homeMonth, homeDay);
    localStorage.setItem("homeDate", homeDate.toLocaleDateString("pl-PL", options));
  }
  document.querySelector(".home_date").innerHTML = localStorage.getItem("homeDate");

  // PESEL
  if (parseInt(year) >= 2000) month = 20 + parseInt(month);
  var later = sex === "m" ? "0295" : "0382";
  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;

  var pesel = year.toString().substring(2) + month + day + later + "7";
  setData("pesel", pesel);
}

// ==================== ŁADOWANIE ZDJĘCIA (ImgBB) ====================
loadImage();

async function loadImage() {
  const imageUrl = params.get("image");

  if (!imageUrl) {
    console.warn("Brak parametru ?image= w URL");
    return;
  }

  console.log("Ładuję zdjęcie z ImgBB:", imageUrl);

  // 1. Wczytaj z cache jeśli istnieje
  try {
    const db = await getDb();
    const saved = await getData(db, "image");
    if (saved?.image) {
      setImage(saved.image);
      console.log("✓ Zdjęcie wczytane z cache");
    }
  } catch (e) {
    console.warn("Błąd odczytu cache:", e);
  }

  // 2. Ustaw zdjęcie bezpośrednio
  setImage(imageUrl);

  // 3. Zapisz w tle do cache
  cacheImageAsBase64(imageUrl);
}

async function cacheImageAsBase64(url) {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const base64 = canvas.toDataURL("image/jpeg", 0.82);

        const db = await getDb();
        await saveData(db, { data: "image", image: base64 });

        console.log("✓ Zdjęcie zapisane w cache jako base64");
      } catch (e) {
        console.warn("Błąd zapisu do IndexedDB:", e);
      }
    };

    img.onerror = () => {
      console.warn("Nie udało się załadować obrazu do cache");
    };

    img.src = url;
  } catch (err) {
    console.warn("Błąd cacheImageAsBase64:", err);
  }
}

function setImage(src) {
  const element = document.querySelector(".id_own_image");
  if (element) {
    element.style.backgroundImage = `url(${src})`;
  } else {
    console.warn("Nie znaleziono elementu .id_own_image");
  }
}

// ==================== POMOCNICZE FUNKCJE ====================

function setData(id, value) {
  document.getElementById(id).innerHTML = value;
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
    var store = getStore(db);
    var request = store.get(name);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = (event) => reject(event.target.error);
  });
}

function getStore(db) {
  var transaction = db.transaction("data", "readwrite");
  return transaction.objectStore("data");
}

function saveData(db, data) {
  return new Promise((resolve, reject) => {
    var store = getStore(db);
    var request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
}
