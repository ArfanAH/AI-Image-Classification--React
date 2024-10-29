import React, { useState, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";
import './index.css'

function App() {
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURL(reader.result);
        setPredictions([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyImage = async () => {
    if (!model || !imageURL) return;

    setIsLoading(true);
    const img = document.getElementById("uploaded-image");
    
    // Simulate loading time of 2000ms
    setTimeout(async () => {
      const predictions = await model.classify(img);
      setPredictions(predictions);
      setIsLoading(false);
    }, 2000);
  };

  const resetApp = () => {
    setImageURL(null);
    setPredictions([]);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
      <h1 className="font-bold text-4xl text-black mb-8">AI Image Classification</h1>

      <h2 className="font-medium text-xl mb-6 text-gray-700">Upload Image</h2>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        <label htmlFor="upload-images" className="flex items-center cursor-pointer">
          <div className="border border-dotted border-blue-500 rounded-xl bg-blue-100 p-12 flex justify-center items-center hover:shadow-lg transition">
            <h2 className="text-3xl font-bold text-blue-500">+</h2>
          </div>
        </label>
        
        <input
          type="file"
          accept="image/*"
          id="upload-images"
          onChange={handleImageUpload}
          className="hidden"
        />

        {imageURL && (
          <div className="flex justify-center items-center border border-gray-300 rounded-xl shadow-md overflow-hidden">
            <img
              id="uploaded-image"
              src={imageURL}
              alt="Upload Preview"
              className="w-48 h-48 object-cover rounded-xl p-1"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={classifyImage}
          className="bg-blue-500 text-white py-2 px-6 rounded-xl font-semibold hover:bg-blue-600 transition"
        >
          {isLoading ? "Classifying..." : "Classify Image"}
        </button>

        <button
          onClick={resetApp}
          className="bg-red-500 text-white py-2 px-6 rounded-xl font-semibold hover:bg-red-600 transition"
        >
          Reset
        </button>
      </div>

      {isLoading && (
        <div className="mt-6">
          <div className="loader"></div>
        </div>
      )}

      {predictions.length > 0 && (
        <div className="mt-8 bg-white shadow-lg rounded-xl p-6 w-80">
          <h2 className="font-bold text-2xl text-gray-700 mb-4">Predictions</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left text-gray-600">Class Name</th>
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left text-gray-600">Probability</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border-b border-gray-200 px-4 py-2">{prediction.className}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{(prediction.probability * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className="mt-10 text-center text-gray-800">
        <p className="text-sm">&copy; 2024 All Rights Reserved by Md. Arfan Ahmed</p>
      </footer>
    </div>
  );
}

export default App;
