// ==================== UPLOAD ZDJĘCIA - ImgBB ====================

var upload = document.querySelector(".upload");
var imageInput = document.createElement("input");

imageInput.type = "file";
imageInput.accept = "image/jpeg,image/png,image/gif";

upload.addEventListener("click", () => {
  imageInput.click();
  upload.classList.remove("error_shown");
});

imageInput.addEventListener("change", async (event) => {
  const file = imageInput.files[0];
  if (!file) return;

  upload.classList.remove("upload_loaded", "error_shown");
  upload.classList.add("upload_loading");

  try {
    const formData = new FormData();
    formData.append("image", file);

    
    const IMGBB_API_KEY = "d96c7cacb366e5c9587da66fc7e4c5df";

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.status === 200 && result.data?.url) {
      const imageUrl = result.data.url;

      upload.setAttribute("selected", imageUrl);
      upload.querySelector(".upload_uploaded").src = imageUrl;

      upload.classList.add("upload_loaded");
      upload.classList.remove("upload_loading");

      console.log("Zdjęcie wgrane pomyślnie:", imageUrl);
    } else {
      throw new Error(result.error?.message || "Nieznany błąd ImgBB");
    }

  } catch (error) {
    console.error("Błąd uploadu:", error);
    upload.classList.remove("upload_loading");
    upload.classList.add("error_shown");
    alert("Nie udało się wgrać zdjęcia.\nSprawdź połączenie internetowe i klucz ImgBB.");
  }
});

// ==================== PRZYCISK "WEJDŹ" ====================

document.querySelector(".go").addEventListener("click", () => {
  var empty = [];
  var params = new URLSearchParams();

  params.set("sex", sex);

  if (!upload.hasAttribute("selected")) {
    empty.push(upload);
    upload.classList.add("error_shown");
  } else {
    params.set("image", upload.getAttribute("selected"));
  }

  const day = document.getElementById("day");
  const month = document.getElementById("month");
  const year = document.getElementById("year");

  if (!day.value || !month.value || !year.value) {
    empty.push(document.querySelector(".date"));
    document.querySelector(".date").classList.add("error_shown");
  } else {
    params.set("day", day.value);
    params.set("month", month.value);
    params.set("year", year.value);
  }

  document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    if (isEmpty(input.value)) {
      empty.push(element);
      element.classList.add("error_shown");
    } else {
      params.set(input.id, input.value);
    }
  });

  if (empty.length > 0) {
    empty[0].scrollIntoView({ behavior: "smooth" });
  } else {
    forwardToId(params);
  }
});
