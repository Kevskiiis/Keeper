import React, {useState} from "react";
import '../styles/components/RegisterForm.css';

function RegisterForm (props) {
    const [form, setForm] = useState({
        email: "",
        password: "",
        verifiedPassword: "",
        firstName: "",
        middleName: "",
        lastName: ""
    });

    function handleChange (event) {
        const {name, value} = event.target;

        setForm((prevForm) => {
            return {
                ...prevForm,
                [name]: value
            }
        });
    }

    return (
        <div>
            <form onSubmit={(event) => {
                event.preventDefault(); 
                props.handleRegister(form)
                }} className="login-form-container"
            >
                <input onChange={handleChange} name="email" value={form.email} type="email" placeholder="Email (Required)" required/>
                <input onChange={handleChange} name="password" value={form.password} type="password" placeholder="Password (Required) " required/>
                <input onChange={handleChange} name="verifiedPassword" value={form.verifiedPassword} type="password" placeholder="Confirm Password (Required)" required/>
                <input onChange={handleChange} name="firstName" value={form.firstName} type="text" placeholder="First Name (Required)" required/>
                <input onChange={handleChange} name="middleName" value={form.middleName} type="text" placeholder="Middle Name (Not Required)"/>
                <input onChange={handleChange} name="lastName" value={form.lastName} type="text" placeholder="Last Name (Required)" required/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
export default RegisterForm;