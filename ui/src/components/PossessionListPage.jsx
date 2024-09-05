import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';

axios.defaults.baseURL = 'https://patrimoine-economique-backend-6r4w.onrender.com';
const apiUrl = process.env.REACT_APP_BACKEND_URL;

function PossessionListPage (props) {
  const { setPage , setLibelle1 , possessions , setPossessions} = props;

  useEffect(() => {
    const fetchPossessions = async () => {
        const response = await axios.get('/possession');
        setPossessions(response.data);
    };

    fetchPossessions();
  }, []);

  const closePossession = async (libelle) => {
    try {
      await axios.put(`/possession/${libelle}/close`);
      setPossessions(possessions.map(p => p.libelle === libelle ? { ...p, dateFin: new Date().toISOString().split("T")[0] } : p));
    } catch (err) {
      console.error("Erreur lors de la clôture de la possession", err);
    }
  };

  return (
    <div>
      <h2>Liste des Possessions</h2>
      <Button variant="success" onClick={() => setPage('create')}>Créer une Possession</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Valeur</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Taux Amortissement</th>
            <th>Valeur Actuelle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession, index) => (
            <tr key={index}>
              <td>{possession.libelle}</td>
              <td>{possession.valeur} Ar</td>
              <td>{possession.dateDebut}</td>
              <td>{possession.dateFin}</td>
              <td>{possession.tauxAmortissement} %</td>
              <td>{possession.valeurActuelle} Ar</td>
              <td>
                <Button variant="primary" onClick={() => {
                  setLibelle1(possession.libelle);
                  setPage('update');
                } }>Éditer</Button>
                <Button variant="danger" onClick={() => closePossession(possession.libelle)}>Clôturer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PossessionListPage;