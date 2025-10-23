import React, { useState } from "react";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    setResult(data.result);
    setLoading(false);
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-3">העלה תמונה לניתוח עור</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" className="mx-auto my-4 w-40 h-40 rounded-lg object-cover" />}
      <button
        onClick={handleUpload}
        className="bg-black text-white px-4 py-2 rounded-lg"
        disabled={loading}
      >
        {loading ? "מנתח..." : "נתח תמונה"}
      </button>

      {result && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <h3 className="font-bold mb-2">תוצאה:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
