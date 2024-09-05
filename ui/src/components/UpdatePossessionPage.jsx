import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

axios.defaults.baseURL = 'https://patrimoine-economique-backend-6r4w.onrender.com';

const UpdatePossessionPage = ({ libelle1 }) => {
  const [dateFin, setDateFin] = useState('');
  const [libelle, setLibelle] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.patch(`/possession/${libelle1}`, { libelle, dateFin });
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la possession", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formLibelle">
        <Form.Label>Libellé</Form.Label>
        <Form.Control type="text" value={libelle} onChange={(e) => setLibelle(e.target.value)}/>
      </Form.Group>

      <Form.Group controlId="formDateFin">
        <Form.Label>Date de Fin</Form.Label>
        <Form.Control type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Mettre à Jour
      </Button>
    </Form>
  );
};

export default UpdatePossessionPage;