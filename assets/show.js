
var left = 0;
var leftMax = 180;
var loading = document.querySelector('.loading_bar');
var timer = document.querySelector('.expire_highlight');
var numbers = document.querySelector('.numbers');

setLeft();
function setLeft(){
    if (left == 0){
        left = leftMax;

        var numbersText = "";
        for (var i = 0; i < 6; i++){
            numbersText += getRandom(0, 10);
        }
        numbers.innerHTML = numbersText
    }
    var min = parseInt(left/60);
    var sec = parseInt(left - min*60);
    if (min == 0){
        timer.innerHTML = sec + " sek."
    }else{
        timer.innerHTML = min + " min " + sec + " sek."
    }
    loading.style.width = (left/leftMax)*100 + "%"
    left--;
    delay(1000).then(() => {
        setLeft()
    })
}