import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputField from "../../../components/ui/inputField.jsx";
import Button from "../../../components/ui/button.jsx";
import { authAPI } from "../../../utils/api.js";

const ProfileManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  // Get data from navigation state or use defaults
  const userData = location.state || {};

  // Initialize state with passed data or defaults
  const [fullName, setFullName] = useState(userData.full_name || "");
  const [birthdate, setBirthdate] = useState(userData.birthdate || "");
  const [gender, setGender] = useState(userData.gender || "");
  const [height, setHeight] = useState(userData.height || "");
  const [weight, setWeight] = useState(userData.weight || "");
  const [bloodtype, setBloodtype] = useState(userData.bloodtype || "");
  const [fitnessLevel, setFitnessLevel] = useState(userData.fitness_level || "");
  const [exercises, setExercises] = useState(userData.exercises || []);
  const [checkups, setCheckups] = useState(userData.checkups || "");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setInitialLoading(true);
        const userInfo = await authAPI.getUserInfo();
        
        // Update state with fetched data
        setFullName(userInfo.full_name || "");
        setBirthdate(userInfo.birthdate || "");
        setGender(userInfo.gender || "");
        setHeight(userInfo.height || "");
        setWeight(userInfo.weight || "");
        setBloodtype(userInfo.bloodtype || "");
        setFitnessLevel(userInfo.fitness_level || "");
        setExercises(userInfo.exercises || []);
        setCheckups(userInfo.checkups || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({ 
          type: "error", 
          text: t("error_loading_user_data") || "Error loading user data" 
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, [t]);

  // Handle form submission
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!fullName || !birthdate || !height || !weight) {
      setMessage({ type: "error", text: t("fill_required_fields") || "Please fill in all required fields" });
      return;
    }

    // Validate height and weight are numbers
    if (isNaN(height) || isNaN(weight)) {
      setMessage({ type: "error", text: t("enter_valid_numbers") || "Please enter valid numbers for height and weight" });
      return;
    }

    // Validate fitness level is a number between 1-5
    if (fitnessLevel && (isNaN(fitnessLevel) || fitnessLevel < 1 || fitnessLevel > 5)) {
      setMessage({ type: "error", text: t("fitness_level_range") || "Fitness level must be between 1 and 5" });
      return;
    }

    try {
      setLoading(true);
      
      // Prepare user info data according to backend UserInfo model
      const userInfoData = {
        full_name: fullName,
        birthdate: birthdate,
        gender: gender || null,
        height: parseInt(height),
        weight: parseInt(weight),
        bloodtype: bloodtype || null,
        fitness_level: fitnessLevel ? parseInt(fitnessLevel) : 1,
        exercises: Array.isArray(exercises) ? exercises : [],
        checkups: checkups || null
      };

      // Update user info via API
      await authAPI.updateUserInfo(userInfoData);
      
      setMessage({ type: "success", text: t("profile_updated_successfully") || "Profile updated successfully" });

      // Navigate back to settings after a short delay
      setTimeout(() => {
        navigate("/settings", {
          state: {
            updated: true,
            userData: userInfoData,
          },
        });
      }, 1500);
    } catch (error) {
      console.error("Error updating user info:", error);
      setMessage({ 
        type: "error", 
        text: t("error_updating_profile") || "Error updating profile. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="profile-management-container">
      {/* Header */}
      <div className="profile-management-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>
        <div className="h4">{t("profile_management")}</div>
        <span className="material-symbols-rounded more_vert"></span>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`message ${message.type}`}>
          <span className="material-symbols-rounded">
            {message.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Info Section */}
      <div className="profile-info">
        <div className="profile-avatar">
          <img src="/default-avatar.png" alt="Profile" />
        </div>
        <div className="profile-details">
          <div className="profile-name body-bold">
            {fullName || t("user_name") || "User Name"}
          </div>
          <div className="profile-email caption">
            {birthdate || t("birthdate") || "Birthdate"}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="profile-management-content">
        {initialLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{t("loading") || "Loading..."}</p>
          </div>
        ) : (
          <form
            className="profile-management-fields"
            onSubmit={handleSaveChanges}
          >
            <InputField
              placeholder={t("full_name") || "Full Name"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<span className="material-symbols-rounded">person</span>}
              required
            />

            <InputField
              placeholder={t("birthdate") || "Birthdate (YYYY-MM-DD)"}
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              leftIcon={<span className="material-symbols-rounded">calendar_today</span>}
              type="date"
              required
            />

            <InputField
              placeholder={t("gender") || "Gender (Optional)"}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              leftIcon={<span className="material-symbols-rounded">person</span>}
            />

            <InputField
              placeholder={t("height") || "Height (cm)"}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              leftIcon={<span className="material-symbols-rounded">height</span>}
              type="number"
              required
            />

            <InputField
              placeholder={t("weight") || "Weight (kg)"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              leftIcon={<span className="material-symbols-rounded">monitor_weight</span>}
              type="number"
              required
            />

            <InputField
              placeholder={t("bloodtype") || "Blood Type (Optional)"}
              value={bloodtype}
              onChange={(e) => setBloodtype(e.target.value)}
              leftIcon={<span className="material-symbols-rounded">bloodtype</span>}
            />

            <InputField
              placeholder={t("fitness_level") || "Fitness Level (1-5)"}
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
              leftIcon={<span className="material-symbols-rounded">fitness_center</span>}
              type="number"
              min="1"
              max="5"
            />

            <InputField
              placeholder={t("checkups") || "Last Checkup (Optional)"}
              value={checkups}
              onChange={(e) => setCheckups(e.target.value)}
              leftIcon={<span className="material-symbols-rounded">medical_services</span>}
            />

            {/* Save Button */}
            <div className="profile-management-actions">
              <Button 
                className="update-profile-button" 
                type="submit"
                disabled={loading}
              >
                {loading ? (t("saving") || "Saving...") : (t("save_changes") || "Save Changes")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileManagement;
