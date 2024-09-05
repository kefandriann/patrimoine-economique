import React, { useEffect, useState } from "react";
import { Form, Button } from 'react-bootstrap';
import axios from "axios";

axios.defaults.baseURL = 'https://patrimoine-economique-backend-6r4w.onrender.com';

function GetValeurPatrimoine () {
    const [date, setDate] = useState('');
    const [valeur, setValeur] = useState(0);

    const handleGetValeur = async () => {
        try {
          const response = await axios.get(`/patrimoine/${date}`);
          setValeur(response.data);
        } catch (err) {
          console.error("Erreur lors de la récupération de la valeur du patrimoine", err);
        }
      };

    return <div>
        <h2>Valeur du Patrimoine</h2>
      <Form>
        <Form.Group controlId="formDate">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={handleGetValeur}>Confirm date</Button>
      </Form>
      <h4>Valeur: {valeur} Ariary</h4>
    </div>
}

export default GetValeurPatrimoine;