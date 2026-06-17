// 🎮 MF Voice Party - Games Engine

let activeGame = null;

// =======================
// INIT GAMES SYSTEM
// =======================
function initGames(){

  console.log("Games system ready 🎮");

}


// =======================
// SET ACTIVE GAME
// =======================
function setActiveGame(gameName){

  activeGame = gameName;

  console.log("Active Game:", gameName);

}


// =======================
// GET ACTIVE GAME
// =======================
function getActiveGame(){
  return activeGame;
}


// =======================
// GAME REWARD SYSTEM
// =======================
function giveGameReward(amount){

  if(!getUID()) return;

  let current = getCoins();

  let newCoins = current + amount;

  db.ref("users/" + getUID()).update({
    coins: newCoins
  });

}


// =======================
// GAME PENALTY SYSTEM
// =======================
function takeGamePenalty(amount){

  if(!getUID()) return;

  let current = getCoins();

  let newCoins = current - amount;

  if(newCoins < 0) newCoins = 0;

  db.ref("users/" + getUID()).update({
    coins: newCoins
  });

}


// =======================
// GAME LOG (FOR ANALYTICS)
// =======================
function logGameActivity(gameName, result, amount){

  let uid = getUID();

  if(!uid) return;

  db.ref("gameLogs").push({
    uid: uid,
    game: gameName,
    result: result, // win / lose
    amount: amount,
    time: Date.now()
  });

}


// =======================
// RANDOM WIN SYSTEM (GLOBAL)
// =======================
function randomWinChance(percent){

  return Math.random() * 100 < percent;

}


// =======================
// GLOBAL GAME WRAPPER
// =======================
function playGame(gameName, bet, winPercent, winMultiplier){

  setActiveGame(gameName);

  if(getCoins() < bet){
    alert("Not enough coins!");
    return false;
  }

  let win = randomWinChance(winPercent);

  if(win){

    let reward = bet * winMultiplier;

    giveGameReward(reward);

    logGameActivity(gameName, "win", reward);

    alert("🎉 You WIN " + reward + " coins!");

    return true;

  } else {

    takeGamePenalty(bet);

    logGameActivity(gameName, "lose", bet);

    alert("😢 You LOSE " + bet + " coins!");

    return false;
  }

}


// =======================
// QUICK GAME WRAPPERS
// =======================

// Lucky Wheel
function playLuckyWheel(bet){
  return playGame("lucky-wheel", bet, 60, 2);
}

// Greedy Game
function playGreedy(bet){
  return playGame("greedy", bet, 50, 2);
}

// Teen Patti
function playTeenPatti(bet){
  return playGame("teen-patti", bet, 45, 3);
}
