import React from "react";
import { Link, useNavigate} from "react-router-dom";
import styles from "./MainPage.module.css"
import logo from "./img/logo.png"

function MainPage() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard'); // redirect to another route
      };
    return (
        <div className={styles.main_body}>
            <div className={styles.main_header}>
                <img src={logo} className = {styles.main_logo}/>
            </div>

            <div className={styles.main_MainPage}>
                <div className={styles.main_leftblank}>
                    
                </div>

                <div className={styles.main_content}>
                    <Link to="/patientlogin">
                        <button className={styles.main_button}>
                            Patient Login
                        </button>
                    </Link>
                    <Link to="/adminlogin">
                        <button className={styles.main_button}>
                            Admin Login
                        </button>
                    </Link>
                    <Link to="/faq">
                        <button className={styles.main_button}>
                            FAQ
                        </button>
                    </Link>
                </div>

                <div className={styles.main_rightblank}>
                    
                </div>
            </div>
        </div>
    );
  }

export default MainPage