var express = require('express')
var app = express()
const bodyParser = require('body-parser')
const https = require('https');

var cors = require('cors')
//Suponiendo "app" la variable obtenida como app=express()
app.use(cors())

var jwt = require('jwt-simple');
var moment = require('moment');
var money = require('money');
const fetch = require("node-fetch")

var conversionAPI = require('currency-conversion');
var conversionapi = new conversionAPI({
	access_key: "e8302d51ffcf05f12a5b27b4b4c75d5a"
});

const conversionkey = "e8302d51ffcf05f12a5b27b4b4c75d5a";

app.use(bodyParser.json())

var secretkey = '123456789'

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./database.db"
    },
    useNullAsDefault: true
});

//MIDDLEWARES

function checkAuth(pet, resp, next) {
    if(!pet.headers.authorization){
        resp.status(401);
        resp.send("Debes enviar un token");  
    }
    var token = pet.headers.authorization.split(" ")[1];
    var decoded = jwt.decode(token, secretkey);
    if (decoded) {
        if(decoded.exp < moment().valueOf()){
            //ha expirado el token
            resp.status(401);
            resp.send("El token ha expirado");
        }
        else{
            //el token está bien
            console.log("Token correctisimo");
            next();
        }
    }
    else {
        resp.status(401);
        resp.send("El token enviado no es correcto ESTO ES UN FALLO");      
    }
}


//CAPA WEB
app.get("/categorias", function(pet, resp){
    listarCategorias(function(datos){
        resp.send(datos)
        console.log(datos)
    })

})

//COMENTARIO 1
//COMENTARIO 2
//COMENTARIO 4
//COMENTARIO 5

app.get("/categorias/:id/productos", function(pet, resp){
    getProductosCategoria(parseInt(pet.params.id), function(datos){
        if(!datos[0]){
            resp.status(404);
            resp.send("No existe recurso con esa ID")
        }
        resp.send(datos)
        console.log(datos)
    })

})


app.post("/login", function(pet, resp){
    var usu = pet.body;
    console.log(usu);
    if(!usu.nick || !usu.password){
        resp.status(400)
        resp.send("Error, no se han dado credenciales suficientes")
    }
    getUsuarioNick(usu, function(datos){
        if(datos[0] && datos[0].password == pet.body.password){
            //token
            var payload = {
                login: usu.nick,
                exp: moment().add(10, 'minutes').valueOf()
            }
            var token = jwt.encode(payload, secretkey);
            resp.send(token);
        }
        else{
            resp.status(401)
            resp.send("Error en el login");
        }
    })

})

app.get("/productos", function(pet, resp){
    listarProductos(function(datos){
        var pagesize = pet.query.pagesize;
        var page = pet.query.page;
        if(pagesize && page){
            var first = (pagesize*(page - 1))
            var last  = (pagesize*page)
            var arr = datos.slice(first, last)
            if(!arr[0]){
                if(datos[first-1]){
                    resp.send("Esa era la última página D:");
                }
                else{
                    resp.status(400)
                    resp.send("Error, comprueba tus opciones de paginado")
                }
            }else{
                console.log(first + " " + last)
                resp.send(arr)
            }
            
        }
        else{
            resp.send(datos)
            console.log(datos)
        }
        
    })

})

app.get("/productos/:id", function(pet, resp){
    var conv = pet.query.conversion;
    getProducto(parseInt(pet.params.id), function(datos){
        if(!datos[0]){
            resp.status(404);
            resp.send("No existe recurso con esa ID")
        }
        if(conv){

            var old = datos[0].precio;
            var nuevo = 0;
            fetch("http://apilayer.net/api/live?access_key=" + conversionkey +"&currencies=" + conv + "&format=1").then(function (data){
                data.json().then(function (dat){
                    if(!dat.error){
                        var quotes = dat.quotes
                        var factor = Object.keys(quotes)[0]
                        nuevo = old * quotes[factor]
                        datos[0].precio = nuevo.toFixed(2)
                        console.log(quotes[factor])
                        resp.send(datos[0])
                        console.log(datos[0])
                    }
                    else{
                        console.log(dat)
                        resp.status(400)
                        resp.send("Error, comprueba que has introducido bien la moneda a convertir")
                    }
                })
            });
            
        }
        else{
            resp.send(datos[0])
            console.log(datos[0])
        }
    })

})

app.post("/productos", function(pet, resp){
    var prod = pet.body;
    if(!prod.nombre || !prod.categoria){
        resp.status(400)
        resp.send("Error, el nombre y la categoria son obligatorios.")
    }
    else{
        anyadirProducto(prod, function(datos){
            if(!datos){
                resp.status(400)
                resp.send("Error, el recurso no se creó. Revisa la sintáxis.")
            }
            var da = {id: datos[0]}
            resp.status(201);
            resp.send(da)
            console.log(da)
        })
    }

})

app.put("/productos", function(pet, resp){
    var prod = pet.body;
    if(!prod.id || !prod.nombre || !prod.categoria){
        resp.status(400)
        resp.send("Error, el nombre, la id y la categoria son obligatorios.")
    }
    else{
        actualizarProducto(prod, function(datos){
            if(!datos){
                resp.status(400)
                resp.send("Error, el recurso no se creó. Revisa la sintáxis y que la ID sea correcta.")
            }
            resp.status(201)
            var da = {id: prod.id}
            resp.send(da)
            console.log(da)
        })
    }


})

app.delete("/productos", function(pet, resp){
    var prod = pet.body;
    deleteProducto(prod, function(datos){
        if(datos){
            var da = {id: prod.id}
            resp.send(da)
        }
        else{
            resp.status(404)
            resp.send("Error, el recurso para eliminar no fue encontrado");
        }
    })

})

app.get("/pedidos",checkAuth, function(pet, resp){
    listarPedidos(function(datos){
        resp.send(datos)
        console.log(datos)
    })

})

app.get("/linpedidos", function(pet, resp){
    listarLinpedidos(function(datos){
        resp.send(datos)
        console.log(datos)
    })

})

app.get("/packs", function(pet, resp){
    listarPacks(function(datos){
        resp.send(datos)
        console.log(datos)
    })

})

app.get("/packs/:id", function(pet, resp){
    getPack(parseInt(pet.params.id), function(datos){
        if(!datos[0]){
            resp.status(404);
            resp.send("No existe recurso con esa ID")
        }
        resp.send(datos[0])
        console.log(datos[0])
    })

})

app.get("/packs/:id/productos", function(pet, resp){
    getProductosPack(parseInt(pet.params.id), function(datos){
        if(!datos[0]){
            resp.status(404);
            resp.send("No existe recurso con esa ID")
        }
        resp.send(datos)
        console.log(datos)
    })

})


//CAPA DE ACCESO A DATOS
function listarProductos(callback) {
    knex.select().from('productos')
    .then(function(datos){
      callback(datos)
    })
}

function getUsuarioNick(usu, callback) {
    knex.select().from('usuarios').where({nick: usu.nick})
    .then(function(datos){
      callback(datos)
    })
}

function listarCategorias(callback) {
    knex.select().from('categorias')
    .then(function(datos){
      callback(datos)
    })
}

function listarPedidos(callback) {
    knex.select().from('pedidos')
    .then(function(datos){
      callback(datos)
    })
}

function listarLinpedidos(callback) {
    knex.select().from('linpedidos')
    .then(function(datos){
      callback(datos)
    })
}

function listarPacks(callback) {
    knex.select().from('packs')
    .then(function(datos){
      callback(datos)
    })
}

function getPack(idpack, callback) {
    knex.select().from('packs').where({id: idpack})
    .then(function(datos){
      callback(datos)
    })
}

function getProducto(idproducto, callback) {
    knex.select().from('productos').where({id: idproducto})
    .then(function(datos){
      callback(datos)
    })
}

function getProductosPack(idpack, callback) {
    knex.select().from('productos').whereIn('id', function(){
        this.select('productos_id').from('prodtopacks').where({packs_id: idpack});
    })
    .then(function(datos){
      callback(datos)
    })
}

function getProductosCategoria(idcategoria, callback) {
    knex.select().from('productos').where({categoria_id: idcategoria})
    .then(function(datos){
      callback(datos)
    })
}

function anyadirProducto(prod, callback) {
    knex('productos').insert({nombre: prod.nombre, descripcion: prod.descripcion, precio: prod.precio, categoria_id: prod.categoria})
    .then(function(datos){
      callback(datos)
    })
}

function actualizarProducto(prod, callback) {
    knex('productos').where({id: prod.id}).update({nombre: prod.nombre, descripcion: prod.descripcion, precio: prod.precio, categoria_id: prod.categoria})
    .then(function(datos){
      callback(datos)
    })
}

function deleteProducto(prod, callback) {
    knex('productos').where({id: prod.id}).delete()
    .then(function(datos){
      callback(datos)
    })
}



// INICIAR SERVIDOR

app.listen(3000, function(){
    console.log("Servidor en marcha!!")
})