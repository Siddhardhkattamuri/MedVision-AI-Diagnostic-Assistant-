import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Chatbot from './components/Chatbot';
import Features from './components/Features';
import './App.css';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  // Apply theme based on the diagnosis result
  useEffect(() => {
    document.body.classList.remove('theme-pneumonia', 'theme-tuberculosis', 'theme-normal');
    if (prediction) {
      document.body.classList.add(`theme-${prediction.class.toLowerCase()}`);
    }
  }, [prediction]);

  // Handle the image classification process
  const handlePrediction = async () => {
    if (!file || loading) return;

    setLoading(true);
    setPrediction(null);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', { 
        method: 'POST', 
        body: formData 
      });

      if (!response.ok) {
        // Get the specific error message from the backend (like "Invalid Image")
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error! Please try again.`);
      }

      const result = await response.json();
      setPrediction(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the state for a new image classification
  const handleReset = () => {
    setFile(null);
    setPrediction(null);
    setError('');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>MedVision: AI Diagnostic Assistant</h1>
        {/* Changed to h2 as per your code */}
        <h2>Detect Pneumonia & Tuberculosis with Hybrid CNN and VGG16</h2>
      </header>

      <Features />

      <main>
        <ImageUploader 
          onFileSelect={setFile} 
          onPredict={handlePrediction} 
          loading={loading} 
          file={file} 
        />
        <AnimatePresence>
          {!loading && (prediction || error) && (
            <ResultDisplay 
              prediction={prediction} 
              error={error} 
              onReset={handleReset} 
            />
          )}
        </AnimatePresence>
      </main>

      <Chatbot prediction={prediction} />
    </div>
  );
}

export default App;