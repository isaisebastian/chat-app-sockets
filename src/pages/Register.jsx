import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Logo from '../assets/logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerRoute } from '../utils/api-routes';

function Register() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        email: "",
        pass: "",
        confirmpass: ""
    });
    const handleSubmit = async(event) => {
        event.preventDefault();
        if(handleValidation()){
            const {email, pass, username, confirmpass} = values;
            const { data } = await axios.post(registerRoute, {
                username,
                email, 
                pass,
                confirmpass
            });
            if(data.status===false){
                toast.error(data.message, toastOptions);
            }
            if(data.status){
                localStorage.setItem('chat-app-user', JSON.stringify(data.user));
            }
            navigate("/");
        }
    }

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        hideProgressBar: false,
        theme: "dark"
    };

    useEffect(() => {
        if(localStorage.getItem('chat-app-user')) {
            navigate('/');
        }
    }, [navigate])

    const handleValidation = () => {
        const {pass, confirmpass, username} = values;
        if(pass !== confirmpass) {
            toast.error("Password and confirm password did not match!", toastOptions);
            return false;
        } else if (username.length < 3){
            toast.error("Invalid username", toastOptions);
            return false;
        } else if (pass.length < 5) {
            toast.warn("Password should be longer than 5 characters", toastOptions);
            return false;
        }
        return true;
    }

    const handleChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value});
    }
    return (
        <>
        <FormContainer>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="brand">
                    <img src={Logo} alt="logo" />
                    <h1>chatty</h1>
                </div>
                <input type="text" placeholder="Username" name="username" onChange={e => handleChange(e)} />
                <input type="email" placeholder="Email" name="email" onChange={e => handleChange(e)} />
                <input type="password" placeholder="Password" name="pass" onChange={e => handleChange(e)} />
                <input type="password" placeholder="Confirm Password" name="confirmpass" onChange={e => handleChange(e)} />
                <button type="submit">Create User</button>
                <span>
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </form>
        </FormContainer>
        <ToastContainer />
        </>
    )
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
    .brand{
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 5rem;
        }
        h1{
            color: white;
            text-transform: uppercase;
        }
    }
    form{
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
        input{
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;
            &:focus{
                border: 0.1rem solid #997af0;
                outline: none;
            }
        }
        button{
            background-color: #997af0;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.5s ease-in-out;
            &:hover{
                background-color: #4e0eff;
            }
        }
        span{
            color: white;
            text-transform: uppercase;
            a {
                color: #4e0eff;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`

export default Register