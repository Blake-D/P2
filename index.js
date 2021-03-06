require('dotenv').config() // configures environment variables
const db = require('./models')
const express = require('express')
const axios = require('axios')
// const cheerio = require('cheerio')
const ejsLayouts = require('express-ejs-layouts')
const app = express()
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn.js')

// set the view engine to ejs
app.set('view engine', 'ejs')
// tells the app to use ejs layouts
app.use(ejsLayouts)

// body parser middleware (allows us to receive form data in req.body)
app.use(express.urlencoded({extended: false}))

// session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// flash middleware
app.use(flash())

// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
// before every route, attach the flash message and current user to res.locals
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next() // move on to the next piece of middleware
})

// controller middleware
app.use('/auth', require('./controllers/auth'))

app.get('/', (req, res) => {
    let starwarsUrl = 'https://swgoh.gg/api/ships/stats'
    axios.get(starwarsUrl).then(apiResponse => {
        console.log(apiResponse.data)
        let ships = apiResponse.data
        res.render('home', { ships: ships })
    })
})

// app.get('/', (req, res) => {
//     axios.get('https://swgoh.gg/ships/stats/')
//     .then(response => {
//         let $ = cheerio.load(response.data)
//         let result = $('').find('a').attr('')
//         console.log(result)
//     })
// })

app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile')
})

// app.post('/fleet' (req, res) => {
//     db.starWars.findOrCreate
// })

app.get('*', (req, res) => {
    res.render('404.ejs')
})

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})

// module.exports = server