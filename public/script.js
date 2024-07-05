let automotores = domHtml("automotores")
let arregloServidor = []
let ids
let sameData
let posicion
let httpCart="https://localhost:3000/cart.json"
let httpCars="https://localhost:3000/automotores.json"
function domHtml(valor){
    return document.getElementById(valor)
}
class ReqResSer{
    apertura;
    lochttp;
    constructor(apertura, lochttp){
        this.apertura=apertura;
        this.lochttp=lochttp;
    }
    reqRes(body){
        const xhr = new XMLHttpRequest();
        xhr.open(this.apertura, this.lochttp);
        if(this.apertura=="GET"){
            xhr.send();
            xhr.responseType = "json";
        }else{
            xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
        }
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if(this.apertura=="GET" && body==0){
                    const data = xhr.response;
                    sameData = data;
                    console.log(data);
                }else if(this.apertura=="GET" && body==1){
                    const data = xhr.response;
                    console.log(data)
                    this.getAutomotores(data)
                }else{
                    var data = JSON.parse(xhr.responseText);
                    console.log(data);
                }
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        if(body!=0 && body!=1){
            xhr.send(body);
        }
    }
    getCargar(tipo, ubicacion, body){
        this.setAp(tipo)
        this.setHttp(ubicacion)
        this.reqRes(body)
    }
    getAutomotores(data){
        arregloServidor = data
        for (let i = 0; i < data.length; i++) {
            let cargaAuto = new Automotor
            cargaAuto.setCargarAutomotores(data[i].id,data[i].nombre, data[i].modelo, data[i].anio, data[i].precio)
        }
    }
    setAp(valor){
        this.apertura=valor
    }
    setHttp(valor){
        this.lochttp=valor
    }
    setAddCart(idCar, idCant){
        let cant = domHtml(idCant)
        let cantidad = parseInt(cant.value)
        let repetido=false
        ids=sameData.length
        if(ids!=0){
            for(let i = 0; i<ids;i++){
                if(idCar==sameData[i].id){
                    let posicion=i
                    let contador = parseInt(sameData[i].count) + cantidad
                    repetido=true
                    const body = JSON.stringify({
                        position: posicion,
                        id: idCar,
                        count: contador,
                        nombre: arregloServidor[idCar-1].nombre,
                        modelo: arregloServidor[idCar-1].modelo,
                        anio: arregloServidor[idCar-1].anio,
                        precio: arregloServidor[idCar-1].precio,
                    });
                    pilaCart.getCargar("PATCH", httpCart, body)
                }
            }
        }
        if(repetido==false){
            ids=ids+1
            let i = idCar-1;
            const body = JSON.stringify({
                id:idCar,
                count:cantidad,
                nombre:arregloServidor[i].nombre,
                modelo:arregloServidor[i].modelo,
                anio:arregloServidor[i].anio,
                precio:arregloServidor[i].precio
            });
            pilaCart.getCargar("POST", httpCart, body)
            cant.value = 1
        }
        repetido=false
    }
}
let pilaCart = new ReqResSer 
let pilaCars = new ReqResSer
class Automotor {
    nombre;
    modelo;
    age;
    price;
    constructor(id,nombre, modelo, age, price) {
        this.id=id;
        this.nombre = nombre;
        this.modelo = modelo;
        this.age = age;
        this.price = price;
    }
    setCargarAutomotores(num,name,model,time,sell) {
        this.id=num
        this.nombre=name
        this.modelo=model
        this.age=time
        this.price=sell
        let arregloCar=[]
        let arregloModelo = ["Modelo", this.modelo]
        let arregloAnio = ["Año", this.age]
        let arregloPrice = ["Precio", this.price]
        arregloCar.push(arregloModelo,arregloAnio,arregloPrice)
        this.getCarInner(arregloCar)
    }
    getCarInner(arr){
        let escHtml=""
        arr.forEach(car => {
        escHtml +=`
            <div class="form">
                  <label for="${car[1]}">${car[0]}</label>
                  <output id="${car[1]}" type="text" class="show-automotor">${car[1]}</output>
            </div>
        `
        });
        automotores.innerHTML +=`
            <fieldset class="lista-automotores">
            <legend>${this.nombre}</legend>
            ${escHtml}
            <button class="mas-menos" onClick="menos(${this.id})">-</button>
            <output id="${this.id}-cant" type="text" class="show-automotor">1</output>
            <button class="mas-menos" onClick="mas(${this.id})">+</button>
            <button class="add-cart" onClick="addCart(${this.id}, ${this.id}+'-cant')">Add to Cart</button>
            </fieldset>
        `
    }
}
function iniciar(){
    pilaCart.getCargar("GET",httpCart, 0)
    pilaCars.getCargar("GET",httpCars, 1)
}
function addCart(idCar, idCant){
    pilaCart.setAddCart(idCar,idCant)
    reload()
}
function menos(coche){
    let cantidad = domHtml(coche+"-cant")
    if(cantidad.value>1){
        cantidad.innerHTML = cantidad.value - 1
    }
}
function mas(coche){
    let cantidad = domHtml(coche+"-cant")
    let valor = parseInt(cantidad.value)
    cantidad.innerHTML = valor +1
}
function reload(){
    setInterval("location.reload()",200)
}
window.addEventListener("load", iniciar)

