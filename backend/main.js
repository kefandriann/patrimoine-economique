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

// /possession : Get Possession List
app.get("/possession", async (req, res) => {
    const file = await readFile("../data/data.json");
    const data = file.data;
    const tempData = data;

    const instancedPossession = tempData[1].data.possessions.map( e => {
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
    const valeurActuelle = instancedPossession.map(e => e.getValeur(new Date().toISOString().split("T")[0]))
    
    for (let i=0; i<instancedPossession.length; i++){
        instancedPossession[i].valeurActuelle = valeurActuelle[i].toFixed(2);
    }

    res.json(instancedPossession);
})

// /possession : Create Possession: [libelle, valeur, dateDebut, taux]
app.post("/possession", async (req, res) => {
    const file = await readFile("../data/data.json");
    const data = file.data;
    const tempData = data;

    const {libelle,valeur,dateDebut,tauxAmortissement} = req.body;
    const newPossession = {
        possesseur: { "nom": "John Doe" },
        libelle: libelle,
        valeur: +valeur,
        dateDebut: dateDebut,
        dateFin: null,
        tauxAmortissement: +tauxAmortissement
    }

    tempData[1].data.possessions.push(newPossession);

    writeFile('../data/data.json', tempData);

    res.json(tempData);
})

// /possession/:libelle: Update Possession by libelle: [libelle, dateFin]
app.patch("/possession/:libelle", async (req, res) => {
    const file = await readFile("../data/data.json");
    const data = file.data;
    const tempData = data;
    
    const libelleParam = req.params.libelle;
    const { libelle, dateFin } = req.body;

    for (let i=0; i<tempData[1].data.possessions.length; i++){
        if (tempData[1].data.possessions[i].libelle === libelleParam) {
            tempData[1].data.possessions[i].libelle = libelle;
            tempData[1].data.possessions[i].dateFin = dateFin;
        }
    }

    writeFile('../data/data.json', tempData);

    res.json("Update success");
    
})

// /possession/:libelle/close: Close Possession => set dateFin to current Date
app.put("/possession/:libelle/close", async (req, res) => {
    const file = await readFile("../data/data.json");
    const data = file.data;
    const tempData = data;
    
    const libelleParam = req.params.libelle;

    for (let i=0; i<tempData[1].data.possessions.length; i++){
        if (tempData[1].data.possessions[i].libelle === libelleParam) {
            tempData[1].data.possessions[i].dateFin = new Date().toISOString().split("T")[0];
        }
    }

    writeFile('../data/data.json', tempData);

    res.json("Close success");
})

app.get("/patrimoine/:date", (async (req, res) => {
    const file = await readFile("../data/data.json");
    const data = file.data;
    const tempData = data;
    const instancedPossession = tempData[1].data.possessions.map( e => {
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
    const instancedPatrimoine = new Patrimoine(tempData[1].data.possesseur, instancedPossession)
    
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