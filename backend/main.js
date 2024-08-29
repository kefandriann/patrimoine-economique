import express from "express";
import { readFile, writeFile } from "../data/index.js";
import cors from "cors";
import Patrimoine from "../models/Patrimoine.js";
import Possession from "../models/possessions/Possession.js";
import Flux from "../models/possessions/Flux.js";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

const data = await readFile("../data/data.json").data;
const possessionsList = (await readFile("../data/data.json")).data[1].data.possessions;
const patrimoine = (await readFile("../data/data.json")).data[1].data;

const instancedPossession = possessionsList.map( e => {
    if (!(e.libelle === "Alternance" || e.libelle ==="Survie")){
        return new Possession(
            e.possesseur,
            e.libelle,
            e.valeur,
            e.dateDebut,
            e.dateFin,
            e.tauxAmortissement
        );
    } else {
        return new Flux(
            e.possesseur,
            e.libelle,
            e.valeur,
            e.dateDebut,
            e.dateFin,
            e.tauxAmortissement,
            e.jour,
            e.valeurConstante
        );
    }
});

const instancedPatrimoine = new Patrimoine(patrimoine.possesseur, instancedPossession);

// /possession : Get Possession List
app.get("/possession", (async(req, res) => {

    const valeurActuelle = instancedPossession.map(e => e.getValeur(new Date().toISOString().split("T")[0]).toFixed(2))

    let response = [];

    for (let i = 0; i<valeurActuelle.length; i++){
        let prop = possessionsList[i];
        prop.valeurActuelle = valeurActuelle[i];
        response.push(prop);
    }

    res.json(response);
}))

// /possession : Create Possession: [libelle, valeur, dateDebut, taux]
app.post("/possession", (async(req, res) => {
    const { libelle , valeur , dateDebut , tauxAmortissement } = await req.body;
    const newPossession = { possesseur: { nom: "John Doe"}, libelle, valeur, dateDebut, dateFin: null, tauxAmortissement};
    const newInstancedPossession = new Possession(
        newPossession.possesseur,
        newPossession.libelle,
        newPossession.valeur,
        newPossession.dateDebut,
        newPossession.dateFin,
        newPossession.tauxAmortissement
    );
    const newPossVal = newInstancedPossession.getValeur(new Date().toISOString().split("T")[0]).toFixed(2);
    newPossession.valeurActuelle = newPossVal;
    possessionsList.push(newPossession);

    res.status(201).json(newPossession);
}))

// /possession/:libelle: Update Possession by libelle: [libelle, dateFin]
app.patch("/possession/:libelle", (async(req, res) => {
    const libelle1 = req.params.libelle;
    const { libelle , dateFin } = req.body;
    const possession = possessionsList.find(e => e.libelle === libelle1);
    if (possession){
        possession.libelle = libelle;
        possession.dateFin = dateFin;

        res.json(possession);
    } else {
        res.status(404).json({ message: 'Possession not found' });
    }
}))

// /possession/:libelle/close: Close Possession => set dateFin to current Date
app.put("/possession/:libelle/close", (async(req, res) => {
    const libelle = req.params.libelle;
    const possession = possessionsList.find(e => e.libelle === libelle);
    if (possession){
        possession.dateFin = new Date().toISOString().split("T")[0];

        res.json(possession);
    } else {
        res.status(404).json({ message: 'Possession not found' });
    }
}))

app.get("/patrimoine/:date", (async (req, res) => {
    const date = req.params.date;
    // /patrimoine/range: { type: 'month' , dateDebut: xxx , dateFin: xxx , jour: xx } Get Valeur Patrimoine Range: [DateDebut, DateFin, Jour, type] => Valeur Patrimoine between dateDebut - dateFin by type=month
    if (date === "range") {
        const type = req.query.type;
        let dateDebut = ""+req.query.dateDebut;
        let dateFin = ""+req.query.dateFin;
        const jour = +req.query.jour;

        const datePatrimoineRange = [];
        let nombreDeMois = (+ (dateFin.split("-")[0]) - (dateDebut.split("-")[0])) * 12 + (+ (dateFin.split("-")[1]) - (dateDebut.split("-")[1])) + 1;

        for (let i = + (dateDebut.split("-")[1]); i <= + (dateDebut.split("-")[1])+nombreDeMois-1; i++) {
            if (i>=13){
                if (i % 12 != 0) {
                    datePatrimoineRange.push((+ (dateDebut.split("-")[0])+(Math.floor(i/12)))+"-"+(i%12).toString().padStart(2, '0')+"-"+ jour);
                } else {
                    datePatrimoineRange.push((+ (dateDebut.split("-")[0])+(Math.floor(i/12)))+"-"+12+"-"+jour);
                }
            } else {
                datePatrimoineRange.push(dateDebut.split("-")[0]+"-"+i.toString().padStart(2, '0')+"-"+jour);
            }
        }

        if (jour < +(dateDebut.split("-")[2])){
            datePatrimoineRange.shift();
            nombreDeMois--;
        }
        if (jour > + (dateFin.split("-")[2])){
            datePatrimoineRange.pop();
            nombreDeMois--;
        }

        dateDebut = req.query.dateDebut;
        dateFin = req.query.dateFin;

        const valeurPatrimoineRange = datePatrimoineRange.map(e => +instancedPatrimoine.getValeur(e).toFixed(2));

        const response = { type, dateDebut, dateFin, jour, nombreDeMois, datePatrimoineRange, valeurPatrimoineRange }

        res.json(response)

// /patrimoine/:date: Get Valeur Patrimoine: [Date] => Valeur
    } else {
        const valeur = +instancedPatrimoine.getValeur(date).toFixed(2);
        res.json(valeur);
    }
}))

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})