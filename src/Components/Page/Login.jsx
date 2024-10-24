import { useParams } from 'react-router-dom';
import FetchDoc from "../Api/FetchDoc.jsx";
import LoginForm from '../Api/Login.jsx';
        
function Login() {
    return (
      <div>
        <h1>Login</h1>
        <LoginForm />
      </div>
    );
}

export default Login;
