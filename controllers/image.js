const handleAPI = (req, res) => {
    const PAT = '97051bbb8edb45729bace018c1a640c8';
    const USER_ID = 'kyleoberholzer';
    const APP_ID = 'SmartBrain';
    const MODEL_ID = 'face-detection';
    const URL = req.body.imageUrl;


    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": URL
            }
          }
        }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: raw
    };

    fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, requestOptions)
    .then(response => response.json())
    .then(data => {      // Send the Clarifai API response back to the client
      res.json(data);
    })
    .catch(err => {
      console.error('Error communicating with Clarifai API:', err);
      res.status(500).json({ error: 'Unable to communicate with Clarifai API' });
    });

}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)    //Grabs user based off of id param
    .increment('entries', 1)            //KNEX to increment to entry count
    .returning('entries')               //KNEX sql to return this entries column
    .then(entries => {
        res.json(entries[0])            //send back the entry count to frontend as JSON object ( entries: ** )
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage: handleImage,
    handleAPI: handleAPI
}