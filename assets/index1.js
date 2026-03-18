
var params = new URLSearchParams(window.location.search);
var id = 0;
var sex = "m"

var token = localStorage.getItem("token");
var upload = document.querySelector(".upload");

if (!localStorage.getItem("token")){
    location.href = '/error'
}

if (params.has("id")){
    id = parseInt(params.get('id'))
    fetch('/get/card', {
        method: 'POST',
        body: JSON.stringify({
          'token': localStorage.getItem('token'),
          'id': id
        })
    })
    .then(response => response.json())
    .then(result => {
        var classes = upload.classList;
        classes.remove("error_shown")
        classes.add("upload_loaded");
        classes.remove("upload_loading");

        setUpload(result['image']);
        setSelectorOption(result['sex'])

        document.querySelectorAll("input").forEach((input) => {
            var value = result[input.id];
            if (value){
                input.value = value;
            }
        })
    })
}

var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    var classes = selector.classList;
    if (classes.contains("selector_open")){
        classes.remove("selector_open")
    }else{
        classes.add("selector_open")
    }
})

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown")
    })
})

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        setSelectorOption(option.id)
    })
})

function setSelectorOption(id){
    sex = id;
    document.querySelectorAll(".selector_option").forEach((option) => {
        if (option.id === id){
            document.querySelector(".selected_text").innerHTML = option.innerHTML;
        }
    })
}

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {

    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    })

});

upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown")
});

imageInput.addEventListener('change', (event) => {

    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");

    upload.removeAttribute("selected")

    var file = imageInput.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        var classes = upload.classList;
        var url = event.target.result;
        classes.remove("error_shown")
        classes.add("upload_loaded");
        classes.remove("upload_loading");
        setUpload(url);
    }
})

function setUpload(url){
    upload.setAttribute("selected", url);
    upload.querySelector(".upload_uploaded").src = url;
}

document.querySelector(".create").addEventListener('click', () => {

    var empty = [];
    var data = {};

    data["sex"] = sex;
    if (!upload.hasAttribute("selected")){
        empty.push(upload);
        upload.classList.add("error_shown")
    }else{
        data['image'] = upload.getAttribute("selected");
    }

    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        if (isEmpty(element.value)){
            dateEmpty = true;
        }else{
            data[element.id] = parseInt(element.value)
        }
    })

    if (dateEmpty){
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    }

    document.querySelectorAll(".input_holder").forEach((element) => {

        var input = element.querySelector(".input");

        if (isEmpty(input.value)){
            empty.push(element);
            element.classList.add("error_shown");
        }else{
            data[input.id] = input.value
        }

    })

    if (empty.length != 0){
        empty[0].scrollIntoView();
    }else{
        
        fetch('/submit', {
            method: 'POST',
            body: JSON.stringify({
                'id': id,
                'token': token,
                'data': data
            })
        })
        .then(() => {
            location.href = '/dashboard'
        })
    }

});

function isEmpty(value){
    let pattern = /^\s*$/
    return pattern.test(value);
}