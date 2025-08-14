import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ImageUploader.css';

// ✅ Updated SVG-based Loader Spinner
const Loader = () => (
  <motion.svg
    className="loader"
    width="24"
    height="24"
    viewBox="0 0 100 100"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
  >
    <circle
      cx="50"
      cy="50"
      r="35"
      stroke="#7E57C2"
      strokeWidth="10"
      fill="none"
      strokeLinecap="round"
      strokeDasharray="164.93361431346415 56.97787143782138"
    />
  </motion.svg>
);

const ImageUploader = ({ onFileSelect, onPredict, loading, file }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <motion.div
      className="uploader-card"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 50 }}
    >
      <div className="uploader-content">
        <div className="image-preview-area">
          {preview ? (
            <div className="image-preview-container">
              <img src={preview} alt="X-Ray Preview" className="image-preview" />
            </div>
          ) : (
            <>
              <input type="file" id="file-upload" onChange={handleFileChange} accept="image/png, image/jpeg" />
              <label htmlFor="file-upload" className="file-label">
                <span className="folder-icon"></span>
                <span className="upload-text">Click to Upload X-Ray Image</span>
              </label>
            </>
          )}
        </div>

        <motion.button
          onClick={onPredict}
          disabled={!file || loading}
          className="predict-button"
        >
          {loading ? <div className="loader">
  <span className="loader-dot"></span>
  <span className="loader-dot"></span>
  <span className="loader-dot"></span>
</div>: 'Classify Image'}
          
        </motion.button>
        
      </div>
      
    </motion.div>
  );
};

export default ImageUploader;
