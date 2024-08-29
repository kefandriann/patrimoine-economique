import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, LineElement, PointElement, ArcElement, CategoryScale, LinearScale, RadialLinearScale } from 'chart.js';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, PointElement, ArcElement, CategoryScale, LinearScale, RadialLinearScale);

axios.defaults.baseURL = 'http://localhost:3000';

function LineChart () {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.raw;
                    }
                }
            }
        }
    };

    const jours = Array.from({length: 30}, (_, i) => i + 1).map(j => (<option key={j} value={j}>{j}</option>));
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [jour, setJour] = useState(1);
    const [nombreDeMois, setNombreDeMois] = useState(0);
    const [datePatrimoineRange, setDatePatrimoineRange] = useState([]);
    const [valeurPatrimoineRange, setValeurPatrimoineRange] = useState([]);

    const type = "month";
    const mois = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
                    'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
                    'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
                    'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
                    'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
    ];
    const [displayMonths, setDisplayMonths] = useState([]);
    const [displayValues, setDisplayValues] = useState([]);
    const data1 = {
        labels: displayMonths,
        datasets: [{
            label: 'Ariary',
            data: displayValues,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2
        }]
    };
    const [data, setData] = useState(data1);

    async function settingData (response) {
        setDateDebut(response.data.dateDebut);
        setDateFin(response.data.dateFin);
        setJour(response.data.jour);
        setNombreDeMois(response.data.nombreDeMois);
        setDatePatrimoineRange(response.data.datePatrimoineRange);
        setValeurPatrimoineRange(response.data.valeurPatrimoineRange);
    }

    async function settingChart (response) {
        const fromIndex = +response.data.datePatrimoineRange[0].split('-')[1]-1;
        setDisplayMonths(mois.slice(fromIndex, fromIndex+response.data.nombreDeMois));
        const values = response.data.valeurPatrimoineRange.map(e => Math.floor(e))
        setDisplayValues(values);
        
    }

    const handleGetValeurByRange = async () => {
            const response = await axios.get(`/patrimoine/range`, {
                params: {
                    type: type,
                    dateDebut: dateDebut,
                    dateFin: dateFin,
                    jour: jour
                }
            });

            await settingData(response);

            await settingChart(response);

            setData(data1);
    };

    return (
        <div style={{ width: '80%', maxWidth: '800px', margin: 'auto' }}>
            <h2>Valeur Patrimoine By Range</h2>
            <Form>
                <Form.Group>
                    <Form.Label>Date de Debut</Form.Label>
                    <Form.Control type='date' value={dateDebut} onChange={(e) => setDateDebut(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Date de Fin</Form.Label>
                    <Form.Control type='date' value={dateFin} onChange={(e) => setDateFin(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Jour</Form.Label>
                    <Form.Control as="select" value={jour} onChange={(e) => setJour(e.target.value)}>
                        <option value="">Choisir un jour</option>
                        {jours}
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" onClick={handleGetValeurByRange}>Confirm range (x2 click)</Button>
            </Form>
            <div style={{ position: 'relative', height: '400px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default LineChart;