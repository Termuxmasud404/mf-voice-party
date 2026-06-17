// 👤 MF Voice Party - User System

let currentUser = null;
let userData = null;

// =======================
// SET CURRENT USER (after login)
// =======================
function setCurrentUser(user){

  currentUser = user;

  loadUserData(user.uid);
}


// =======================
// LOAD USER DATA
// =======================
function loadUserData(uid){

  db.ref("users/" + uid).on("value", (snap)=>{

    userData = snap.val();

    if(!userData) return;

    console.log("User Loaded:", userData);

  });

}


// =======================
// GET USER DATA
// =======================
function getUserData(){
  return userData;
}


// =======================
// GET USER UID
// =======================
function getUID(){
  return currentUser ? currentUser.uid : null;
}


// =======================
// UPDATE USER DATA
// =======================
function updateUser(data){

  if(!currentUser) return;

  db.ref("users/" + currentUser.uid).update(data);

}


// =======================
// ADD COINS
// =======================
function addCoins(amount){

  if(!userData) return;

  let newCoins = (userData.coins || 0) + amount;

  updateUser({
    coins: newCoins
  });

}


// =======================
// REMOVE COINS
// =======================
function removeCoins(amount){

  if(!userData) return;

  let newCoins = (userData.coins || 0) - amount;

  if(newCoins < 0) newCoins = 0;

  updateUser({
    coins: newCoins
  });

}


// =======================
// LEVEL UP SYSTEM
// =======================
function addLevel(){

  if(!userData) return;

  let newLevel = (userData.level || 1) + 1;

  updateUser({
    level: newLevel
  });

}
