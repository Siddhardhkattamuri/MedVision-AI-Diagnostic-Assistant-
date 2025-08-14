import React from 'react';
import { motion } from 'framer-motion';
import { diseaseInfo } from '../data/diseaseInfo'; // <-- Import the new data
import Accordion from './Accordion'; // <-- Import the Accordion component
import './ResultDisplay.css';

const ResultDisplay = ({ prediction, error, onReset }) => {
  if (error) {
    return (
      <motion.div className="result-card error" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} >
        <h2>{error}</h2>
        <button onClick={onReset} className="reset-button">Try Again</button>
      </motion.div>
    );
  }

  if (!prediction) return null;

  const { 'class': predictedClass, confidence } = prediction;
  const confidencePercent = (confidence * 100).toFixed(2);
  const infoData = diseaseInfo[predictedClass.toLowerCase()];

  return (
    <motion.div
      className="result-card"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80 }}
    >
      <h2 className="result-title">Analysis Complete</h2>
      
      <div className="prediction-highlight">
        <span className={`prediction-class ${predictedClass.toLowerCase()}`}>{predictedClass}</span>
      </div>

      <p className="confidence-text">
        Confidence Level: <strong>{confidencePercent}%</strong>
      </p>

      {/* NEW: Render the accordion section if data exists */}
      {infoData && (
          <div className="info-accordion-container">
              {infoData.sections.map((section, index) => (
                  <Accordion key={index} title={section.title}>
                      <p>{section.content}</p>
                  </Accordion>
              ))}
          </div>
      )}

      <button onClick={onReset} className="reset-button">
        Classify Another Image
      </button>
    </motion.div>
  );
};

export default ResultDisplay;