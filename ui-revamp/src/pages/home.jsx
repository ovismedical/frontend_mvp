import React from "react";
import UserHeader from "../components/layout/userheader.jsx";
import DailyCheckIn from "../components/layout/dailyCheckIn.jsx";
import TodaysMedication from "../components/layout/todaysMedication.jsx";
import WellnessScoreCard from "../components/layout/wellnessCard.jsx";
import CareLibrary from "../components/layout/careLibrary.jsx";
import HomeNotifications from "../components/layout/homeNotifications.jsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page-container">
      <UserHeader />
      <div className="home-page-notifications">
        <HomeNotifications />
      </div>
      <div className="homepage-content-container">
        <DailyCheckIn currentDays={2} longestDays={12} />
        <TodaysMedication />
        <WellnessScoreCard />
        <CareLibrary />
      </div>
    </div>
  );
};

export default Home;
