// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require('axios');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect('mongodb+srv://project:project@cluster0.kos1k7l.mongodb.net/stockApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const stockSchema = new mongoose.Schema({
    symbol: String,
    qty: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Stock = mongoose.model('Stock', stockSchema);
const User = mongoose.model('User', userSchema);

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!(await user.validatePassword(password))) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});


app.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const stocks = await Stock.find({ user: req.user._id });

        // Fetch stock values using Alpha Vantage API
        const apiKey = '6VWT72JNHHLBF3MH';
        const stockPromises = stocks.map(async stock => {
            const symbol = stock.symbol;
            const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

            try {
                const response = await axios.get(apiUrl);
                const data = response.data;
                const latestTime = data["Meta Data"]["3. Last Refreshed"];
                const latestValue = data["Time Series (5min)"][latestTime]["1. open"];

                stock.symbolValue = parseFloat(latestValue);
            } catch (error) {
                console.error(`Error fetching stock value for ${symbol}:`, error.message);
                stock.symbolValue = 0; // Set a default value on error
            }

            return stock;
        });

        const updatedStocks = await Promise.all(stockPromises);


        res.render('index', { stocks: updatedStocks });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const stocks = await Stock.find({ user: req.user._id });

        // Calculate chart data
        const chartLabels = stocks.map(stock => stock.symbol);
        const chartData = stocks.map(stock => stock.qty * stock.symbolValue);

        res.render('index', { stocks, chartLabels, chartData });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});




app.post('/addStock', ensureAuthenticated, async (req, res) => {
    const { symbol, qty } = req.body;
    try {
        const userStocks = await Stock.find({ user: req.user._id });
        if (userStocks.length >= 5) {
            return res.status(400).send('Maximum stock limit reached');
        }


        await Stock.create({ symbol, qty, user: req.user._id });

        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});



app.post('/deleteStock', ensureAuthenticated, async (req, res) => {
    const { id } = req.body;
    try {
        await Stock.findByIdAndDelete(id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/stocks', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = req.session.user;

        const stocks = await Stock.find({ user: user._id });
        res.json(stocks);
    } catch (err) {
        console.error('Error fetching stock data:', err);
        res.status(500).json({ error: 'Error fetching stock data.' });
    }
});

app.get('/stocks', async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (err) {
        console.error('Error fetching stock data:', err);
        res.status(500).json({ error: 'Error fetching stock data.' });
    }
});
// Routes
app.get('/index', (req, res) => {
    res.redirect('/');
});
app.get('/api', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'api.html');
    res.sendFile(filePath);
});
app.get('/news', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'news.html');
    res.sendFile(filePath);
});
app.get('/sitemap', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'sitemap.html');
    res.sendFile(filePath);
});
app.get('/asian', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'asian.html');
    res.sendFile(filePath);
});
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
app.use('/js', (req, res, next) => {
    res.setHeader('Content-Type', 'application/javascript');
    next();
});
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.get('/video', (req, res) => {
    res.render('video');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
