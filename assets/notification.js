
var collector = document.createElement("div");
collector.classList.add("inotification_collector");
document.body.appendChild(collector);

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const jump = collector.animate(
    [{ bottom: "-65px" }, { bottom: "0px" }],
    {
      duration: 200,
    },
);
jump.pause();

function notify(text, type){

    var typeClass;
    if (type === "error"){
        typeClass = "inotify_error";
    }else{
        typeClass = "inotify_success";
    }

    var notificationBox = document.createElement("div");
    notificationBox.classList.add("inotification_box");
    notificationBox.classList.add(typeClass);
    collector.appendChild(notificationBox);

    var notificationGrid = document.createElement("div");
    notificationGrid.classList.add("inotification_grid");
    notificationBox.appendChild(notificationGrid);

    var notificationText = document.createElement("p");
    notificationText.classList.add("inotification_text");
    notificationText.innerHTML = text;
    notificationGrid.appendChild(notificationText);

    var notificationHide = document.createElement("img");
    notificationHide.classList.add("inotification_hide");
    notificationHide.src = "assets/images/close.png";
    notificationGrid.appendChild(notificationHide);

    jump.play();

    delay(4000).then(() => {

        notificationBox.classList.add("ditch");

    });

    notificationHide.addEventListener('click', () => {
        notificationBox.classList.add("ditch");
        delay(450).then(() => {
            notificationBox.classList.add("fade");
        });
    });

}