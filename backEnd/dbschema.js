let db = {
  rambles: [
    {
      userHandle: 'user',
      body: 'this is the ramble body',
      createdAt: '2021-04-08T19:03:33.381Z',
      likeCount: 5,
      commentCount: 2,
    },
  ],
  users: [
    {
      userId: 'dh23ggh5h32g543j5gf43',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2021-04-12T10:44:33.798Z',
      imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
      bio: 'Hello, my name is user, nice to meet you',
      website: 'https://user.com',
      location: 'Detroit, USA',
    },
  ],
  comments: [
    {
      userHandle: 'user',
      rambleId: 'kdjsfgdksuufhgkdsufky',
      body: 'Thats funny!',
      createdAt: '2019-03-15T10:59:52.798Z',
    },
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'john',
      read: 'true | false',
      rambleId: 'kdjsfgdksuufhgkdsufky',
      type: 'like | comment',
      createdAt: '2019-03-15T10:59:52.798Z',
    },
  ],
};

const userDetails = {
  // Redux data
  credentials: {
    userId: 'N43KJ5H43KJHREW4J5H3JWMERHB',
    email: 'user@email.com',
    handle: 'user',
    createdAt: '2019-03-15T10:59:52.798Z',
    imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
    bio: "at least i'm not homeless...",
    website: 'https://user.com',
    location: 'Detroit, USA',
  },
  likes: [
    {
      userHandle: 'user',
      rambleId: 'hh7O5oWfWucVzGbHH2pa',
    },
    {
      userHandle: 'user',
      rambleId: '3IOnFoQexRcofs5OhBXO',
    },
  ],
};
