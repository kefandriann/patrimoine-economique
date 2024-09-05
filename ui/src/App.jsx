import React, { useState } from 'react';
import Header from './components/Header';
import PatrimoinePage from './components/PatrimoinePage';
import PossessionListPage from './components/PossessionListPage';
import CreatePossessionPage from './components/CreatePossessionPage';
import UpdatePossessionPage from './components/UpdatePossessionPage';

function App  ()  {
  const [page, setPage] = useState('possession');
  const [libelle1, setLibelle1] = useState('');
  const [possessions, setPossessions] = useState([]);

  function renderPage () {
    if (page === 'patrimoine'){
      return <PatrimoinePage />;
    } else if (page === 'possession') {
      return <PossessionListPage setPage={setPage} setLibelle1={setLibelle1} possessions={possessions} setPossessions={setPossessions}/>;
    } else if (page === 'create') {
      return <CreatePossessionPage setPossessions={setPossessions} setPage={setPage}/>;
    } else if (page.split("/")[0] === 'update') {
      return <UpdatePossessionPage libelle1={libelle1} setPossessions={setPossessions}/>;
    }
    return <h1>Bienvenue dans l'application Patrimoine Économique</h1>;
  }

  return (
    <div>
      <Header setPage={setPage} />
      <div className="container mt-4">
        {renderPage()}
      </div>
    </div>
  );
}

export default App