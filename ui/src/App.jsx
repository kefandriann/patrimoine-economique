import React, { useEffect, useState } from "react";
import { DatePicker } from "./component/datePicker";
import { PossessionTable } from "./component/possessionTable";
import { PatrimoineJSX } from "./component/patrimoine";
import 'bootstrap/dist/css/bootstrap.min.css';
import Possession from "../models/possessions/Possession.js";
import Flux from "../models/possessions/Flux.js"
import Patrimoine from "../models/Patrimoine.js"
import axios from "axios";

export function getItemValeur (possession, date) {
  if (new Date(possession.dateDebut) > date){
    return 0;
  } else if (new Date(possession.dateDebut) == date){
    return possession.valeur;
  } else {
    let amortissementParJour = possession.tauxAmortissement / 365;
    let joursEcoules = Math.floor((date - new Date(possession.dateDebut)) / (1000*60*60*24));
    return (possession.valeur - (possession.valeur * (joursEcoules*amortissementParJour)/100)).toFixed(2)
  }
}

export function getValeurPAtrimoine (possessions, date) {
  let fluxParMois = 0;
  let itemsValeur = 0;
  let fluxTotal;

  for (let i=0; i<possessions.length; i++){
    if (possessions[i].libelle == "Alternance" || possessions[i].libelle == "Survie") {
      fluxParMois += possessions[i].valeurConstante;
    }
  }
  for (let i=0; i<possessions.length; i++){
    if (possessions[i].libelle != "Alternance" && possessions[i].libelle != "Survie") {
      itemsValeur += +getItemValeur(possessions[i], date);
    }
  }

  for (let i=0; i<possessions.length; i++){
    if (possessions[i].libelle == "Alternance") {
      fluxTotal = fluxParMois * moisEcoules(new Date(possessions[i].dateDebut), date)
      console.log(moisEcoules(new Date(possessions[i].dateDebut), date))
      console.log(fluxTotal)
    }
  }
  
  return fluxTotal + itemsValeur;
}

export function moisEcoules(dateDebut, dateFin) {

  const anneeDebut = dateDebut.getFullYear();
  const moisDebut = dateDebut.getMonth();

  const anneeFin = dateFin.getFullYear();
  const moisFin = dateFin.getMonth();

  const differenceEnMois = (anneeFin - anneeDebut) * 12 + (moisFin - moisDebut);

  return differenceEnMois;
}

function App() {

  const [data, setData] = useState();
  const [poss, setPoss] = useState([]);
  const [pat, setPat] = useState({});

  function instancingPossessions(possessions){
    const newPossessions = possessions.map((possession) => {
      if (possession.libelle == "Alternance" || possession.libelle == "Survie"){
        return new Flux(
          possession.possesseur, 
          possession.libelle, 
          possession.valeur,
          possession.dateDebut, 
          possession.dateFin, 
          possession.tauxAmortissement,
          possession.jour,
          possession.valeurConstante
        );
      } else {
        return new Possession (
          possession.possesseur, 
          possession.libelle, 
          possession.valeur,
          possession.dateDebut, 
          possession.dateFin, 
          possession.tauxAmortissement
        )
      }
    });
    setPoss(newPossessions);
  }

  function instancingPatrimoine(patrimoine){
    const newPatrimoine = new Patrimoine(
      patrimoine.possesseur,
      poss
    )
    setPat(newPatrimoine);
  }

  useEffect(() => {
    fetch("../public/data.json")
  .then((response) => response.json())
  .then((data) => {
    setData(data)
    if (data && data[1] && Array.isArray(data[1].data.possessions)){
      instancingPossessions(data[1].data.possessions)
      instancingPatrimoine(data[1].data)
    }
  }
  )
  .catch((error) => console.log(error));
  },[])

  const [date, setDate] = useState(new Date());

  return <div>
  <PossessionTable poss={poss}/>
  <DatePicker setDate={setDate}></DatePicker>
  <PatrimoineJSX poss={poss} date={date}/>
  </div>
}

export default App
