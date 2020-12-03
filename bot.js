const express = require("express")
const axios = require("axios")
const {
    MongoClient
} = require("mongodb")
const app = express();

app.use(express.json());

const mongoUrl = "mongodb://127.0.0.1:27017";

const client = new MongoClient(mongoUrl);

app.post("/", async (req, res) => {
    await client.connect();

    const database = client.db("criptomoneda");
    const collection = database.collection("usuarios");
    let numero = 0
    let persona = ""

    const action = req.body.queryResult.action;
    switch (action) {
        case "bienvenida":
            numero = req.body.queryResult.parameters.number;
            persona = await collection.find({
                id: numero
            }).toArray();
            console.log(persona)
            if (persona[0].nombre != undefined) {
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
                    fulfillmentText: `No se encuentra registrado, para acceder a nuestro servicio debe registrarse.
                    Desea realizar el registro? (S/N)`
                });
            }
            break;

        case "Registro.Registro-yes":
            numero = req.body.queryResult.parameters.numero
            persona = req.body.queryResult.parameters;
            console.log(numero)
            const usuario = await collection.find({id: numero}).toArray()
            console.log(usuario)
            if (usuario[0].id != undefined) {
                res.json({
                    fulfillmentText: `${persona.nombre}, el número ${persona.numero} ya se encuentra registrado, por favor intente nuevamente`
                })
            } else {
                const result = await collection.insertOne(persona);
                res.json({
                    fulfillmentText: `Guardado con exito ${persona.nombre}!!
                    Por favor indique que cotización de criptomoneda desea saber:
                    1- Bitcoin
                    2- Ethereum 
                    3- Monero
                    4- Todas`
                });
            }
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
                    fulfillmentText: `El valor actual de Bitcoint en pesos Argentinos es de $ ${respuesta.data.ethereum.ars}!`
                })
            });
            break;

        case "monero":
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=ars`).then(respuesta => {
                res.json({
                    fulfillmentText: `El valor actual de Bitcoint en pesos Argentinos es de $ ${respuesta.data.monero.ars}!`
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



    /*const {numero1, numero2} = req.body.queryResult.parameters;
        const resultado = numero1 + numero2;
        res.json({
            fulfillmentText: `El resultado de la suma es ${resultado}`
        })
    */
});

app.get("/datos", async (req, res) => {
    await client.connect();

    const database = client.db("criptomoneda");
    const collection = database.collection("usuarios");
    const personas = await collection.find({}).toArray();
    console.log(personas);
    res.json({
        personas: personas
    });
})

app.listen(8080);