const express = require("express")
const cors = require("cors")
const fetch = require("node-fetch");
let { db: destinations } = require("./db")
const { generateUniqueId } = require("./services")


const server = express()
server.use(express.json())//body parser 
server.use(cors());


const port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log(`server listening on ${port}`)
})

//Endpoints

//POST

server.post("/destinations", async (req, res) => {

    const { name, location, photo, description } = req.body;

    // Make sure we have a name and location

    if (name === undefined || name.length === 0 || location === undefined || location.length === 0) {
        return res
            .status(400)
            .json({ message: "Name and location are both required" })
    }
    const dest = { id: generateUniqueId(), name, location, photo, description };

    const API_KEY = "2vAoc_zs73pmQGlzynGD8AsbJmMCu-V3TjCKc5Kqu3I"
    const UNSPLASH_URL = `https://api.unsplash.com/photos/random/?client_id=QsPtItqyx9-VpUsYx2K7DlLKcxJ-Kg6EthZ1LimBMy8&query=${name}`
    console.log(UNSPLASH_URL)

    try {
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

//GET

server.get("/", (req, res) => {
    res.send({message: "hi"})
})

server.get("/destinations", cors(), (req, res) => {

    res.send(destinations)
});

server.put("/destinations/:id", (req, res) => {

    let destId = req.params.id
    console.log(destId)

    const { id, name, location, photo, description } = req.body

    for (const dest of destinations) {
        if (dest.id === destId) {

            if (name !== undefined && name.length !== 0) {
                dest.name = name
            }

            if (location !== undefined) {
                dest.location = location;
            }

            if (photo !== undefined) {
                dest.photo = photo;
            }

            if (description !== undefined) {
                dest.description = description;
            }
        }
    }

    console.log(destinations)
    res.send(destinations)
    return res.json()

})

server.delete("/destinations", (req, res) => {

    let destId = req.query.id
    
    let newDestinations = destinations.filter((dest) => dest.id != destId)

    destinations = newDestinations
    res.send(destinations)
    res.redirect("/destinations")
})