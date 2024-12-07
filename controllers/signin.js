const handleSignin = (req, res, db, bcrypt) => {
    
    const  {email, password} = req.body;
    if(!email || !password){                            //this checks to make sure the form submissions aren't blank
        return res.status(400).json ("Incorrect form submission")
    }


    db.select('email', 'hash').from('login')
    
            .where('email', '=', req.body.email)        //checks the entered username against the login table and returns an array with the user
            .then(data => {
                if (data.length === 0) {  // Check if data is empty
                    return res.status(400).json('invalid credentials'); // Return error if no user found
                }
                const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
                if (isValid) {
                    return db.select('*').from('users')
                        .where('email', '=', req.body.email)
                        .then(user => {
                            console.log(user);
                            res.json({
                                success: true,
                                user: user[0]
                            });
                        })
                        .catch(err => res.status(400).json('unable to retrieve user'));
                } else {
                    res.status(400).json('invalid credentials');
                }
            })
}

module.exports = {
    handleSignin: handleSignin
}