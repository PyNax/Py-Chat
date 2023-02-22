const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nickname");

const sts = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
    const msg = {type,payload};
    return JSON.stringify(msg);
}


sts.addEventListener("open", () =>{
    console.log("Connected From Server");
})

sts.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
})

sts.addEventListener("close", ()=>{
    console.log("Disconnected From Server");
})

function handleSubmit(ev) {
    ev.preventDefault();
    const input = messageForm.querySelector("input");
    sts.send(makeMessage("new_message",input.value));
    input.value = "";
}

function handleNickSubmit(ev) {
    ev.preventDefault();
    const input = nickForm.querySelector("input");
    sts.send(makeMessage("nickname",input.value));
    input.value = "";
}

messageForm.addEventListener("submit",handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit)