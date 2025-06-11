// client/src/components/CompanyList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CompanyList() {
  const [companyName, setCompanyName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    const res = await axios.get('http://localhost:5000/api/companies');
    setCompanies(res.data);
  };

  const handleAdd = async () => {
    await axios.post('http://localhost:5000/api/add-company', { companyName, emailAddress });
    setCompanyName('');
    setEmailAddress('');
    fetchCompanies();
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div>
      <h2>Company Email List</h2>
      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email Address"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>

      <ul>
        {companies.map((c) => (
          <li key={c._id}>{c.companyName} - {c.emailAddress}</li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyList;
