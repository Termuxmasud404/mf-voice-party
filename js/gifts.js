// 🎁 MF Voice Party - Gifts System

let giftRoomId = null;

// =======================
// INIT GIFTS
// =======================
function initGifts(roomId){

  giftRoomId = roomId;

  listenGifts();
}


// =======================
// SEND GIFT
// =======================
function sendGift(type, toUid){

  if(!getUID()) return;

  let cost = getGiftCost(type);

  if(getCoins() < cost){
    alert("Not enough coins!");
    return;
  }

  // remove coins from sender
  removeCoins(cost);

  // push gift to room
  db.ref("rooms/" + giftRoomId + "/gifts").push({
    from: getUID(),
    to: toUid,
    type: type,
    time: Date.now()
  });

}


// =======================
// GIFT COST
// =======================
function getGiftCost(type){

  if(type === "rose") return 10;
  if(type === "heart") return 20;
  if(type === "diamond") return 50;

  return 10;
}


// =======================
// LISTEN GIFTS (REALTIME)
// =======================
function listenGifts(){

  db.ref("rooms/" + giftRoomId + "/gifts").on("child_added", (snap)=>{

    let gift = snap.val();

    showGiftAnimation(gift);

    giveReward(gift);

  });

}


// =======================
// GIFT ANIMATION (UI)
// =======================
function showGiftAnimation(gift){

  let div = document.createElement("div");

  div.style.position = "fixed";
  div.style.bottom = "20px";
  div.style.left = "50%";
  div.style.transform = "translateX(-50%)";
  div.style.padding = "10px 20px";
  div.style.background = "#1e293b";
  div.style.color = "white";
  div.style.borderRadius = "10px";
  div.style.zIndex = "9999";
  div.style.animation = "fadeUp 2s ease";

  let emoji = "🎁";

  if(gift.type === "rose") emoji = "🌹";
  if(gift.type === "heart") emoji = "❤️";
  if(gift.type === "diamond") emoji = "💎";

  div.innerHTML = `${emoji} Gift from ${gift.from}`;

  document.body.appendChild(div);

  setTimeout(()=>div.remove(), 2000);
}


// =======================
// GIVE REWARD TO RECEIVER
// =======================
function giveReward(gift){

  let reward = 0;

  if(gift.type === "rose") reward = 5;
  if(gift.type === "heart") reward = 10;
  if(gift.type === "diamond") reward = 25;

  // add coins to receiver
  if(gift.to){

    db.ref("users/" + gift.to).once("value", snap=>{

      let data = snap.val();
      if(!data) return;

      let coins = data.coins || 0;

      db.ref("users/" + gift.to).update({
        coins: coins + reward
      });

    });

  }

  // level boost
  updateLevel();
}


// =======================
// CSS ANIMATION (auto inject)
// =======================
const style = document.createElement("style");

style.innerHTML = `
@keyframes fadeUp {
  0% {opacity:0; transform:translate(-50%,20px);}
  50% {opacity:1;}
  100% {opacity:0; transform:translate(-50%,-50px);}
}
`;

document.head.appendChild(style);
