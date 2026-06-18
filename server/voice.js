// ===============================
// MF Voice Party - voice.js
// ===============================

const socket = io();

let localStream = null;
let peers = {};
let currentRoom = null;

// Start microphone
async function startVoice() {

    try {

        localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        });

        console.log("Microphone Started");

    } catch (e) {

        alert("Microphone permission denied");

    }

}

// Stop microphone
function stopVoice() {

    if (!localStream) return;

    localStream.getTracks().forEach(track => track.stop());

    localStream = null;

    console.log("Microphone Stopped");

}

// Join Voice Room
function joinVoiceRoom(roomId, user) {

    currentRoom = roomId;

    socket.emit("join-room", {
        roomId: roomId,
        user: user
    });

}

// User Joined
socket.on("user-joined", async(data) => {

    await createPeer(data.id, true);

});

// Receive Signal
socket.on("signal", async(data) => {

    if (!peers[data.from]) {

        await createPeer(data.from, false);

    }

    const pc = peers[data.from];

    await pc.setRemoteDescription(
        new RTCSessionDescription(data.signal)
    );

    if (data.signal.type === "offer") {

        const answer = await pc.createAnswer();

        await pc.setLocalDescription(answer);

        socket.emit("signal", {
            to: data.from,
            signal: answer
        });

    }

});

// Create Peer
async function createPeer(id, initiator) {

    const pc = new RTCPeerConnection({

        iceServers: [{
            urls: "stun:stun.l.google.com:19302"
        }]

    });

    peers[id] = pc;

    if (localStream) {

        localStream.getTracks().forEach(track => {

            pc.addTrack(track, localStream);

        });

    }

    pc.ontrack = (event) => {

        let audio = document.getElementById("audio-" + id);

        if (!audio) {

            audio = document.createElement("audio");

            audio.id = "audio-" + id;

            audio.autoplay = true;

            document.body.appendChild(audio);

        }

        audio.srcObject = event.streams[0];

    };

    pc.onicecandidate = (event) => {

        if (event.candidate) return;

        socket.emit("signal", {

            to: id,

            signal: pc.localDescription

        });

    };

    if (initiator) {

        const offer = await pc.createOffer();

        await pc.setLocalDescription(offer);

        socket.emit("signal", {

            to: id,

            signal: offer

        });

    }

}

// Toggle Mute
function toggleMute() {

    if (!localStream) return;

    localStream.getAudioTracks().forEach(track => {

        track.enabled = !track.enabled;

    });

}

// Leave Room
function leaveVoiceRoom() {

    stopVoice();

    Object.values(peers).forEach(pc => pc.close());

    peers = {};

}
