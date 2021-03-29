// 28-March-2021
// npm install express mongodb cors body-parser
// npm install nodemon --save-dev
// npm install firebase-admin --save
// npm install dotenv

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const admin = require('firebase-admin');
const serviceAccount = require("./private_key/burj-al-arrab-firebase-adminsdk-iznzg-e7ad284308.json");
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z9kin.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;
app.listen(port);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// #####################################
//       MongoDB Section - Start
// #####################################

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookings = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);

  //###############################################
  //###############################################
  //###############################################
  app.post("/addBooking", (req, res) => {
    const newBookings = req.body;
    //====================================
    bookings.insertOne(newBookings)
      .then(result => {
        res.send(result.insertedCount > 0);
      });
    console.log({ newBookings });
  })

  //###############################################
  //###############################################
  //###############################################
  app.get("/booking", (req, res) => {

    const bearer = req.headers.authorization;
    const userEmail = req.query.email;

    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];
      console.log({ idToken });

      // idToken comes from the client app
      admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          //const uid = decodedToken.uid;

          const tokenEmail = decodedToken.email;

          console.log({ tokenEmail });
          console.log({ userEmail });
          //====================================
          if (tokenEmail === userEmail) {
            bookings.find({ email: userEmail })
              .toArray((err, documents) => {
                res.status(200).send(documents)
                //console.log({ email });
              })
          } else {
            res.status(401).send('un-authorize access : Email Not Match')
          }
        })
        .catch((error) => {
          res.status(401).send('un-authorize access : ' + error)
        });
    } else {
      res.status(401).send('un-authorize access for : ' + userEmail)
    }



  })


  // End Of MongoDB
  console.log('DB Connection ==> OK');
});
// #####################################
//       MongoDB Section - End
// #####################################



app.get('/', (req, res) => {
  res.send('<h1>NodeJS Server</h1>');
})