const express = require("express")
const axios = require("axios")
const app = express();
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Jeaquino:Maiten22@cluster0.jemj5.mongodb.net/criptomoneda?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

const mongoUrl = "mongodb+srv://Jeaquino:Maiten22@cluster0.jemj5.mongodb.net/criptomoneda?retryWrites=true&w=majority";

//CORS middleware
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.post("/", async (req, res) => {
    await client.connect();

    const database = client.db("criptomoneda")
    const collection = database.collection("usuarios");

    let numero = 0
    let persona = ""

    const action = req.body.queryResult.action;
    const datos = req.body.originalDetectIntentRequest.payload.data.from
    console.log(datos.id)
    switch (action) {
        case "bienvenida":
            persona = await collection.find({
                id: datos.id
            }).toArray();
            if (persona[0] != undefined) {
                res.json({
                    fulfillmentText: `Bienvenido ${persona[0].nombre}! 
Por favor indique que cotización de criptomoneda desea saber
                    1- Bitcoin
                    2- Ethereum 
                    3- Monero
                    4- Todas`
                });
            } else {
                res.json({
                    fulfillmentText: `Hola ${datos.first_name}, no se encuentra registrad@. Para acceder a nuestro servicio debe registrarse.

Desea realizar el registro? (S/N)`
                });
            }
            break;

        case "Registro.Registro-yes":
            persona = req.body.queryResult.parameters;
            const result = await collection.insertOne({
                id: datos.id,
                nombre: persona.nombre,
                dni: persona.dni,
                ciudad: persona.ciudad,
                pais: persona.pais,
                mail: persona.mail,
                date: new Date()
            });
            res.json({
                fulfillmentText: `Guardado con exito ${persona.nombre}!!
Por favor indique que cotización de criptomoneda desea saber:
                    1- Bitcoin
                    2- Ethereum 
                    3- Monero
                    4- Todas`
            });

            break;

        case "bitcoin":
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=ars`).then(respuesta => {
                res.json({
                    fulfillmentText: `El valor actual de Bitcoint en pesos Argentinos es de $ ${respuesta.data.bitcoin.ars}!`
                })
            });
            break;

        case "ethereum":
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=ars`).then(respuesta => {
                res.json({
                    fulfillmentText: `El valor actual de Ethereum en pesos Argentinos es de $ ${respuesta.data.ethereum.ars}!`
                })
            });
            break;

        case "monero":
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=ars`).then(respuesta => {
                res.json({
                    fulfillmentText: `El valor actual de Monero en pesos Argentinos es de $ ${respuesta.data.monero.ars}!`
                })
            });
            break;

        case "all":
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=ars`).then(btn => {
                axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=ars`).then(eth => {
                    axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=ars`).then(mnr => {
                        res.json({
                            fulfillmentText: `El valor actual de las criptomonedas en pesos Argentinos es de: 
                    -Bitcoint $ ${btn.data.bitcoin.ars}
                    -Ethereum $ ${eth.data.ethereum.ars}
                    -Monero $ ${mnr.data.monero.ars}`
                        });
                    }).catch(error => {
                        console.log(error)
                    })
                })
            })

            break;

        default:
            res.json({
                fulfillmentText: "No comprendo su consulta, intente nuevamente"
            });
            break
    }
});

app.get("/usuarios", async (req, res) => {
    await client.connect();

    const database = client.db("criptomoneda");
    const collection = database.collection("usuarios");
    const personas = await collection.find({}).toArray();
    res.json({
        personas: personas
    });
})

app.listen(process.env.PORT || 3001);