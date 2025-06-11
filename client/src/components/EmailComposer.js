// client/src/components/EmailComposer.js
import React, { useState } from 'react';
import axios from 'axios';

function EmailComposer({ onSendComplete }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('body', body);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/send-emails', formData);
      alert('Emails sent!');
      onSendComplete(res.data.results); // send results to parent
    } catch (err) {
      alert('Failed to send emails');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Compose Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        /><br />
        <textarea
          placeholder="Body (use {{company_name}} for dynamic text)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        /><br />
        <input
          type="file"
          onChange={(e) => setAttachment(e.target.files[0])}
        /><br />
        <button type="submit">Send Emails</button>
      </form>
    </div>
  );
}

export default EmailComposer;
