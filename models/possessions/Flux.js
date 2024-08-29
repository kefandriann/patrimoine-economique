// THIS MAY CHANGE IN THE FUTURE
// dateDebut = 01/01/2024
// montant = 400_000
// jour = 1
import Possession from "./Possession.js";
export default class Flux extends Possession {
  // Si salaire => +
  // Si train de vie => -
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement, jour, valeurConstante) {
    super(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement)
    this.valeur = 0;
    this.jour = jour;
    // this.source = source; // null || Compte
    // this.destination = destination; // Compte
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.valeurConstante = valeurConstante;
  }


  getValeur(date) {
    const nombreDeMois = (debut, dateEvaluation, jourJ) => {
      let compteur = 0;

      if (debut.split("-")[2] < jourJ) {
        compteur++;
      }

      if (dateEvaluation.split("-")[2] >= jourJ && !(debut.split("-")[0] === dateEvaluation.split("-")[0] && debut.split("-")[1] === dateEvaluation.split("-")[1])) {
        compteur++;
      }

      let totalMois = (dateEvaluation.split("-")[0] - debut.split("-")[0]) * 12 + (dateEvaluation.split("-")[1] - debut.split("-")[1]) - 1;

      compteur += Math.max(0, totalMois);

      return compteur;
    };

    // Calculer le montant total sans modifier this.valeur
    const totalMois = nombreDeMois(this.dateDebut, date, this.jour);
    const montantTotal = totalMois * this.valeurConstante;

    return montantTotal;
  }
}