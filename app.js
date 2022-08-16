const express = require('express')
const path = require('path');

const app = express()
const port = 8080

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static('resurse'))

// index page
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/home', function(req, res) {
  res.render('index');
})

app.get('/index', function(req, res) {
  res.render('index');
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port} and serving path ${path.join(__dirname, '/index.html')}`)
})