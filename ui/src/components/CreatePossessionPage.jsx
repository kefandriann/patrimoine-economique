import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const CreatePossessionPage = () => {
  const [libelle, setLibelle] = useState('');
  const [valeur, setValeur] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [tauxAmortissement, setTauxAmortissement] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (libelle != '' && valeur != '' && dateDebut != '' && tauxAmortissement != ''){
        await axios.post('/possession', { libelle, valeur, dateDebut, tauxAmortissement });
      }
    } catch (err) {
      console.error("Erreur lors de la création de la possession", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formLibelle">
        <Form.Label>Libellé</Form.Label>
        <Form.Control type="text" value={libelle} onChange={(e) => setLibelle(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formValeur">
        <Form.Label>Valeur</Form.Label>
        <Form.Control type="number" value={valeur} onChange={(e) => setValeur(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formDateDebut">
        <Form.Label>Date de Début</Form.Label>
        <Form.Control type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formTaux">
        <Form.Label>Taux Amortissement</Form.Label>
        <Form.Control type="number" value={tauxAmortissement} onChange={(e) => setTauxAmortissement(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Créer
      </Button>
    </Form>
  );
};

export default CreatePossessionPage;
