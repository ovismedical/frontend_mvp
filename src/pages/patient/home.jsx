import React, { useState, useEffect } from "react";
import PatientHeader from "../../components/layout/patientHeader.jsx";
import DailyCheckIn from "../../components/layout/dailyCheckIn.jsx";
import TodaysMedication from "../../components/layout/todaysMedication.jsx";
import WellnessScoreCard from "../../components/layout/wellnessCard.jsx";
import CareLibrary from "../../components/layout/careLibrary.jsx";
import HomeNotifications from "../../components/layout/homeNotifications.jsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { questionsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      if (user && user.username) {
        try {
          const data = await questionsAPI.getStreak(user.username);
          setCurrentStreak(data.streak || 0);
          setLongestStreak(data.longest_streak || 0);
        } catch (err) {
          console.error("Failed to fetch streak:", err);
        }
      }
    };
    fetchStreak();
  }, [user]);

  return (
    <div className="home-page-container">
      <PatientHeader />
      <div className="home-page-notifications">
        <HomeNotifications />
      </div>
      <div className="homepage-content-container">
        <DailyCheckIn currentDays={currentStreak} longestDays={longestStreak} />
        <TodaysMedication />
        <WellnessScoreCard />
        <CareLibrary />
      </div>
    </div>
  );
};

export default Home;
