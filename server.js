require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const POKEDEX = require('./pokedex.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychich`, `Rock`, `Steel`, `Water`]
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if(!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).json({error: 'Unauthorized request'})
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

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production'){
        response = { error: { message: 'server error' }}
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`)
})