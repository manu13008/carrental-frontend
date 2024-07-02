import Input from "../components/Input";
import ButtonValidate from "../components/ButtonValidate";
import { Link , useNavigate} from 'react-router-dom';
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';


function SignUp() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userExists, setUserExists] = useState(false); 

    // Pour les tests
    const [isValidEmail, setIsValidEmail] = useState(true); 
    const [isValidPassword, setIsValidPassword] = useState(true);

    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;


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


    const handleClickInscription = () => {
        setIsValidEmail(true)
        setIsValidPassword(true)
        setUserExists(false); // Reset user exists state

        if (!emailRegex.test(email)) {
            setIsValidEmail(false);
        } else if (password.length < 8) {
            setIsValidPassword(false)
        } else {
            console.log('test connexion en cours')

           
            axios.post('http://localhost:3001/user/signup', { email, password })
            .then(response => {
                console.log('User created successfully', response.data);

                // Automatically login after signup
                axios.post('http://localhost:3001/auth/login', { email, password })
                    .then(response => {
                        console.log('Login successful', response.data);
                        localStorage.setItem('token', response.data.access_token);
                        navigate('/loaddrivinglicense');
                    })
                    .catch(error => {
                        console.error('Error during login!', error);
                    });
            })
            .catch(error => {
                if (error.response && error.response.status === 409) { // Check for conflict error
                    setUserExists(true);
                } 
                console.error('Error while creating the user!', error);
            });
    }
};


 return (

<div className="flex flex-col mt-16 justify-center items-center" >
<p className="mb-4">Inscrivez-vous</p>

    <div className={`mb-16  flex flex-col  items-center ${isValidEmail ? '' : 'mb-12'}`}>
    <label className= "mr-4">Email </label>
    <Input type='email'
         placeholder='email...'
         value={email}
         onChange={(mail => {setEmail(mail.target.value)})} 
         className={`bg-blue-200 hover:bg-blue-500 text-black font-bold py-2 px-4 rounded ${isValidEmail ? '' : 'border border-red-500'}`}/>
    {!isValidEmail && <p className="text-xs"> Veuillez entrer une adresse email valide.</p>}        
   
   </div>

   <div className={`mb-16 flex flex-col  items-center ${isValidPassword ? '' : 'mb-12'}`}>
   <label className= "mr-4">Password </label>
     <Input type='password'
         placeholder='password...'
         value={password}
         onChange={(pwd => {setPassword(pwd.target.value)})} 
         className={`bg-blue-200 hover:bg-blue-500 text-black font-bold py-2 px-4 rounded ${isValidPassword ? '' : 'border border-red-500'}`}/>
         {!isValidPassword && <p className="text-xs"> Votre mot de passe doit faire au moins 8 caractères.</p>} 
    </div>

        <ButtonValidate className="bg-blue-300 hover:bg-blue-700 text-black rounded py-2  w-48 font-bold " 
        value="Inscription"
        onClick={handleClickInscription}/>
        {userExists && <p className="text-red-500">L'utilisateur existe déjà. Veuillez essayer un autre email.</p>}
          
    
    <div className ="mt-2">
        <p className="text-sm">Déjà un compte ? <Link to="/" className="text-blue-500 hover:underline">Connectez vous ici</Link></p>
    </div>

</div>

 );
}

export default SignUp;