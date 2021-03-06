// import { checkText } from 'https://cdn.skypack.dev/smile2emoji'

let user = "";
do { user = prompt("Podaj nazwę użytkownika: "); } while (user === "" || user == null);

let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
// const manageInput = (e) => {
//     e.target.value = checkText(e.target.value);
// };

let input = document.getElementById("inputID");
// input.addEventListener("keyup", manageInput);

let $scrollbar = $("#scrollbar1");
$scrollbar.tinyscrollbar();
let $scrollbarData = $scrollbar.data("plugin_tinyscrollbar");


var poll = function (url, cb) {
    $.ajax({
        method: 'GET',
        url: url,
        success: function (data) {
            cb(data);
        },
        complete: function () {
            setTimeout(function () {
                poll(url, cb);
            }, 100);
        },
        timeout: 30000
    });
};

poll("/poll", function (data) {
    let chatLog = document.getElementById("chat-log");
    let newMessage = document.createElement("div");
    newMessage.classList.add("message");
    let userName = document.createElement("span");
    userName.innerText = "<@" + data.user + ">";
    userName.style.color = data.color;
    newMessage.appendChild(userName);
    if (data.message.split(" ")[0] === "/tts") {
        let userMessage = document.createElement("span");
        userMessage.classList.add("message");
        let text = data.message.split(" ");
        text.shift();
        text = text.join(" ");
        userMessage.innerText = text;
        newMessage.appendChild(userMessage);
        userMessage.classList.add("messageTxt");

        const msg = new SpeechSynthesisUtterance();
        msg.text = data.user + " pisze: " + text;
        window.speechSynthesis.speak(msg);
    } else {
        let userMessage = document.createElement("span");
        userMessage.classList.add("messageTxt");
        userMessage.innerText = data.message;
        newMessage.appendChild(userMessage);
    }
    chatLog.appendChild(newMessage);
    $('.messageTxt').emoticonize();
    // newMessage.scrollIntoView();
    $scrollbarData.update("bottom");
});


input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        postMessage();
    }
});

document.getElementById("bt").addEventListener("click", () => {
    postMessage();
});

function postMessage() {
    if (input.value.indexOf("/color ") !== -1) {
        let newColor = input.value.split(" ")[1];
        color = newColor;
        input.value = "";
    } else if (input.value.indexOf("/sus") !== -1) {
        let chatLog = document.getElementById("chat-log");
        let newMessage = document.createElement("div");
        newMessage.classList.add("message");
        let userName = document.createElement("span");
        userName.innerText = "<@" + "imposter" + ">";
        userName.style.color = "red";
        newMessage.appendChild(userName);
        let userMessage = document.createElement("span");
        // userMessage.classList.add("message");
        userMessage.innerText = "amogus";
        newMessage.appendChild(userMessage);
        // $('.message').emoticonize({})
        chatLog.appendChild(newMessage);
        // newMessage.scrollIntoView();
        $scrollbarData.update("bottom");
        input.value = "";
    } else if (input.value.indexOf("/clear") !== -1 || input.value.indexOf("/cls") !== -1) {
        let chatLog = document.getElementById("chat-log");
        chatLog.innerHTML = "";
        input.value = "";
    }
    else {  // async
        var sendPromise = new Promise((resolve, reject) => {
            fetch('https://mk3ib1-irc.herokuapp.com/bt', {
                // fetch('http://localhost:3000/bt', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: user, color: color, message: input.value })
            })
                .then(result => { resolve(result); input.value = ""; })
                .catch(error => { reject(error) })
        });
        sendPromise.then(outcome => {
            console.log(outcome);
        });
    }
}