const express = require ('express');
const bcrypt = require('bcryptjs');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());
const knex = require('knex');   //importds KNEX which is a sql quoery builder for node.js
const register = require('./controllers/register.js');
const image = require('./controllers/image.js'); 
const signin = require('./controllers/signin.js');

app.listen(process.env.PORT || 3000, () => {
    console.log(`listening please on port ${process.env.PORT}`) 
})


const db = knex({               //This is instantiating the KNEX database object
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'kyleoberholzer',
      password: '',
      database: 'smart_brain',  //specifies the database name for the KNEX database object
    },
  });

app.get('/', (req, res) => {
    res.send('Welcome to the Face Recognition Backend API!');
});

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});

app.post('/register', (req, res) => { register.handleRegister (req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db('users').where({ id }).then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }).catch(err => {
        res.status(400).json({ message: 'Error retrieving user' });
    });
})

app.put('/image', (req, res) => { image.handleImage(req, res, db)}) // this endpoint updates the current user's entry count score
app.post('/imageurl', (req, res) => { image.handleAPI(req, res)}) //this enpoint handles the API cal to Clarifai
