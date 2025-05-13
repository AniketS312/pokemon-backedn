const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const pokemonTemplate = require('./pokemonTemplate.js')
require('dotenv').config()

const supabase = require('./db.js');
app.use(express.json());


const allowedOrigins = ['http://localhost:3000', 'http://example.com'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Origin is allowed
    } else {
      callback(new Error('Not allowed by CORS')); // Origin is not allowed
    }
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/getpokemon',async (req, res, next) => {
   const { data, error } =  await supabase
    .from('pokemon')
    .select('*')
    if(error) {
        console.error(error)
        return res.status(500).send('Error fetching data')
    }
    res.send(data)
});

app.post('/addpokemon', async (req, res) => {
    const pokemonName = req.body.name,
          pokemonNumber = req.body.number || 1,
          pokemonType = req.body.type || 'null',
          pokemonShiny = req.body.shiny || false;
          
    // Check if pokemon already exisits and handle errors
    const { data, error } = await supabase
        .from('pokemon')
        .select()
        .ilike('name', pokemonName)
    // Error checking
    if(error) {
        console.error(error)
        return res.status(500).send('Error fetching data from database')
    }
    // Duplicate pokemon check
    if(data.length > 0) {
        console.log('Pokemon already exists')
        return res.status(400).send('Pokemon already exists in database')
    }
    // Add pokemon
    console.log('Adding pokemon')
    const addPokemon = pokemonTemplate(pokemonName, pokemonNumber, pokemonShiny, pokemonType)
    const { insertError } = await supabase
        .from('pokemon')
        .insert(addPokemon)
        if(insertError) {
            console.error(insertError)
            return res.status(500).send('Error inserting data into database')
        }
    res.status(200).send('Pokemon added to database')
})

app.delete('/removepokemon/:name', async (req, res) => {
    const pokemonName = req.params.name
    const { data, error } = await supabase
        .from('pokemon')
        .select()
        .ilike('name', pokemonName)
    // Error checking
    if(error) {
        return res.status(500).send('Error fetching data from database')
    }
    // Duplicate pokemon check
    if(data.length === 0) {
        return res.status(400).send('Pokemon Does not exist in database')
    }
    const response = await supabase
    .from('pokemon')
    .delete()
    .eq('name', pokemonName)
    res.send(response)
})




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


// Checdk to see fi pokemon exists
 // const { data, error } = await supabase
    //     .from('pokemon')
    //     .select()
    //     .ilike('name', pokemonName)
    //     console.log(data, error)
    // // Error checking
    // if(error) {
    //     console.error(error)
    //     return res.status(500).send('Error fetching data')
    // }
    // // Duplicate pokemon check
    // if(data.length === 0) {
    //     return res.status(400).send('Pokemon does not exist')
    // }

    // if(data.length > 0) {
    //     return res.status(200).send('Pokemon deleted')
    // }
    // res.send(`delete request`)
