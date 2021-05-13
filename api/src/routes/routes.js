const express = require('express');
const router = express.Router();


// DB Connect
const redis = require('redis');
const db_client = redis.createClient(6379, 'db-redis');


db_client.on('connect', () => {
    console.log(`Connected to Redis's server`);
})


db_client.flushdb();
db_client.lpush("1", "Pj11", "Pj12", "Pj13", "Pj14", "Pj15", "asd");
db_client.lpush("2", "Pj21", "Pj22");
db_client.lpush("3", "Pj31");
db_client.lpush("4", "Pj41", "Pj42");
db_client.lpush("5", "");
db_client.lpush("6", "");
db_client.lpush("7", "");
db_client.lpush("8", "");
db_client.lpush("9", "");

const nombresEpisodios = [
    "La amenaza fantasma",
    "El ataque de los clones",
    "La venganza de los Sith",
    "Una nueva esperanza",
    "El imperio contraataca",
    "El regreso de los Jedi",
    "El despertar de la fuerza",
    "Los ultimos Jedi",
    "El ascenso de Skywalker"
]

router.get('/', (req, res) => {
    res.render('index', {nombresEpisodios});
});


router.get('/listar/:id', (req, res) => {      
    const episodio = req.params.id;

    db_client.lrange(episodio, 0, -1, function(err, values){
        if(!err){
            res.render('lista-pjs', {personajes: values})
        }
    });
})

router.get('/listar', (req, res) => { 
    
    let listaEpisodios = []
    db_client.keys('*', (error, reply) => {
        if (error) {
            console.log('Error al intentar obtener las claves');
        } else {
            listaEpisodios = reply.sort();
            res.render('listar', {episodios: listaEpisodios, nombres: nombresEpisodios});
        }
    })
});



router.get('/agregar', (req, res) => {

    let listaEpisodios = []
    db_client.keys('*', (error, reply) => {
        if (error) {
            res.render('agregar', {error})
        } else {
            listaEpisodios = reply.sort();
            res.render('agregar', {episodios: listaEpisodios, nombres: nombresEpisodios});
        }
    })
});

router.get('/eliminar', (req, res) => {
    
    let listaEpisodios = []
    db_client.keys('*', (error, reply) => {
        if (error) {
            console.log('Error al intentar obtener las claves');
        } else {
            listaEpisodios = reply.sort();
            res.render('eliminar', {episodios: listaEpisodios, nombres: nombresEpisodios});
        }
    })
});


router.post('/agregar', (req, res) => {

    const episodio = req.body.episodio || 0;
    const nombre = req.body.nombre.trim();

    db_client.lpos(episodio, nombre, (err, pos) => {
        if ((nombre !== "") && (pos === null)){
            db_client.lpush(episodio, nombre);
        }
    })
        
})


router.post('/eliminar', (req, res) => {

    const episodio = req.body.episodio || 0;
    const nombre = req.body.nombre.trim();

    db_client.lrem(episodio, 0, nombre, (err, reply) => { 
        db_client.exists(episodio, (err, reply) => {
            if (!reply){
                db_client.lpush(episodio, "");
            }
        })
    });

})



module.exports = router;
