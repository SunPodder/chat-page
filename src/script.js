const socket = io("https://chat-page.sunpodder.repl.co/")
const form = document.querySelector("form"),
  input = document.querySelector("#input"),
  ul = document.querySelector("ul")

var pageUrl = "", userName = ""

/*chrome.identity.getAuthToken({interactive: true}, function(token) {
      console.log(token);
    });*/

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  pageUrl = tabs[0].url
});

chrome.storage.sync.get(["username"], function(name){
  if(!name.value) userName = Math.random()
  else userName = name.value
  connect()
})

form.addEventListener('submit', e => {
  e.preventDefault()
  let msg = input.value.trim()
  
  if(msg) socket.emit("send", msg, pageUrl, userName)
  input.value = ""
})

socket.on("receive", msg => {
  msg = sanitize(msg)
  let li = document.createElement("li")
  li.innerHTML = msg
  ul.appendChild(li)
})

function sanitize(text){
  return text.replace(/\n/g, "<br>").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function connect(){
  socket.emit("join", pageUrl, userName)
}