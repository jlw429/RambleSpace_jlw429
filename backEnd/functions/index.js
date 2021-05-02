const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbauth');
const { db } = require('./util/admin');
const cors = require('cors');


app.use(cors());

const {
  getAllRambles,
  postOneRamble,
  getRamble,
  commentOnRamble,
  likeRamble,
  unlikeRamble,
  deleteRamble,
} = require('./routes/ramble');

const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require('./routes/users');

//Ramble routes
app.get('/rambles', getAllRambles);
//Post a ramble
app.post('/ramble', FBAuth, postOneRamble);
app.get('/rambles/:rambleId', getRamble);
app.post('/rambles/:rambleId/comment', FBAuth, commentOnRamble);
app.get('/rambles/:rambleId/like', FBAuth, likeRamble);
app.get('/rambles/:rambleId/unlike', FBAuth, unlikeRamble);
app.delete('/ramble/:rambleId', FBAuth, deleteRamble);

//user route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', markNotificationsRead);

exports.api = functions.https.onRequest(app);

//notifications
exports.createNotificationOnLike = functions.firestore
  .document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/rambles/${snapshot.data().rambleId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            rambleId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });

exports.createNotificationOnComment = functions.firestore
  .document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/rambles/${snapshot.data().rambleId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            rambleId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        return;
      });
  });

exports.onUserImageChange = functions.firestore
  .document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('rambles')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const ramble = db.doc(`/rambles/${doc.id}`);
            batch.update(ramble, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onRambleDelete = functions.firestore
  .document('/rambles/{rambleId}')
  .onDelete((snapshot, context) => {
    const rambleId = context.params.rambleId;
    const batch = db.batch();
    return db
      .collection('comments')
      .where('rambleId', '==', rambleId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection('likes').where('rambleId', '==', rambleId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection('notifications')
          .where('rambleId', '==', rambleId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit;
      })
      .catch((err) => console.error(err));
  });
