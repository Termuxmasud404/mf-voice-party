// 🏆 MF Voice Party - Leaderboard System

let leaderboardData = [];

// =======================
// LOAD LEADERBOARD
// =======================
function loadLeaderboard(){

  db.ref("users").on("value", snap=>{

    let data = snap.val();

    leaderboardData = [];

    for(let id in data){

      leaderboardData.push({
        uid: id,
        name: data[id].name || "User",
        coins: data[id].coins || 0,
        level: data[id].level || 1,
        vip: data[id].vip || false
      });

    }

    // sort by coins (highest first)
    leaderboardData.sort((a,b)=> b.coins - a.coins);

    renderLeaderboard();

  });

}


// =======================
// RENDER UI
// =======================
function renderLeaderboard(){

  let box = document.getElementById("list");

  if(!box) return;

  box.innerHTML = "";

  leaderboardData.forEach((u, index)=>{

    let div = document.createElement("div");

    div.style.background = "#1e293b";
    div.style.margin = "8px";
    div.style.padding = "10px";
    div.style.borderRadius = "8px";
    div.style.textAlign = "left";

    let medal = "🏅";

    if(index === 0) medal = "🥇";
    else if(index === 1) medal = "🥈";
    else if(index === 2) medal = "🥉";

    div.innerHTML = `
      ${medal} #${index + 1}<br>
      👤 ${u.name} ${u.vip ? "👑" : ""}<br>
      🪙 Coins: ${u.coins}<br>
      ⭐ Level: ${u.level}
    `;

    box.appendChild(div);

  });

}


// =======================
// GET TOP USER
// =======================
function getTopUser(){

  if(leaderboardData.length === 0) return null;

  return leaderboardData[0];

}


// =======================
// GET USER RANK
// =======================
function getUserRank(uid){

  for(let i = 0; i < leaderboardData.length; i++){

    if(leaderboardData[i].uid === uid){
      return i + 1;
    }

  }

  return null;
}
