var confirmElement = document.querySelector(".confirm");

var time = document.getElementById("time");

if (localStorage.getItem("update") == null) {
  localStorage.setItem("update", "24.12.2024");
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

  var textSex;
  if (sex === "m") {
    textSex = "Mężczyzna";
  } else if (sex === "k") {
    textSex = "Kobieta";
  }

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

  day =
    birthdayDate.getDate() > 9
      ? birthdayDate.getDate()
      : "0" + birthdayDate.getDate();
  month =
    birthdayDate.getMonth() + 1 > 9
      ? birthdayDate.getMonth() + 1
      : "0" + (birthdayDate.getMonth() + 1);

  setData("seriesAndNumber", seriesAndNumber);
  setData("name", result["name"].toUpperCase());
  setData("surname", result["surname"].toUpperCase());
  setData("nationality", result["nationality"].toUpperCase());
  // setData("fathersName", result["fathersName"].toUpperCase());
  setData("fathersName", "WOJCIECH");
  // setData("mothersName", result["mothersName"].toUpperCase());
  setData("mothersName", "AGATA");
  setData("birthday", day + "." + month + "." + birthdayDate.getFullYear());
  setData("familyName", result["familyName"]);
  setData("sex", textSex);
  setData("fathersFamilyName", result["fathersFamilyName"]);
  setData("mothersFamilyName", result["mothersFamilyName"]);
  setData("birthPlace", result["birthPlace"]);
  setData("countryOfBirth", result["countryOfBirth"]);
  setData(
    "adress",
    "ul. " +
      result["address1"] +
      "<br>" +
      result["address2"] +
      " " +
      result["city"],
  );

  var givenDate = birthdayDate;
  givenDate.setFullYear(givenDate.getFullYear() + 18);
  setData("givenDate", givenDate.toLocaleDateString("pl-PL", options));

  var expiryDate = givenDate;
  expiryDate.setFullYear(expiryDate.getFullYear() + 10);
  setData("expiryDate", expiryDate.toLocaleDateString("pl-PL", options));

  if (!localStorage.getItem("homeDate")) {
    var homeDay = getRandom(1, 25);
    var homeMonth = getRandom(0, 12);
    var homeYear = getRandom(2012, 2019);

    var homeDate = new Date();
    homeDate.setDate(homeDay);
    homeDate.setMonth(homeMonth);
    homeDate.setFullYear(homeYear);

    localStorage.setItem(
      "homeDate",
      homeDate.toLocaleDateString("pl-PL", options),
    );
  }

  document.querySelector(".home_date").innerHTML =
    localStorage.getItem("homeDate");

  if (parseInt(year) >= 2000) {
    month = 20 + parseInt(month);
  }

  var later;

  if (sex === "m") {
    later = "0295";
  } else {
    later = "0382";
  }

  if (day < 10) {
    day = "0" + day;
  }

  if (month < 10) {
    month = "0" + month;
  }

  var pesel = year.toString().substring(2) + month + day + later + "7";
  setData("pesel", pesel);
}

loadData();
async function loadData() {
  var db = await getDb();
  var data = await getData(db, "data");

  if (data) {
    loadReadyData(data);
  }

  let result = Object.fromEntries(params);

  result["data"] = "data";
  if (result !== data) {
    loadReadyData(result);
    saveData(db, result);
  }
}

loadImage();
async function loadImage() {
  var db = await getDb();
  var image = await getData(db, "image");

  if (image) {
    setImage(image.image);
  }

  console.log(params.get("image"));
  fetch(params.get("image"), {
    method: "GET",
    headers: {
      Authorization: "Client-ID e4d98a899c8c946",
    },
  })
    .then((response) => response.blob())
    .then((result) => {
      var reader = new FileReader();
      reader.readAsDataURL(result);
      reader.onload = (event) => {
        var base = event.target.result;

        if (base !== image) {
          setImage(base);

          var data = {
            data: "image",
            image: base,
          };

          saveData(db, data);
        }
      };
    });
}

function setImage(image) {
  document.querySelector(".id_own_image").style.backgroundImage =
    `url(${image})`;
}

function setData(id, value) {
  document.getElementById(id).innerHTML = value;
}

function getDb() {
  return new Promise((resolve, reject) => {
    var request = window.indexedDB.open("cwelObywatel", 1);

    request.onerror = (event) => {
      reject(event.target.error);
    };

    var name = "data";

    request.onupgradeneeded = (event) => {
      var db = event.target.result;

      if (!db.objectStoreNames.contains(name)) {
        db.createObjectStore(name, {
          keyPath: name,
        });
      }
    };

    request.onsuccess = (event) => {
      var db = event.target.result;
      resolve(db);
    };
  });
}

function getData(db, name) {
  return new Promise((resolve, reject) => {
    var store = getStore(db);

    var request = store.get(name);

    request.onsuccess = () => {
      var result = request.result;
      if (result) {
        resolve(result);
      } else {
        resolve(null);
      }
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function getStore(db) {
  var name = "data";
  var transaction = db.transaction(name, "readwrite");
  return transaction.objectStore(name);
}

function saveData(db, data) {
  return new Promise((resolve, reject) => {
    var store = getStore(db);

    console.log(data);
    var request = store.put(data);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
