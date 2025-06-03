import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./img/logo.png";
import styles from "./login.module.css";

function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [hospital, setHospital] = useState("");
  const [doctor, setDoctor] = useState("");
  const [dob, setDob] = useState({ month: "", day: "", year: "" });
  const [sex, setSex] = useState("male");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!dob.month || !dob.day || !dob.year) {
      setMessage("Please select a full date of birth.");
      return;
    }

    const formattedDob = `${dob.month}/${dob.day}/${dob.year}`;

    try {
      const response = await fetch("http://127.0.0.1:8000/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          name,
          hospital,
          doctor,
          dob: formattedDob,
          sex,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message === "Account created") {
        navigate("/patientlogin");
      } else {
        setMessage(data.detail || "Account creation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Network error or backend not running");
    }
  };

  return (
    <div className={styles.login_body}>
      <div className={styles.login_content}>
        <img src={logo} className={styles.login_logo} alt="Logo" />
        <h1>Create Patient Account</h1>

        <input
          className={styles.login_userinput}
          type="text"
          placeholder="Username / Patient ID"
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

        <input
          className={styles.login_userinput}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className={styles.login_userinput}
          type="text"
          placeholder="Hospital"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
        />

        <input
          className={styles.login_userinput}
          type="text"
          placeholder="Doctor"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
        />

        {/* Date of Birth Dropdowns */}
        <div className={styles.dob_row}>
        <select
            className={styles.login_userinput}
            value={dob.month}
            onChange={(e) => setDob({ ...dob, month: e.target.value })}
        >
            <option value="">Month</option>
            {[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ].map((monthName, i) => (
            <option key={monthName} value={String(i + 1).padStart(2, "0")}>
                {monthName}
            </option>
            ))}
        </select>

        <select
            className={styles.login_userinput}
            value={dob.day}
            onChange={(e) => setDob({ ...dob, day: e.target.value })}
        >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                {i + 1}
            </option>
            ))}
        </select>

        <select
            className={styles.login_userinput}
            value={dob.year}
            onChange={(e) => setDob({ ...dob, year: e.target.value })}
        >
            <option value="">Year</option>
            {Array.from({ length: 100 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
                <option key={year} value={year}>
                {year}
                </option>
            );
            })}
        </select>
        </div>


        <select
          className={styles.login_userinput}
          value={sex}
          onChange={(e) => setSex(e.target.value)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button className={styles.login_submit} onClick={handleCreate}>
          Create Account
        </button>

        {message && <p style={{ color: "red" }}>{message}</p>}
      </div>
    </div>
  );
}

export default CreateAccount;
