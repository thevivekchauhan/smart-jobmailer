// client/src/App.js
import React, { useState } from 'react';
import CompanyList from './components/CompanyList';
import EmailComposer from './components/EmailComposer';
import StatusDashboard from './components/StatusDashboard';
import './App.css';


function App() {
  const [emailResults, setEmailResults] = useState([]);

  return (
    <div className="App">
      <h1>Smart JobMailer 💌</h1>
      <CompanyList />
      <hr />
      <EmailComposer onSendComplete={setEmailResults} />
      <hr />
      <StatusDashboard results={emailResults} />
    </div>
  );
}

export default App;
