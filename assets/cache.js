var params = new URLSearchParams(window.location.search);

window.onload = async () => {
  const files = ["https://unpkg.com/html5-qrcode"];
  const pages = [
    "card",
    "document",
    "documents",
    "home",
    "id",
    "more",
    "pesel",
    "qr",
    "scan",
    "services",
    "shortcuts",
    "show",
  ];

  pages.forEach((page) => {
    files.push("/" + page + "?" + params);
  });

  files.push(params.get("image"));

  const index = files.indexOf("./assets/cache.js");
  files.splice(index, 1);

  const cacheName = "cwelObywatel";

  const cache = await caches.open(cacheName);
  await cache.addAll(files);

  const cachedRequests = await cache.keys();

  cachedRequests.forEach((request) => {
    checkElement(request, cache);
  });

  navigator.serviceWorker.register("./worker.js");
};

async function checkElement(request, cache) {
  const cachedResponse = await cache.match(request);

  const url = new URL(request.url);
  const modifiedUrl = new URL(url);

  modifiedUrl.searchParams.append("date", new Date());

  const networkResponse = await fetch(modifiedUrl);

  const cachedText = await cachedResponse.clone().text();
  const networkText = await networkResponse.clone().text();

  if (cachedText !== networkText) {
    cache.put(url, networkResponse);
  }
}

