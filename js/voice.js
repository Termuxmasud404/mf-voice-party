// 🎤 MF Voice Party - Voice System (WebRTC Core)

let localStream = null;
let peers = {};
let socket = null;

// =======================
// INIT SOCKET
// =======================
function initVoiceSocket(io){

  socket = io;

  socket.on("user-joined", (id)=>{
    console.log("User joined voice:", id);
    createPeer(id, true);
  });

  socket.on("signal", async (data)=>{

    if(!peers[data.from]){
      createPeer(data.from, false);
    }

    let pc = peers[data.from];

    await pc.setRemoteDescription(new RTCSessionDescription(data.signal));

    if(data.signal.type === "offer"){

      let answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("signal", {
        to: data.from,
        signal: pc.localDescription
      });
    }

  });

}


// =======================
// START VOICE
// =======================
async function startVoice(){

  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  });

}


// =======================
// CREATE PEER CONNECTION
// =======================
function createPeer(id, isInitiator){

  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  });

  peers[id] = pc;

  // add local stream
  localStream.getTracks().forEach(track=>{
    pc.addTrack(track, localStream);
  });

  // receive audio
  pc.ontrack = (event)=>{

    let audio = document.createElement("audio");
    audio.srcObject = event.streams[0];
    audio.autoplay = true;
    audio.controls = false;

    document.body.appendChild(audio);
  };

  // ICE candidate (send signal)
  pc.onicecandidate = (event)=>{
    if(event.candidate) return;
  };

  // create offer if initiator
  if(isInitiator){

    pc.createOffer().then(offer=>{
      pc.setLocalDescription(offer);

      socket.emit("signal", {
        to: id,
        signal: offer
      });

    });

  }

}


// =======================
// JOIN VOICE ROOM
// =======================
function joinVoiceRoom(roomId){

  socket.emit("join-room", roomId);

  console.log("Joined voice room:", roomId);
}


// =======================
// MUTE / UNMUTE
// =======================
function toggleMute(){

  if(!localStream) return;

  localStream.getAudioTracks().forEach(track=>{
    track.enabled = !track.enabled;
  });

}
