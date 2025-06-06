import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./img/logo.png";
import styles from "./login.module.css";

function PatientLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch("http://127.0.0.1:8000/patient-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.message === "Invalid credentials") {
      console.error("Error:", response.status, response.statusText);
      setMessage("Login failed");
    }
    if (data.message === "Patient login successful") {
      setToken(data.token);
      localStorage.setItem("token", JSON.stringify(data.token));
      navigate("/dashboard");
    }
  };

  const goToCreateAccount = () => {
    navigate("/createaccount");
  };

  return (
    <div className={styles.login_body}>
      <div className={styles.login_content}>
        <img src={logo} className={styles.login_logo} />
        <h1>Patient Login</h1>

        <input
          className={styles.login_userinput}
          type="text"
          placeholder="Username/Patient ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className={styles.login_passwordinput}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.login_submit} onClick={handleLogin}>
          Enter
        </button>

        <button className={styles.login_createAccount} onClick={goToCreateAccount}>
          Create Account
        </button>
      </div>
    </div>
  );
}

export default PatientLogin;
