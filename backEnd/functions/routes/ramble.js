const { db } = require('../util/admin');
const { reduceUserDetails } = require('../util/validate');

exports.getAllRambles = (req, res) => {
  db.collection('rambles')
    .orderBy('createdAt', 'desc') //can i use this for my blog?
    .get()
    .then((data) => {
      let rambles = [];
      data.forEach((doc) => {
        console.log(doc);
        rambles.push({
          rambleId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          createdAt: doc.data().createdAt,
          userImage: doc.data().userImage,
        });
      });
      return res.json(rambles);
    })
    .catch((err) => console.error(err));
};

exports.postOneRamble = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }

  const newRamble = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection('rambles')
    .add(newRamble)
    .then((doc) => {
      const resRamble = newRamble;
      resRamble.rambleId = doc.id;
      res.json({
        message: `document ${doc.id} created successfully`,
        ramble: resRamble,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: 'someone rambled wrong' });
      console.error(err);
    });
};

//get one ramble
exports.getRamble = (req, res) => {
  let rambleData = {};
  db.doc(`/rambles/${req.params.rambleId}`)
    .get()
    .then((doc) => {
        if (!doc.exists) {
        return res.status(404).json({ error: 'This ramble not found...' });
      }
      rambleData = doc.data();
      rambleData.rambleId = doc.id;
      return db
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('rambleId', '==', req.params.rambleId)
        .get();
    })
    .then((data) => {
      rambleData.comments = [];
      data.forEach((doc) => {
        rambleData.comments.push(doc.data());
      });
      return res.json(rambleData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//comment on a ramble
exports.commentOnRamble = (req, res) => {
  if (req.body.body.trim() === '')
    return res.status(400).json({ comment: 'Cannot be empty' });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    rambleId: req.params.rambleId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  };

  db.doc(`/rambles/${req.params.rambleId}`) //accessing firebase collection
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Ramble not found..' });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection('comments').add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' });
    });
};

//like a ramble
exports.likeRamble = (req, res) => {
  const likeDoc = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('rambleId', '==', req.params.rambleId)
    .limit(1);

  const rambleDocument = db.doc(`/rambles/${req.params.rambleId}`);

  let rambleData = {};

  rambleDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        rambleData = doc.data();
        rambleData.rambleId = doc.id;
        return likeDoc.get();
      } else {
        return res.status(404).json({ error: 'Ramble not found' });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            rambleId: req.params.rambleId,
            userHandle: req.user.handle,
          })
          .then(() => {
            rambleData.likeCount++;
            return rambleDocument.update({ likeCount: rambleData.likeCount });
          })
          .then(() => {
            return res.json(rambleData);
          });
      } else {
        return res.status(400).json({ error: 'Ramble already liked' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.code });
    });
};

//Un-like a ramble
exports.unlikeRamble = (req, res) => {
  const likeDoc = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('rambleId', '==', req.params.rambleId)
    .limit(1);

  const rambleDocument = db.doc(`/rambles/${req.params.rambleId}`);

  let rambleData = {};

  rambleDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        rambleData = doc.data();
        rambleData.rambleId = doc.id;
        return likeDoc.get();
      } else {
        return res.status(404).json({ error: 'Ramble not found' });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: 'Ramble not liked' });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            rambleData.likeCount--;
            return rambleDocument.update({ likeCount: rambleData.likeCount });
          })
          .then(() => {
            res.json(rambleData);
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.code });
    });
};
//delete Ramble

exports.deleteRamble = (req, res) => {
  const document = db.doc(`/rambles/${req.params.rambleId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Ramble not found.' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Not Authorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'Ramble successfully deleted' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: error.code });
    });
};
