import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import unlockedBadgeImage from "../../assets/images/achievements/badges/unlocked/7daystreak.png";
import lockedBadgeImage from "../../assets/images/achievements/badges/locked/14daystreak.png";

import Button from "../../components/ui/button";

const BadgeDetails = () => {
  const navigate = useNavigate();
  const shareContentRef = useRef(null);
  const { variant = "unlocked" } = useParams(); // Get variant from URL params

  // Badge configuration based on variant
  const badgeConfig = {
    unlocked: {
      image: unlockedBadgeImage,
      name: "7-Day Streak",
      description: "You're on a roll with 7 days of check-ins in a row!",
      showCongrats: true,
      showDate: true,
      showShare: true,
    },
    locked: {
      image: lockedBadgeImage,
      name: "14-Day Streak",
      description:
        "Earn this badge by completing check-ins for 14 days in a row. If you miss a day, your streak will reset. You’ve checked in for 13 consecutive days so far.",
      showCongrats: false,
      showDate: false,
      showShare: false,
    },
  };

  const currentBadge = badgeConfig[variant] || badgeConfig.unlocked;

  const handleShare = async () => {
    try {
      // Capture the badge content as image
      const canvas = await html2canvas(shareContentRef.current, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher quality
        useCORS: true,
      });

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        const file = new File([blob], "badge-achievement.png", {
          type: "image/png",
        });

        const shareData = {
          title: "Badge Unlocked!",
          text: `I just unlocked the ${currentBadge.name} badge!`,
          files: [file],
        };

        try {
          // Check if native sharing with files is supported
          if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
          } else {
            // Fallback: Download the image
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "badge-achievement.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert("Badge image downloaded!");
          }
        } catch (error) {
          console.error("Error sharing image:", error);
          // Fallback: Download the image
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "badge-achievement.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          alert("Badge image downloaded!");
        }
      }, "image/png");
    } catch (error) {
      console.error("Error creating image:", error);
      alert("Unable to create image. Please try again.");
    }
  };

  return (
    <div className="badge-details-container">
      <div className="badge-details-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>

        <div className="badge-details-header h4"></div>
        <span className="material-symbols-rounded file_save"></span>
      </div>

      <div className="badge-details-content">
        <div className="badge-details-info" ref={shareContentRef}>
          {currentBadge.showCongrats && (
            <h3 className="badge-details-congrats h4">Congratulations</h3>
          )}
          {variant === "unlocked" && (
            <h2 className="badge-details-unlocked h2">
              Badge Unlocked!
            </h2>
          )}

          <div className="badge-details-image">
            <img src={currentBadge.image} alt="Badge" />
          </div>

          <h2 className="badge-details-name h2">{currentBadge.name}</h2>
          <p className="badge-details-description body">
            {currentBadge.description}
          </p>

          {currentBadge.showDate && (
            <div className="badge-details-date">
              <span className="material-symbols-rounded event">event</span>
              <p className="badge-details-date-text body">
                Unlocked on Feb 27, 2025
              </p>
            </div>
          )}
        </div>

        {currentBadge.showShare && (
          <div className="badge-details-buttonwrap">
            <Button
              variant="filled"
              iconName="share"
              iconPosition="right"
              iconFill={1}
              className="assessment-button body"
              onClick={handleShare}
            >
              Share
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeDetails;
