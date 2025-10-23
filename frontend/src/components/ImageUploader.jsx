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
    const formData = new FormData();
    formData.append('file', image);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md text-center">
      <h1 className="text-2xl font-bold mb-2">Upload your skin photo for instant analysis</h1>
      <p className="text-gray-500 mb-4">Get personalized skincare insights in seconds.</p>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer mb-4"
        onClick={() => document.getElementById('fileInput').click()}
      >
        {preview ? (
          <img src={preview} alt="preview" className="mx-auto w-40 h-40 rounded-lg object-cover" />
        ) : (
          <span className="text-gray-400">Drag & drop or click to select an image</span>
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <button
        onClick={handleUpload}
        className="mt-2 px-6 py-2 text-white rounded-full bg-gradient-to-r from-blue-400 to-blue-500 disabled:opacity-60"
        disabled={loading || !image}
      >
        {loading ? 'Analyzing...' : 'Analyze Skin'}
      </button>
      {result && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
