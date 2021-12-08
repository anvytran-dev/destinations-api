const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')
const { MongoClient, ObjectId } = require("mongodb")
const fetch = require("node-fetch");



const server = express()
server.use(express.json())//body parser 
server.use(cors());
server.use(express.urlencoded({ extended: true }));

server.set('view engine', 'ejs'); // set up ejs for templating
server.use(express.static('public'))
server.use(bodyParser.json())

const MongoDB_URL = "mongodb+srv://anvytran:matcha@anvyrc.kuion.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const client = new MongoClient(MongoDB_URL)

const dbName = 'destinationsDB'

client.connect()
    .then(() => {
        const db = client.db(dbName)

        const destinations = db.collection("destinations")

        const port = process.env.PORT || 3000;
        server.listen(port, function () {
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
            const dest = { name, location, photo, description };

            const API_KEY = "2vAoc_zs73pmQGlzynGD8AsbJmMCu-V3TjCKc5Kqu3I"
            const UNSPLASH_URL = `https://api.unsplash.com/photos/random/?client_id=QsPtItqyx9-VpUsYx2K7DlLKcxJ-Kg6EthZ1LimBMy8&query=${name}`
            console.log(UNSPLASH_URL)

            try {
                let result = await fetch(UNSPLASH_URL)
                const data = await result.json()

                dest.photo = data.urls.small

            } catch (error) {
                //placeholder photo
                console.log("error")
            }

            destinations.insertOne(dest);
           
            res.redirect("/destinations")

        });

        //GET

        server.get("/", (req, res) => {
            res.send({ message: "hi" })
        })

        server.get("/destinations", cors(), async (req, res) => {
            const data = await destinations.find({}).toArray()
        
            res.render('./index.ejs', {lugares: data})
        });

        server.put("/destinations", async (req, res) => {

            const { id, name, location, description } = req.body

            if (id === undefined) {
                return res.status(400).json({ message: "id is required" })
            }

            if (name !== undefined && name.length === 0) {
                return res.status(400).json({ message: "name can't be empty" })
            }

            if (location !== undefined && location.length === 0) {
                return res.status(400).json({ message: "location can't be empty" })
            }

            const dest = {
                name: name,
                location: location,
                photo: await getUnsplashPhoto({ name, location })
            };

            if (description !== undefined) {
                dest.description = description;
            }

            const updatedDest = await destinations.findOneAndUpdate(
                { _id: ObjectId(id) },
                { $set: dest }
            )
            .then(result => {
                res.json('Success')
              })
             .catch(error => console.error(error))
         
                
            return res.json(updatedDest)


        })

        server.delete("/destinations/:id", async (req, res) => {

            let {id}  = req.params
            console.log(id)
            
            // destinations.deleteOne(
            //     { _id: ObjectId(id) }
            //   )
            //     .then(result => {
            //         console.log('hi')
            //     console.log(res)
            //       return res.json()
            //     })
            //     .catch(error => console.error(error))

            const delDest = await destinations.findOneAndDelete(
                { _id: ObjectId(id) }
            )
            //how do i send destinations back?
            return res.json(delDest)

        })

        async function getUnsplashPhoto(name, location) {
            const API_KEY = "2vAoc_zs73pmQGlzynGD8AsbJmMCu-V3TjCKc5Kqu3I"
            const UNSPLASH_URL = `https://api.unsplash.com/photos/random/?client_id=QsPtItqyx9-VpUsYx2K7DlLKcxJ-Kg6EthZ1LimBMy8&query=${name}`
            console.log(UNSPLASH_URL)

            try {
                let result = await fetch(UNSPLASH_URL)
                const data = await result.json()

                return data.urls.small

            } catch (error) {
                //placeholder photo
                console.log("error")
            }
        }

    })

