// 💬 MF Voice Party - Chat System

let chatRoomId = null;

// =======================
// INIT CHAT ROOM
// =======================
function initChat(roomId){

  chatRoomId = roomId;

  listenChat();
}


// =======================
// SEND MESSAGE
// =======================
function sendMessage(msg){

  if(!chatRoomId || !msg) return;

  db.ref("rooms/" + chatRoomId + "/chat").push({
    uid: getUID(),
    msg: msg,
    time: Date.now()
  });

}


// =======================
// LISTEN CHAT (REALTIME)
// =======================
function listenChat(){

  db.ref("rooms/" + chatRoomId + "/chat").on("child_added", (snap)=>{

    let data = snap.val();

    renderMessage(data);

  });

}


// =======================
// RENDER MESSAGE UI
// =======================
function renderMessage(data){

  let box = document.getElementById("chatBox");

  if(!box) return;

  let div = document.createElement("div");

  div.style.padding = "5px";
  div.style.margin = "5px";
  div.style.background = "#1e293b";
  div.style.borderRadius = "8px";
  div.style.textAlign = "left";

  div.innerHTML = `
    👤 ${data.uid}<br>
    💬 ${data.msg}
  `;

  box.appendChild(div);

  box.scrollTop = box.scrollHeight;
}


// =======================
// CLEAR CHAT (OWNER ONLY OPTIONAL)
// =======================
function clearChat(){

  db.ref("rooms/" + chatRoomId + "/chat").remove();

}
