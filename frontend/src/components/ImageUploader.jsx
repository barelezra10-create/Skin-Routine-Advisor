import React, { useState } from 'react';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64String }),
        });
        const data = await res.json();
        setResult(data.result);
        setLoading(false);
      };
      reader.readAsDataURL(image);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md text-center">
      <h1 className="text-2xl font-bold mb-2">Upload your skin photo for instant analysis</h1>
      <p className="text-gray-600 mb-4">Get personalized skincare insights in seconds.</p>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer"
        onClick={() => document.getElementById('fileInput').click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-auto mb-4 rounded-md" />
        ) : (
          <span className="text-gray-500">Drag & drop or click to select an image</span>
        )}
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <button
        onClick={handleUpload}
        className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold disabled:opacity-60"
        disabled={!image || loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Skin'}
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
          <h2 className="font-bold mb-2">Analysis Result</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
