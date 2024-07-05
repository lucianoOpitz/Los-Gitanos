const https = require("https");
const fs = require("fs");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
let cart=-1
let automotores=-1
const options = {
    key: fs.readFileSync("./localhost-key.pem"), // Reemplaza con la ruta de tu llave generada
    cert: fs.readFileSync("./localhost.pem"), // Reemplaza con la ruta de tu certificado generado
};

// ruta de archivos estáticos
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("public"));
app.use(express.json());
app.delete('/:id', (req,res)=>{
    if(req.body.count == true){
        if(cart==-1){ 
            cart=require('./public/cart.json');
        }
        let updateCart = []
        for (let index = 0; index < cart.length; index++) {
            if(cart.at(index).id != req.body.id){
                updateCart.push(cart.at(index))
            }
        }
        cart=updateCart
        console.log(cart)
        let jsonData = JSON.stringify(cart);
        fs.writeFile('./public/cart.json', jsonData, (error)=>{
            if(error){
                console.log(`Error: ${error}`);
            }
        });
    }else {
        let match = false
        if(automotores==-1){ 
            automotores=require('./public/automotores.json');
        }
        let updateAutomotores = []
        for (let index = 0; index < automotores.length; index++) {
            if(automotores.at(index).id != req.body.id){
                if(match==true){
                    automotores.at(index).id = index;
                }
                updateAutomotores.push(automotores.at(index));
            }else if(automotores.at(index).id == req.body.id){
                match=true;
            }
        }
        automotores = updateAutomotores
        let jsonData = JSON.stringify(automotores);
        fs.writeFile('./public/automotores.json', jsonData, (error)=>{
            if(error){
                console.log(`Error: ${error}`);
            }
        });
    }
}); 
app.post('/:id', (req,res)=>{
    if(cart==-1){ 
        cart=require('./public/cart.json');
    }
    if(req.body.count > 0){
        let nuevo = req.body
        cart.push(nuevo)
        console.log(cart)
        let jsonData = JSON.stringify(cart);
        fs.writeFile('./public/cart.json', jsonData, (error)=>{
            if(error){
                console.log(`Error: ${error}`);
            }
        });
    }else{
        if(automotores==-1){ 
            automotores=require('./public/automotores.json');
        }
        let nuevo = req.body
        automotores.push(nuevo)
        console.log(automotores)
        let jsonData = JSON.stringify(automotores);
        fs.writeFile('./public/automotores.json', jsonData, (error)=>{
            if(error){
                console.log(`Error: ${error}`);
            }
        });
    }
});
app.patch('/:id', (req,res)=>{
    if(req.body.count > 0){
        if(cart==-1){ 
            cart=require('./public/cart.json');
        }
        let i = req.body.position
        cart.at(i).id = req.body.id
        cart.at(i).count = req.body.count
        cart.at(i).nombre = req.body.nombre
        cart.at(i).modelo = req.body.modelo
        cart.at(i).anio = req.body.anio
        cart.at(i).precio = req.body.precio
        let jsonData = JSON.stringify(cart);
        fs.writeFile('./public/cart.json', jsonData, (error)=>{
            if(error){
                console.log(`Error: ${error}`);
            }
        });
    }else{
        if(automotores==-1){ 
            automotores=require('./public/automotores.json');
        }
        let i = req.body.id - 1
        automotores.at(i).id = req.body.id
        automotores.at(i).nombre = req.body.nombre
        automotores.at(i).modelo = req.body.modelo
        automotores.at(i).anio = req.body.anio
        automotores.at(i).precio = req.body.precio
        console.log(automotores.at(i))
        let jsonData = JSON.stringify(automotores);
        fs.writeFile('./public/automotores.json', jsonData, (error)=>{
            if(error){
                console.log(`Error: ${error}`);
            }
        });
    }
});
const port = 3000;
https.createServer(options, app).listen(port, () => {
    console.log("Server listening on port " + port);
});
