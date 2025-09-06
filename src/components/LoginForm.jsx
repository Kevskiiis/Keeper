import React, {useState} from "react";
import '../styles/components/LoginForm.css';

function LoginForm (props) {
    const [form, setForm] = useState({email: "", password: ""});

    function handleChange (event) {
        const {name, value} = event.target;

        setForm ((prevForm) => {
            return {
                ...prevForm,
                [name]: value
            }
        });
    }

    return (
        <div>
            <form onSubmit={(event) =>
                {
                    event.preventDefault();
                    props.handleLogin(form)
                }
                } className="login-form-container"
            >
                <input onChange={handleChange} name="email" value={form.email} type="email" placeholder="Email" required />
                <input onChange={handleChange} name="password" value={form.password} type="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
export default LoginForm;