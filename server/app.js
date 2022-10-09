const express = require('express');
const pgp = require('pg-promise')();
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' })

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
});

require('dotenv').config()

const dbOptions = {
  connectionString: process.env.DATABASE_URL,
  max: 20,
  ssl: {
    rejectUnauthorized: false,
  },
};
const db = pgp(dbOptions);

app.get('/users', async (req, res) => {
  db.any('SELECT * FROM users')
  .then((data) => {
    res.status(200).json(data);
    return;
  })
  .catch((error) => {
    console.log('/users error', error);
    res.status(404).json({
      message: "Something went wrong, please try again."
    });
    return;
  });
})

app.get('/interests', (req, res) => {
  db.any('SELECT * FROM interests')
  .then((data) => {
    res.status(200).json(data);
    return;
  })
  .catch((error) => {
    console.log('/interests error', error);
    res.status(404).json({
      message: "Something went wrong, please try again."
    });
    return;
  });
})

app.get('/user/:id', (req, res) => {
  let result = {};

  db.one('SELECT * FROM users WHERE id = $1 ', [req.params.id])
  .then(async (api) => {
    result = api;
    try {
      const url = await cloudinary.api.resource(api.email);
      if (url) {
        result.picture = url.secure_url;
      }
    } catch (error) {
      console.log('/user/:id cloud error', error);
    }

    const sql = 'SELECT interests.name FROM users_interests RIGHT JOIN interests ON interests.id = users_interests.interests_id WHERE users_id = $1';

    await db.manyOrNone(sql, [api.id]).then((interest) => result.interest = interest.map(x => x.name))
    res.status(200).json(result);
    return;
  })
  .catch((error) => {
    console.log('/user/:id error', error);
    res.status(404).json({
      message: "Something went wrong, please try again."
    });
    return;
  });
})

app.post('/register', upload.single('picture'), async (req, res) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const date_of_birth = new Date(req.body.date_of_birth);
  const email = req.body.email;
  const children_count = req.body.children_count;
  const interest = req.body.interest ? req.body.interest.split(',') : [];

  const data = [{first_name, last_name, date_of_birth, email, children_count}];
  const cs = new pgp.helpers.ColumnSet(['first_name', 'last_name', 'date_of_birth', 'email', 'children_count'], {table: 'users'});
  const query = pgp.helpers.insert(data, cs);

  let userId = -1;

  try {
    const userData = await db.one(query + " RETURNING id");
    userId = userData.id;

    if (userId > -1 && interest.length > 0) {
      const csInterest = new pgp.helpers.ColumnSet(['users_id', 'interests_id'], {table: 'users_interests'});
      const interestData = interest.map(x => ({'users_id': userId, 'interests_id': x }));
      const queryInterest = pgp.helpers.insert(interestData, csInterest);
      await db.none(queryInterest);
    }

    if (req.file) {
      cloudinary.uploader.upload(req.file.path, { public_id: email });
    }
  }
  catch (error)
  {
    console.log('/register error', error);
    if (error.code == '23505') {
      res.status(422).json({
        message: "This email is already registered - please try again."
      });
      return;
    } else if (error.code = '3D000') {
      res.status(404).json({
        message: "Failed to connect - please refresh the page and try again."
      });
      return;
    }
  }

  res.status(200).json({
    message: "account created",
    id: userId
  });
  return;
})

app.listen(port, () => {
  console.log(`Pavers tech test listening on port ${port}`)
})

