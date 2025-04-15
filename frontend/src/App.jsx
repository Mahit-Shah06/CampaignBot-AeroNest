// CampaignBot App with Fullscreen Particle Background and Centered UI
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export default function CampaignBotApp() {
  const [formData, setFormData] = useState({
    brand_name: '',
    objective: '',
    audience: '',
    competitors: '',
    visual_style: ''
  });
  const [result, setResult] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCampaign = async () => {
    setLoading(true);
    const res = await axios.post('http://localhost:8000/generate-campaign', formData);
    setResult(res.data);
    setLoading(false);
  };

  const generateLogo = async () => {
    const res = await axios.get(`http://localhost:8000/generate-logo?prompt=${formData.brand_name} futuristic minimalist logo`);
    setLogoUrl(res.data.url);
  };

  const downloadDocx = async () => {
    const res = await axios.post('http://localhost:8000/export-docx', formData, { responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign_plan.docx';
    a.click();
  };

  const downloadPptx = async () => {
    const res = await axios.post('http://localhost:8000/export-pptx', formData, { responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign_plan.pptx';
    a.click();
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  useEffect(() => {
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.overflow = 'hidden';
    document.body.style.fontFamily = 'Poppins, sans-serif';
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: {
            color: { value: darkMode ? "#000" : "#f0f0f0" },
          },
          particles: {
            number: { value: 50 },
            size: { value: 3 },
            color: { value: "#00cccc" },
            links: { enable: true, color: "#00cccc" },
            move: { enable: true, speed: 1 },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
            },
          },
        }}
        style={{ position: 'absolute', zIndex: 0 }}
      />

      <div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundImage: 'url("/background.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backdropFilter: 'blur(3px)'
}}>

        <div style={{ width: '100%', maxWidth: '800px', padding: '2rem', backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '2rem', color: '#00e6e6' }}>🚀 CampaignBot</h1>
            <button onClick={() => setDarkMode(!darkMode)} style={buttonStyle}>
              {darkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>

          <input name="brand_name" placeholder="Brand Name" onChange={handleChange} style={inputStyle(darkMode)} />
          <input name="objective" placeholder="Campaign Objective" onChange={handleChange} style={inputStyle(darkMode)} />
          <textarea name="audience" placeholder="Target Audience" onChange={handleChange} style={inputStyle(darkMode)} />
          <input name="competitors" placeholder="Competitors" onChange={handleChange} style={inputStyle(darkMode)} />
          <input name="visual_style" placeholder="Visual Style" onChange={handleChange} style={inputStyle(darkMode)} />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
            <button onClick={generateCampaign} style={buttonStyle}>Generate</button>
            <button onClick={generateLogo} style={buttonStyle}>Logo</button>
            <button onClick={downloadDocx} style={buttonStyle}>DOCX</button>
            <button onClick={downloadPptx} style={buttonStyle}>PPTX</button>
          </div>

          {loading && <p style={{ marginTop: '1rem', textAlign: 'center' }}>⏳ Generating...</p>}

          {result && (
            <div style={{ marginTop: '2rem', background: darkMode ? '#1a1a1a' : '#eeeeee', padding: '1rem', borderRadius: '10px' }}>
              <h2 style={{ fontSize: '1.5rem' }}>📄 Campaign Summary</h2>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}

          {logoUrl && (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <h3>🖼️ Generated Logo</h3>
              <img src={logoUrl} alt="Generated Logo" style={{ maxWidth: '300px', borderRadius: '10px', marginTop: '1rem', boxShadow: '0 0 10px #00cccc' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = (dark) => ({
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: dark ? '#222' : '#fff',
  color: dark ? '#fff' : '#000',
  boxShadow: '0 0 6px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease-in-out'
});

const buttonStyle = {
  backgroundColor: '#00cccc',
  padding: '0.6rem 1.2rem',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 0 5px #00cccc',
  transition: 'all 0.3s ease-in-out'
};
