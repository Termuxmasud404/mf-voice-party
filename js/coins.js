// 💰 MF Voice Party - Coins Economy System

// =======================
// GET COINS
// =======================
function getCoins(){

  if(!userData) return 0;

  return userData.coins || 0;
}


// =======================
// SET COINS
// =======================
function setCoins(amount){

  if(!getUID()) return;

  db.ref("users/" + getUID()).update({
    coins: amount
  });

}


// =======================
// ADD COINS
// =======================
function addCoins(amount){

  let current = getCoins();

  let newCoins = current + amount;

  setCoins(newCoins);
}


// =======================
// REMOVE COINS
// =======================
function removeCoins(amount){

  let current = getCoins();

  let newCoins = current - amount;

  if(newCoins < 0) newCoins = 0;

  setCoins(newCoins);
}


// =======================
// TRANSFER COINS (USER TO USER)
// =======================
function transferCoins(toUid, amount){

  if(!getUID()) return;

  let fromUid = getUID();

  db.ref("users/" + fromUid).once("value", snap=>{

    let fromData = snap.val();
    let fromCoins = fromData.coins || 0;

    if(fromCoins < amount){
      alert("Not enough coins!");
      return;
    }

    // deduct sender
    db.ref("users/" + fromUid).update({
      coins: fromCoins - amount
    });

    // add receiver
    db.ref("users/" + toUid).once("value", rSnap=>{

      let toData = rSnap.val();
      let toCoins = toData.coins || 0;

      db.ref("users/" + toUid).update({
        coins: toCoins + amount
      });

    });

    alert("Transfer successful 💸");

  });

}


// =======================
// DAILY BONUS
// =======================
function claimDailyBonus(){

  let uid = getUID();

  if(!uid) return;

  let today = new Date().toDateString();

  db.ref("users/" + uid + "/lastBonus").once("value", snap=>{

    let last = snap.val();

    if(last === today){
      alert("Already claimed today!");
      return;
    }

    db.ref("users/" + uid).update({
      coins: getCoins() + 50,
      lastBonus: today
    });

    alert("Daily bonus claimed 🎁 +50 coins");

  });

}


// =======================
// LEVEL SYSTEM
// =======================
function updateLevel(){

  let coins = getCoins();

  let level = Math.floor(coins / 500) + 1;

  db.ref("users/" + getUID()).update({
    level: level
  });

}


// =======================
// VIP CHECK
// =======================
function isVIP(){

  return userData && userData.vip === true;
}
