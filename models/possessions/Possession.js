export default class Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement) {
    this.possesseur = possesseur;
    this.libelle = libelle;
    this.valeur = valeur;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.tauxAmortissement = tauxAmortissement;
  }

  getValeur(date) {
    return this.getValeurApresAmortissement(date);
  }

  getValeurApresAmortissement(dateActuelle) {
    if (dateActuelle < this.dateDebut) {
      return 0;
    }
    const differenceDate = {
      year: dateActuelle.split("-")[0] - this.dateDebut.split("-")[0],
      month: dateActuelle.split("-")[1] - this.dateDebut.split("-")[1],
      day: dateActuelle.split("-")[2] - this.dateDebut.split("-")[2],
    };
  
    var raison = differenceDate.year + differenceDate.month / 12 + differenceDate.day / 365;

    const result = this.valeur - this.valeur *(raison * this.tauxAmortissement / 100);
    return result;
  }
}
