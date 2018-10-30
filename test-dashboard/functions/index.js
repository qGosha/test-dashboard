const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


exports.addMessage = functions.https.onRequest((req, res) => {
  const original = req.query.text;
  const store = admin.firestore();
  store.collection("users").doc(original).set({
    name: original
})
.then(function() {
    return res.send("Document successfully written!");
})
.catch(function(error) {
    return console.error("Error writing document: ", error);
});




  // // Grab the text parameter.
  // const original = req.query.text;
  // // Push the new message into the Realtime Database using the Firebase Admin SDK.
  // return admin.firestore().ref('/messages').push({original: original}).then((snapshot) => {
  //   // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  //   return res.redirect(303, snapshot.ref.toString());
  // });
});
