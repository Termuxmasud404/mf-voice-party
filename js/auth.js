// 🔐 MF Voice Party - Auth System

// =======================
// REGISTER USER
// =======================
function registerUser(email, password, callback){

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

      const user = userCredential.user;

      // 👤 Create user profile in database
      db.ref("users/" + user.uid).set({
        email: user.email,
        name: email.split("@")[0],
        coins: 100,
        level: 1,
        vip: false,
        idNumber: Math.floor(100000 + Math.random() * 900000),
        createdAt: Date.now()
      });

      callback(true, user);

    })
    .catch((error) => {
      callback(false, error.message);
    });
}


// =======================
// LOGIN USER
// =======================
function loginUser(email, password, callback){

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {

      const user = userCredential.user;
      callback(true, user);

    })
    .catch((error) => {
      callback(false, error.message);
    });
}


// =======================
// GET CURRENT USER
// =======================
function getCurrentUser(){
  return auth.currentUser;
}


// =======================
// LOGOUT
// =======================
function logoutUser(){

  auth.signOut()
    .then(() => {
      alert("Logged out 🚪");
      window.location.href = "index.html";
    });

}
