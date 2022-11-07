const express = require('express')
const fs= require('fs')
const app = express()
const port = 8080

app.set('view engine', 'ejs');
app.use("/resurse", express.static(__dirname+"/resurse"))

obGlobal={
  erori:null
}

function createErrors() {
  var continutFisier = fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf-8")
  obGlobal.erori = JSON.parse(continutFisier)
}
createErrors()

function renderError(res, identificator, titlu, text, imagine){
  var eroare = obGlobal.erori.info_erori.find(function(elem){
      return elem.identificator==identificator;
  })
  titlu= titlu || (eroare && eroare.titlu) || obGlobal.erori.eroare_default.titlu;
  text= text || (eroare && eroare.text) || obGlobal.erori.eroare_default.text;
  imagine= imagine || (eroare && obGlobal.erori.cale_baza+"/"+eroare.imagine) || obGlobal.erori.cale_baza+"/"+obGlobal.erori.eroare_default.imagine;
  if(eroare && eroare.status){
      res.status(identificator).render("pagini/eroare", {titlu:titlu, text:text, imagine:imagine})
  }
  else{
      res.render("pagini/eroare", {titlu:titlu, text:text, imagine:imagine});
  }
}


console.log("Director proiect:",__dirname);

app.get(['/', '/home', '/index'],  (req, res) => {
  res.render('pagini/index', {ip: req.ip});
});

app.get("/*.ejs", (req, res) => {
  renderError(res, 403);  // 403 Forbidden
})

app.get("/*", (req, res) => {
  res.render("pagini"+req.url, (err, rezRender) => {
    if (err) {
      if(err.message.includes("Failed to lookup view")){
        console.log(err);
        // res.status(404).render("pagini/404");
        renderError(res,404,"Pagina nu a fost gasita","Pagina pe care o cautati nu exista","/resurse/img/404.png");
      } else {
        console.log(err);
        res.send("pagini/eroare_generala")
      }
    } else {
      res.send(rezRender);
    }
  })
})

app.listen(port);
console.log("A pornit la portul " + port)