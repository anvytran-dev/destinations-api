const express =  require("express")
const fetch = require("node-fetch");
let {db: destinations} = require("./db")
const {generateUniqueId}= require("./services")
const server = express()
server.use(express.json())//body parser


const port = 3000;
server.listen(port)

//Endpoints

server.post("/destinations", async (req, res) => {



    const { name, location, photo, description } = req.body;

    // Make sure we have a name and location

    if(name === undefined || name.length === 0 || location === undefined || location.length === 0) {
            return res
                .status(400)
                .json({message: "Name and location are both required"})
        }
    const dest = {id: generateUniqueId(), name, location, photo, description};

    const API_KEY = "2vAoc_zs73pmQGlzynGD8AsbJmMCu-V3TjCKc5Kqu3I"
    const UNSPLASH_URL = `https://api.unsplash.com/photos/random/?client_id=QsPtItqyx9-VpUsYx2K7DlLKcxJ-Kg6EthZ1LimBMy8&query=${name}`
    console.log(UNSPLASH_URL)

    try{
        const res = await fetch(UNSPLASH_URL)
        const data = await res.json()
        dest.photo = data.urls.small
    } catch (error) {
        //placeholder photo
        console.log("error")
    }

    destinations.push(dest);

    res.redirect("/destinations")

});

server.get("/destinations", (req, res) => {

    const {continent} = req.query

    let dest = destinations

    if(continent !== undefined) {
        dest = destinations.filter(d => d.continent === continent) 
    }
    res.send(destinations)
});

server.put("/destinations/:id", (req, res) => {

    const destId = req.params.id
    const {id, name, location, photo, description} = req.body

    for(const dest of destinations) {
        if(dest.id === destId) {
            if (name !== undefined && name.length !== 0) {
                dest.name = name
            }
        }
    }

    // let revised = destinations.map((dest) => {
    //     if(dest.id === destId) {
    //         if (name !== undefined && name.length !== 0) {
    //             dest.name = name
    //         } else {
    //             dest = dest
    //         }
    //     }
    // })
    //console.log(revised)
    console.log(destinations)
    res.send(destinations)
    return res.json()
 
})

server.delete("/destinations/:id", (req, res) => {
    
    let destId = req.params.id
    
    let newDestinations = destinations.filter(dest => dest.id != destId)

    destinations = newDestinations

    res.send(destinations)
})