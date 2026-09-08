import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../ui/notificationCard.jsx";
import { analyticsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/homeNotifications.css";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Care-team notifications derived from the patient's own record: any assessment or
 * check-in from the last 7 days that was flagged for the oncologist.
 */
const HomeNotifications = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return new Set(JSON.parse(sessionStorage.getItem("dismissedFlags") || "[]"));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    let cancelled = false;
    analyticsAPI
      .getUnifiedAssessments()
      .then((data) => {
        if (cancelled) return;
        const cutoff = Date.now() - WEEK_MS;
        const locale = i18n.language === "zh" ? "zh-HK" : "en-US";
        const doctor = user?.doctor_name || t("your_care_team");
        const flagged = (data?.assessments || [])
          .filter((a) => a.oncologist_notification_level && a.oncologist_notification_level !== "none")
          .filter((a) => new Date(a.date).getTime() >= cutoff)
          .map((a) => ({
            id: a.id,
            title: t("notification_flagged_for", { doctor }),
            message: `${new Date(a.date).toLocaleDateString(locale, { month: "short", day: "numeric" })} · ${a.summary}`,
            icon: a.oncologist_notification_level === "red" ? "error" : "warning",
            type: a.oncologist_notification_level === "red" ? "error" : "warning",
          }));
        setNotifications(flagged);
      })
      .catch(() => { if (!cancelled) setNotifications([]); });
    return () => { cancelled = true; };
  }, [user?.doctor_name, i18n.language, t]);

  const visible = notifications.filter((n) => !dismissed.has(n.id));

  const handleClose = (id) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    try {
      sessionStorage.setItem("dismissedFlags", JSON.stringify([...next]));
    } catch {
      // storage unavailable: dismissal only lasts for this render
    }
  };

  if (visible.length === 0) return null;

  return (
    <div className="home-notifications-container" onClick={() => navigate("/dashboard")} role="button" tabIndex={0}>
      {visible.slice(0, 1).map((note) => (
        <NotificationCard
          key={note.id}
          title={note.title}
          message={note.message}
          icon={note.icon}
          type={note.type}
          onClose={(e) => { e?.stopPropagation?.(); handleClose(note.id); }}
        />
      ))}
      {visible.length > 1 && (
        <div className="stacked-count body">
          + {visible.length - 1} {t("more")}
        </div>
      )}
    </div>
  );
};

export default HomeNotifications;
