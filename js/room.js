// 🏠 MF Voice Party - Room System Core

let currentRoomId = null;
let roomData = null;

// =======================
// CREATE ROOM
// =======================
function createRoom(roomName){

  let roomId = "room_" + Date.now();

  db.ref("rooms/" + roomId).set({
    name: roomName,
    owner: getUID(),
    locked: false,
    createdAt: Date.now(),
    seats: Array(8).fill(null),
    members: 0
  });

  return roomId;
}


// =======================
// JOIN ROOM
// =======================
function joinRoom(roomId){

  currentRoomId = roomId;

  db.ref("rooms/" + roomId + "/seats").once("value", snap=>{
    let seats = snap.val() || Array(8).fill(null);

    roomData = { seats };

    console.log("Joined Room:", roomId);
  });

}


// =======================
// GET ROOM DATA
// =======================
function getRoom(){
  return roomData;
}


// =======================
// SET ROOM LISTENER (LIVE)
// =======================
function listenRoom(roomId){

  db.ref("rooms/" + roomId).on("value", snap=>{
    roomData = snap.val();
  });

}


// =======================
// JOIN SEAT
// =======================
function joinSeat(index){

  if(!currentRoomId) return;

  db.ref("rooms/" + currentRoomId + "/seats").once("value", snap=>{

    let seats = snap.val() || Array(8).fill(null);

    seats[index] = getUID();

    db.ref("rooms/" + currentRoomId + "/seats").set(seats);

  });

}


// =======================
// LEAVE SEAT
// =======================
function leaveSeat(index){

  if(!currentRoomId) return;

  db.ref("rooms/" + currentRoomId + "/seats").once("value", snap=>{

    let seats = snap.val() || Array(8).fill(null);

    seats[index] = null;

    db.ref("rooms/" + currentRoomId + "/seats").set(seats);

  });

}


// =======================
// LOCK ROOM (OWNER ONLY)
// =======================
function lockRoom(){

  db.ref("rooms/" + currentRoomId).update({
    locked: true
  });

}


// =======================
// UNLOCK ROOM
// =======================
function unlockRoom(){

  db.ref("rooms/" + currentRoomId).update({
    locked: false
  });

}


// =======================
// CHECK OWNER
// =======================
function isOwner(){

  if(!roomData) return false;

  return roomData.owner === getUID();
}


// =======================
// GET SEATS
// =======================
function getSeats(){

  if(!roomData) return [];

  return roomData.seats || [];
}
