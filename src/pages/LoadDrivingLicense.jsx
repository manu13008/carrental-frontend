import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


function LoadDrivingLicense() {

  // Use state pour le nom du fichier, l'erreur eventuelle d'extension et le succès
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // console.log(localStorage)

  // Navigation
  const navigate = useNavigate();


  // Je vérifie si l'utilisateur a un token ou si le token a expiré
  useEffect(() => {
    if (isTokenExpired(localStorage.getItem('token')) || !localStorage.getItem('token')) {
      navigate("/");
    }
  }, [navigate]);


  // Fonction appelée dans mon UseEffect qui vérifie si le token a expiré
  const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    // console.log(decodedToken)
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };


  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };


  // Quand l'utilisateur clique sur parcourir
  const handleFileChange = (e) => {
    console.log(e.target)
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'image/jpeg')) {
      setFile(selectedFile);
      setError('');
      // Récupérer le chemin complet du fichier
      const filePath = URL.createObjectURL(selectedFile);
      console.log("Chemin complet du fichier :", filePath);
    } else {
      setFile(null);
      setError('Merci de sélectionner uniquement des fichiers aux formats PDF ou JPEG.');
    }
  };


  // Quand le bouton Submit est cliqué
  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      console.log('File ready to be uploaded:', file);
      const formData = new FormData();
      formData.append('file', file);

      axios.post('http://localhost:3001/user/loaddrivinglicence', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          console.log('File uploaded successfully', response.data);
          setUploadSuccess(true);
        })
        .catch(error => {
          console.log("Vous n'etes pas autorisé à réaliser cette action")
          console.error('There was an error uploading the file!', error);
        });

    }
  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-around bg-gray-100">
      <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded absolute top-4 right-4">
        Déconnexion
      </button>
      {uploadSuccess ? (
        <div>
          <p>Merci d'avoir téléchargé votre permis de conduire</p>
          <p>Celui-ci est actuellement vérifié par nos équipes. Votre profil sera ensuite validé.</p>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-around bg-gray-100">
          <div>
            <h3>Validation du permis de conduire</h3>
          </div>
          <div className="w-auto">
            <p>Afin de valider définitivement votre compte, nous avons l'obligation de devoir vérifier votre permis de conduire.</p>
            <p>Merci de nous faire parvenir celui-ci afin de pouvoir commencer à louer un véhicule.</p>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-xl">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Téléverser votre permis de conduire au format JPEG ou PDF :
                </label>
                <input
                  type="file"
                  accept=".pdf, image/jpeg"
                  onChange={handleFileChange}
                  className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={!file}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoadDrivingLicense;
