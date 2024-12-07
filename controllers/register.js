
const handleRegister = (req, res, db, bcrypt) => {


    const { email, password, userName } = req.body;
    if(!email || !name ||!password){                            //this checks to make sure the form submissions aren't blank
        return res.status(400).json ("Incorrect form submission")
    }
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    db.transaction(trx => {             //transactions are used to enter into two DB tables simultaneously
        trx.insert({                    //first inserts the hashed password and username into login table
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')             //returns and array of objects
        .then(loginEmail => {
            return trx('users')         // NB! to return the promise here, it facilitates proper managemtn of the promise going down the chain        
            .insert({
                    name: userName,
                    email: loginEmail[0].email,     //accessing the email from the array of objects from .returning('email') statement
                    joined: new Date()
            })
            .returning('*')
            .then(response => {
                res.json({
                    success: true,
                    message: 'Registration successful',
                    user: response[0]
                });
            })
        })
        .then(trx.commit)               
        .catch(err => {
            trx.rollback();
            res.status(500).json({
                success: false,
                message: 'Transaction error',
                error: err.message
            });
        });
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            message: 'Transaction error',
            error: err.message
        });
    });
}

module.exports = {
    handleRegister: handleRegister
}