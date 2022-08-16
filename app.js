const express = require('express')
const app = express()
const port = 8080

app.set('view engine', 'ejs');
app.use("/resurse", express.static(__dirname+"/resurse"))

console.log("Director proiect:",__dirname);

app.get(['/', '/home', '/index'],  (req, res) => {
  res.render('pagini/index');
});

app.get("/*", (req, res) => {
  res.render("pagini"+req.url, (err, rezRender) => {
    if (err) {
      if(err.message.includes("Failed to lookup view")){
        console.log(err);
        res.status(404).render("pagini/404");
      } else {
        res.send("pagini/eroare_generala")
      }
    } else {
      res.send(rezRender);
    }
  })
})

app.listen(port);
console.log("A pornit la portul " + port)