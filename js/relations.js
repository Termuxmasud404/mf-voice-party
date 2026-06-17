// 💞 MF Voice Party - Relations System (CP / Friend / Family)

let relationUID = null;

// =======================
// SET RELATION (CP / SISTER / BROTHER / FRIEND)
// =======================
function setRelation(targetUid, type){

  let myUid = getUID();

  if(!myUid || !targetUid) return;

  let relationId = myUid + "_" + targetUid;

  db.ref("relations/" + relationId).set({
    from: myUid,
    to: targetUid,
    type: type,
    time: Date.now()
  });

  alert("Relation added 💞 " + type);

}


// =======================
// REMOVE RELATION
// =======================
function removeRelation(targetUid){

  let myUid = getUID();

  let relationId = myUid + "_" + targetUid;

  db.ref("relations/" + relationId).remove();

  alert("Relation removed ❌");

}


// =======================
// GET MY RELATIONS
// =======================
function loadMyRelations(){

  let myUid = getUID();

  db.ref("relations").on("value", snap=>{

    let data = snap.val();

    let list = [];

    for(let id in data){

      let r = data[id];

      if(r.from === myUid || r.to === myUid){
        list.push(r);
      }

    }

    renderRelations(list);

  });

}


// =======================
// RENDER RELATIONS UI
// =======================
function renderRelations(list){

  let box = document.getElementById("relationBox");

  if(!box) return;

  box.innerHTML = "";

  list.forEach(r=>{

    let div = document.createElement("div");

    div.style.padding = "10px";
    div.style.margin = "5px";
    div.style.background = "#1e293b";
    div.style.borderRadius = "8px";

    let emoji = "💞";

    if(r.type === "cp") emoji = "💑";
    if(r.type === "sister") emoji = "👩‍❤️‍👨";
    if(r.type === "brother") emoji = "👬";
    if(r.type === "friend") emoji = "🤝";

    div.innerHTML = `
      ${emoji} ${r.type.toUpperCase()}<br>
      From: ${r.from}<br>
      To: ${r.to}
    `;

    box.appendChild(div);

  });

}


// =======================
// CHECK RELATION STATUS
// =======================
function getRelationWith(uid){

  let myUid = getUID();

  return db.ref("relations/" + myUid + "_" + uid).once("value");

}
