const express= require("express");
const fs=require("fs");
const sharp=require("sharp");
const {Client}=require("pg");
const ejs= require("ejs");
const sass=require("sass");

var client= new Client({database:"grupa151",user:"grupa151", password:"grupa151", host:"193.226.51.46", port:1521});
client.connect();


app= express();



app.set("view engine","ejs");


app.use("/resurse", express.static(__dirname+"/resurse"))

console.log("Director proiect:",__dirname);

app.get(["/", "/index", "/home"], function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    //console.log(obImagini);
    /*client.query("select * from tabel", function(err, rezQuery){
        console.log(rezQuery);
        res.render("pagini/index", {ip:req.ip, imagini:obImagini.imagini, produse: rezQuery.rows });
    })*/
    res.render("pagini/index", {ip:req.ip, imagini:obImagini.imagini });

    
    
})

app.get("/eroare", function(req, res){
    randeazaEroare(res,1, "Titlu schimbat");

});


app.get("*/galerie-animata.css",function(req, res){
    /* TO DO
    citim in sirScss continutul fisierului galerie_animata.scss
    setam culoare aleatoare din vectorul culori=["navy","black","purple","grey"]
    in variabila rezScss compilam codul ejs din sirScss
    scriu rezScss in galerie-animata.scss din folderul temp 
    compilez scss cu sourceMap:true
    scriu rezultatul in "temp/galerie-animata.css"
    setez headerul Content-Type
    trimit fisierul css
    */
    var sirScss=fs.readFileSync(__dirname+"/resurse/scss/galerie_animata.scss").toString("utf8");
    var culori=["navy","black","purple","grey"];
    var indiceAleator=Math.floor(Math.random()*culori.length);
    var culoareAleatoare=culori[indiceAleator]; 
    rezScss=ejs.render(sirScss,{culoare:culoareAleatoare});
    console.log(rezScss);
    var caleScss=__dirname+"/temp/galerie_animata.scss"
    fs.writeFileSync(caleScss,rezScss);
    try {
        rezCompilare=sass.compile(caleScss,{sourceMap:true});
        
        var caleCss=__dirname+"/temp/galerie_animata.css";
        fs.writeFileSync(caleCss,rezCompilare.css);
        res.setHeader("Content-Type","text/css");
        res.sendFile(caleCss);
    }
    catch (err){
        console.log(err);
        res.send("Eroare");
    }
});


app.get("/*.ejs", function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    //res.status(403).render("pagini/403");
    randeazaEroare(res,403);
})

app.get("*/galerie-animata.css.map",function(req, res){
    res.sendFile(path.join(__dirname,"temp/galerie-animata.css.map"));
});

/*
app.get("/despre", function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    res.render("pagini/despre");
})
*/
app.get("/ceva", function(req, res, next){
    res.write("<p style='color:pink'>Salut-1</p>");
    console.log("1");
    next();
    //res.end();
})
app.get("/ceva", function(req, res, next){
    res.write("Salut-2");
   
    console.log("2");
    next();
})


app.get("/*", function(req, res){
    res.render("pagini"+req.url, function(err, rezRender){
        if (err){
            if(err.message.includes("Failed to lookup view")){
                console.log(err);
                //res.status(404).render("pagini/404");
                randeazaEroare(res,404);
            }
            else{
                
                res.render("pagini/eroare_generala");
            }
        }
        else{
            console.log(rezRender);
            res.send(rezRender);
        }
    });
   
    //console.log("generala:",req.url);
    res.end();
})

function creeazaImagini(){
    var buf=fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf8");


    obImagini=JSON.parse(buf);//global



    //console.log(obImagini);
    for (let imag of obImagini.imagini){
        let nume_imag, extensie;
        [nume_imag, extensie ]=imag.fisier.split(".")// "abc.de".split(".") ---> ["abc","de"] imagine.png->imagine.webp
        let dim_mic=150
        
        imag.mic=`${obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp` //nume-150.webp // "a10" b=10 "a"+b `a${b}`
        //console.log(imag.mic);


        imag.mare=`${obImagini.cale_galerie}/${imag.fisier}`;
        if (!fs.existsSync(imag.mic))
            sharp(__dirname+"/"+imag.mare).resize(dim_mic).toFile(__dirname+"/"+imag.mic);


        let dim_mediu=300;
        imag.mediu=`${obImagini.cale_galerie}/mediu/${nume_imag}-${dim_mediu}.png` 
        if (!fs.existsSync(imag.mediu))
            sharp(__dirname+"/"+imag.mare).resize(dim_mediu).toFile(__dirname+"/"+imag.mediu);

        
    }

}
creeazaImagini();


function creeazaErori(){
    var buf=fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf8");
    obErori=JSON.parse(buf);//global
}
creeazaErori();

function randeazaEroare(res, identificator, titlu, text, imagine){
    var eroare= obErori.erori.find(function(elem){return elem.identificator == identificator});
    titlu= titlu || (eroare && eroare.titlu) || "Titlu eroare custom";
    text= text || (eroare && eroare.text) || "Titlu eroare custom";
    imagine= imagine || (eroare && (obErori.cale_baza+"/"+eroare.imagine)) || "Titlu eroare custom";
    if(eroare && eroare.status)
        res.status(eroare.identificator);
    res.render("pagini/eroare_generala",{titlu:titlu, text:text, imagine: imagine});

}





app.listen(8080);
console.log("A pornit")
