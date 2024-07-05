let httpCars="https://localhost:3000/automotores.json"
class ReqResSer{
    apertura;
    lochttp;
    dataCar;
    dataUp;
    constructor(apertura, lochttp,dataCar){
        this.apertura=apertura;
        this.lochttp=lochttp;
        this.dataCar=dataCar;
        this.dataUp=[]
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
                    this.dataCar = data;
                    console.log(data);
                    this.getAutomotores(data);
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
    modificarListar(i){
        let sel = document.getElementById(i)
        sel.value=i-1
        sel.id=i-1
    }
    getCargar(precio, ubicacion, body){
        this.setAp(precio)
        this.setHttp(ubicacion)
        this.reqRes(body)
    }
    getAutomotores(data) {
        for (let i = 0; i < data.length; i++) {
            let cargaAuto = new Automotor(data[i].id,data[i].nombre, data[i].modelo, data[i].anio, data[i].precio);
            pila.addAutoServidor(cargaAuto);
        }
    }
    setAp(valor){
        this.apertura=valor
    }
    setHttp(valor){
        this.lochttp=valor
    }
    setCargarAutos(){
        let body = modifyBody(this.dataCar.length+1, pila.nombreLoad(),pila.modeloLoad(),pila.anioLoad(), pila.precioLoad())
        pilaCars.getCargar("POST", httpCars, body)
        this.dataCar.push(body)
    }
    posicion(){
        for (let i = 0; i < this.dataCar.length; i++) {
            if(pila.nombre()==this.dataCar[i].nombre && pila.modelo()==this.dataCar[i].modelo && pila.anio()==this.dataCar[i].anio && pila.precio()==this.dataCar[i].precio){
                return this.dataCar[i].id;
            }
        }
    }
}
let pilaCars = new ReqResSer();
class ManipularDom {
    nombre;
    recursoACargar;
    constructor(nombre) {
        this.nombre = nombre;
        this.recursoACargar =  document.getElementById(this.nombre);
    }
    get() {
        return this.recursoACargar.value;
    }
    getRecursoACargar() {
        let item = this.recursoACargar.selectedIndex;
        return this.recursoACargar.options[item].value;
    }
    setCssDisplay(valor){
        this.recursoACargar.style.display=valor
    }
    setV(valor) {
        this.recursoACargar.value = valor;
    }
    setH(texto) {
        this.recursoACargar.innerHTML = texto;
    }
}
const modifi =  new ManipularDom("modificar");
const botonUp =  new ManipularDom("actualizar");
class Automotor {
    id;
    nombre;
    modelo;
    anio;
    precio;
    constructor(id, nombre, modelo, anio, precio) {
        this.id=id;
        this.nombre = nombre;
        this.modelo = modelo;
        this.anio = anio;
        this.precio = precio;
    }
    getNombre() {
        return this.nombre;
    }
    getModelo() {
        return this.modelo;
    }
    getAnio() {
        return this.anio;
    }
    getPrecio() {
        return this.precio;
    }
    get() {
        return (
            this.nombre + " " + this.modelo + " " + this.anio + " " + this.precio
        );
    }
    setNombre(nombre) {
        this.nombre = nombre;
    }
    setModelo(modelo) {
        this.modelo = modelo;
    }
    setanio(anio) {
        this.anio = anio;
    }
    setprecio(precio) {
        this.precio = precio;
    }
}
class Automotores {
    lista; //atributo que será el array contenedor
    contador; //atributo que mantiene el total de elementos
    item; //atributo que mantiene donde esta ubicado el usuario
    guiNombre1; //recurso caja nombre
    guiModelo1; //recurso caja edad
    guiAnio1;
    guiPrice1;
    guiSelect; //recurso para controlar id lista
    guiNombre2; //recurso caja nombre
    guiModelo2; //recurso caja edad
    guiAnio2;
    guiPrice2;
    guiLista; //recurso creado
    constructor() {
        this.contador = 0; //inicio contador
        this.lista = new Array(); //inicio lista instancio clase array
        this.item = 0; // inicio constador item
        this.guiNombre1 = new ManipularDom("entrada-nombre");
        this.guiModelo1 = new ManipularDom("entrada-modelo");
        this.guiAnio1 = new ManipularDom("entrada-marca");
        this.guiPrice1 = new ManipularDom("entrada-tipo");
        this.guiSelect = new ManipularDom("listar-automotor");
        this.guiNombre2 = new ManipularDom("nombre-show");
        this.guiModelo2 = new ManipularDom("modelo-show");
        this.guiAnio2 = new ManipularDom("marca-show");
        this.guiPrice2 = new ManipularDom("tipo-show");
    }
    limpiarSeleccionado(){
        this.guiNombre2.setV(" ");
        this.guiModelo2.setV(" ");
        this.guiAnio2.setV(" ");
        this.guiPrice2.setV(" ");
    }
    limpiar() {
        //limpia campos
        this.guiNombre1.setV(" ");
        this.guiModelo1.setV(" ");
        this.guiAnio1.setV(" ");
        this.guiPrice1.setV(" ");
    }
    listar() {
        let msj;
        let op0 = ' <div class="form-group"> <select  id="info">';
        let op1 = "<option ";
        let op2 = "</option>";
        let op3 = "</select>";
        let op4 =
            '<button onclick="presentar()" class="btn btn-primary">Ver </button></div>';
        if (this.contador > 0) {
            msj = op0;
            for (let i = 0; i < this.contador; i++) {
                msj +=
                    op1 + ' value="' + i + '"id="'+ i + '">' + this.getDatoNombre(i) + op2;
            }
            msj += op3 + op4;
            this.guiSelect.setH(msj);
            if (this.contador > 0) {
                this.guiLista = new ManipularDom("info");
            }
        }
    }
    add() {
        //metodo destinado a incorporar elementos a una lista
        let nodo = new Automotor(
            this.id=pilaCars.dataCar.length+1,
            this.guiNombre1.get(),
            this.guiModelo1.get(),
            this.guiAnio1.get(),
            this.guiPrice1.get(),
        );
        //alert(nodo.get())
        this.addAutoServidor(nodo)
    }
    limpiarAutos(data){
        let cambios = this.lista.length
        this.lista=data;
        if(cambios == data.length){
            this.pasar()
        }
    }
    addAutoServidor(car){
        this.lista.push(car);
        this.contador++;
        this.listar()
    }
    getDatoNombre(elemento) {
        return this.lista[elemento].getNombre();
    }
    getDatoModelo(elemento) {
        return this.lista[elemento].getModelo();
    }
    getDatoanio(elemento) {
        return this.lista[elemento].getAnio();
    }
    getDatoprecio(elemento) {
        return this.lista[elemento].getPrecio();
    }
    pasar() {
        this.guiNombre2.setV(
            this.lista[this.guiLista.getRecursoACargar()].getNombre(),
        );
        this.guiModelo2.setV(
            this.lista[this.guiLista.getRecursoACargar()].getModelo(),
        );
        this.guiAnio2.setV(
            this.lista[this.guiLista.getRecursoACargar()].getAnio(),
        );
        this.guiPrice2.setV(
            this.lista[this.guiLista.getRecursoACargar()].getPrecio(),
        );
    }
    nombre(){return this.guiNombre2.get()}
    modelo(){return this.guiModelo2.get()}
    anio(){return this.guiAnio2.get()}
    precio(){return this.guiPrice2.get()}
    nombreLoad(){return this.guiNombre1.get()}
    modeloLoad(){return this.guiModelo1.get()}
    anioLoad(){return this.guiAnio1.get()}
    precioLoad(){return this.guiPrice1.get()}
    cargarCambios(array){
        let valor
        for (let index = 1; index < 5; index++) {
            if (index==1){
                valor=this.nombre();
            }else if(index==2){
                valor=this.modelo();
            }else if(index==3){
                valor=this.anio();
            }else if(index==4){
                valor=this.precio();
            }
            let domMan = new ManipularDom("update-"+index)
            if(domMan.get() == undefined || domMan.get()==""){
                array.push(valor)
            }else{
                array.push(domMan.get())
            }
            domMan.setV("")
        }
    }
}
const pila = new Automotores();
pilaCars.getCargar("GET", httpCars, 0)
function modifyBody(num,name,model,age,price){
    const body = JSON.stringify({
        id:num,
        nombre:name,
        modelo:model,
        anio:age,
        precio:price
    }); 
    return body;
}
function cambiosEnCaja(valor){
    for (let index = 1; index < 5; index++) {
        let domMan= new ManipularDom("caja-update"+index)
        domMan.setCssDisplay(valor)
    }
}
function mostrarONo(botMod, botUp, contCaja){
    modifi.setCssDisplay(botMod)
    botonUp.setCssDisplay(botUp)
    cambiosEnCaja(contCaja)
}
function iniciar() {
    mostrarONo("none", "none", "none")
}
function cargar() {
    if (pila.nombreLoad() == "") {
        alert("No podemos ingresar un auto sin nombre");
    } else {
        pilaCars.setCargarAutos()
        pila.add();
        pila.limpiar();
        intervalo() 
    }
}
function presentar() {
    pila.pasar();
    mostrarONo("flex","none", "none")  
}
function mod(){
    mostrarONo("none", "flex", "flex")
}
function del(){
    let atNum = pilaCars.posicion();
    const body = JSON.stringify({
        count: false,
        id:atNum
    });
    pilaCars.getCargar("DELETE", httpCars, body)
    intervalo()
}
function up(){
    let newUpdate=[];
    pila.cargarCambios(newUpdate)
    let body = modifyBody(pilaCars.posicion(), newUpdate[0],newUpdate[1],newUpdate[2],newUpdate[3]);
    pilaCars.getCargar("PATCH", httpCars, body);
    intervalo() 
}
function intervalo(){
    setInterval("location.reload()", 200);
} 
window.addEventListener("load", iniciar);
