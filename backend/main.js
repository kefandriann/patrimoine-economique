import express from "express";
import { readFile, writeFile } from "../data/index.js";
import cors from "cors";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

// /possession : Get Possession List
app.get("/possession", (async(req, res) => {
    res.send(await readFile("./data.json"));
}))

// /possession : Create Possession: [libelle, valeur, dateDebut, taux]
app.post("/possession", (async(req, res) => {
    const newData = await req.body;
    res.send(newData);
}))

// /possession/:libelle: Update Possession by libelle: [libelle, dateFin]
app.get("/possession/:libelle", (async(req, res) => {
    const libelle = req.params.libelle;
    const possessionsList = (await readFile("./data.json")).data[1].data.possessions;
    res.send(possessionsList.filter((e) => e.libelle == libelle));
}))


app.get("/patrimoine/:date", (async(req, res) => {
    const date = req.params.date;
    const data = await readFile("./data.json");
    res.send(data.data[1].data.possessions);
}))

app.listen(port, () => {
    console.log("Mande");
})