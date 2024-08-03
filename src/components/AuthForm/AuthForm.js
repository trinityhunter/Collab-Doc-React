import React, { useState } from "react";
import "./AuthForm.css";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { signup, login } from '../../actions/auth'

const AuthForm = () => {

  const [isSignUp, setIsSignUp] = useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSwitch = () => {
    if(!isSignUp){
        setIsSignUp(true)
    }
    else{
        setIsSignUp(false)
    }
}

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email && !password) {
      alert("Enter email and password");
    }

    if (isSignUp) {
      if (!name) {
        alert("Enter your name to continue");
      }
      dispatch(signup({ name, email, password }, navigate));
    } else {
      dispatch(login({ email, password }, navigate));
    }

    // console.log({name, email, password})
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        {isSignUp && (
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isSignUp}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{!isSignUp ? "Login" : "Sign Up"}</button>
        <p className="toggle-text">
          {!isSignUp ? (
            <>
              New User? <span onClick={handleSwitch}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={handleSwitch}>Login</span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
