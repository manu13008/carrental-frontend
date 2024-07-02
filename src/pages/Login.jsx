import Input from "../components/Input";
import ButtonValidate from "../components/ButtonValidate";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";



function Login() {

    // Etats de l'utilisateur
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    // Pour les tests
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [wrongUserData, setWrongUserData] = useState(false)
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // Navigation
    const navigate = useNavigate();



    // Vérifie si l'utilisateur a un token ou si le token a expiré
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isTokenExpired(token)) {
            navigate("/loaddrivinglicense");
        }
    }, [navigate]);

    // Fonction qui vérifie si le token a expiré
    const isTokenExpired = (token) => {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    };


    // Quand l'utilisateur clique sur connexion
    const handleClickConnexion = (event) => {
        event.preventDefault();
        setInvalidEmail(false)
        setInvalidPassword(false)
        setWrongUserData(false)


        // Tests de saisie de l'utilisateur
        if (!emailRegex.test(email)) {
            setInvalidEmail(true);
        } else if (password.length < 8) {
            setInvalidPassword(true)
        } else {


            // Appel de la route Login qui vérifie l'authentification
            axios.post('http://localhost:3001/auth/login', { email, password })
                .then(response => {
                    if (response.data.access_token) {
                        // console.log(response.data)
                        localStorage.setItem('token', response.data.access_token)
                        navigate('/loaddrivinglicense');
                    } else {
                        setWrongUserData(true)
                    }
                })
                .catch(error => {
                    setWrongUserData(true)
                    console.error('There was an error for connecting the user!', error);
                });
        }
    }


    return (
        <div className="flex flex-col mt-16 justify-center items-center" >

            <p className="mb-4">Connectez-vous</p>
            <form onSubmit={handleClickConnexion} autoComplete="off">

                {/* Champ email */}
                <div className={`mb-16  flex flex-col ${invalidEmail ? 'mb-12' : ''}`}>
                <label className= "mr-4">Email </label>
                    <Input type='input'
                        placeholder='email...'
                        value={email}
                        onChange={(mail => { setEmail(mail.target.value) })}
                        className={`bg-blue-200 hover:bg-blue-500 text-black font-bold py-2 px-4 rounded ${invalidEmail || wrongUserData ? 'border border-red-500' : ''}`} />
                    {invalidEmail && <p className="text-xs"> Veuillez entrer une adresse email valide.</p>}
                </div>


                {/* Champ password */}
                <div className={`mb-16  flex flex-col ${invalidPassword ? 'mb-12' : ''}`}>
                <label className= "mr-4">Password </label>
                    <Input type='password'
                        placeholder='password...'
                        value={password}
                        onChange={(pwd => { setPassword(pwd.target.value) })}
                        autoComplete="off"
                        className={`bg-blue-200 hover:bg-blue-500 text-black font-bold py-2 px-4 rounded ${invalidPassword || wrongUserData ? 'border border-red-500' : ''}`} />
                    {invalidPassword && <p className="text-xs"> Votre mot de passe doit faire au moins 8 caractères.</p>}
                </div>

                {/* Champ Bouton Connexion */}
                <ButtonValidate className="bg-blue-300 hover:bg-blue-700 rounded py-2  w-48 font-bold "
                    value="Connexion"
                />
                {wrongUserData && <p> Email ou mot de passe incorrect</p>}
            </form>

            <div className="mt-2">
                <p className="text-sm">Pas encore de compte ? <Link to="/signup" className="text-blue-500 hover:underline">Créez en un ici</Link></p>
            </div>

        </div>

    );
}

export default Login;