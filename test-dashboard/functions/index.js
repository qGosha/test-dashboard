const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
var convert = require('xml-js');

exports.callback = functions.https.onRequest((req, res) => {
  if(req.query['hub.challenge']) {
    res.status(200).send(req.query['hub.challenge']);
    // res.status(200).json({ 'hub.challenge': req.query['hub.challenge'] });
  } else {
    const store = admin.firestore();
    const load = convert.xml2json(req.body, {compact: true, spaces: 4});
    const parsed = JSON.parse(load);
    console.log(parsed);

    if(parsed) {
      if(parsed.feed['at:deleted-entry']) {
        const id = parsed.feed['at:deleted-entry']._attributes.ref.replace('yt:video:', '');
        console.log(id);
        return store.collection('videos').doc(id).delete().then(() => {
          return res.end();
        }).catch( (error) => {
          return res.end("Error removing document: ", error);
      });
    }
      const converted = parsed.feed.entry;
      const id = converted['yt:videoId']._text || 'id';
      const title = converted.title._text || 'title';
      const author = converted.author.name._text || 'author';
      const link = converted.link._attributes.href || 'link';
      const publishedAt = converted.published._text || 'publ';
      const updatedAt = converted.updated._text || 'updated';
      return store.collection("videos").doc(id).set({
      author,
      title,
      link,
      publishedAt,
      updatedAt
    }).then(() => {
        return res.end();
    }).catch( (error) => {
        return res.end("Error writing document: ", error);
    });
  }
  }
});

// exports.deleteVideo = functions.firestore
//     .document('users/{userId}')
//     .onDelete((snap, context) => {
//       // Get an object representing the document prior to deletion
//       // e.g. {'name': 'Marie', 'age': 66}
//       const deletedValue = snap.data();
//
//       // perform desired operations ...
//     });
