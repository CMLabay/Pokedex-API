require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const POKEDEX = require('./pokedex.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychich`, `Rock`, `Steel`, `Water`]
app.use(function validateBearerToken(req, res, next) {
    const bearerToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    //move to the next middleware
    if(bearerToken !== apiToken){
        return res.status(401).json({ error: 'Unauthorized request' })    
    }
    next()
})

function handleGetTypes(req, res){
    res.json(validTypes)
}

app.get('/types', handleGetTypes)
app.get('/pokemon', handleGetPokemon)

function handleGetPokemon(req, res){
    const { name, type } = req.query;
    let results = POKEDEX.pokemon;

    if(name){
        results = results.filter(pokemon =>
            pokemon.name.toLowerCase().includes(name.toLowerCase())
        )
    }
    if(type){
        if(![`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychich`, `Rock`, `Steel`, `Water`].includes(type)){
            return res
                .status(400)
                .send('Type must be one of these: Bug, Dark, Dragon, Electric, Fairy, Fighting, Fire, Flying, Ghost, Grass, Ground, Ice, Normal, Poison, Psychich, Rock, Steel, or Water');
        }
    }

    //filter the results
    if(type){
        results = results.filter(pokemon => 
                    pokemon.type.includes(type));
    }
    res.json(results);
    
}


const PORT = 8002
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`)
})