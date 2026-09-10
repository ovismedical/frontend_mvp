import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DoctorHeader from "../../components/layout/doctorHeader";
import OverviewCard from "../../components/ui/overviewCard";
import RecentActivityCard from "../../components/ui/recentActivityCard";
import { doctorAPI } from "../../utils/api";
import { timeAgo, todayKey } from "../../utils/timeAgo";
import { effectiveLevel } from "../../utils/alertLevels";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Urgency a clinician must act on, after any clinician override (falls back to
// Florence's level on a backend without the review feature).
const isCritical = (alert) => ["RED", "ORANGE"].includes(effectiveLevel(alert));

const DoctorHome = () => {
  const { t } = useTranslation();

  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [patientsRes, alertsRes] = await Promise.allSettled([
        doctorAPI.getPatientDetails(),
        doctorAPI.getAlerts(50),
      ]);
      if (cancelled) return;
      if (patientsRes.status === "fulfilled") setPatients(patientsRes.value.patients || []);
      if (alertsRes.status === "fulfilled") setAlerts(alertsRes.value.alerts || []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    const weekAgo = Date.now() - WEEK_MS;
    const recentAlerts = alerts.filter((a) => new Date(a.created_at).getTime() >= weekAgo);
    return {
      totalPatients: patients.length,
      criticalAlerts: recentAlerts.filter(isCritical).length,
      flaggedThisWeek: recentAlerts.length,
      checkedInToday: patients.filter((p) => p.last_completion === todayKey()).length,
    };
  }, [patients, alerts]);

  const recentActivity = useMemo(() => {
    const nameFor = (username) =>
      patients.find((p) => p.username === username)?.full_name || username;
    const items = alerts.slice(0, 6).map((a) => ({
      key: `alert-${a.session_id}`,
      type: "alert",
      title: isCritical(a) ? t("critical_alert") : t("new_assessment"),
      patient: nameFor(a.patient_id),
      time: a.created_at,
    }));
    patients
      .filter((p) => p.last_assessment_date)
      .forEach((p) => items.push({
        key: `assess-${p.username}`,
        type: "report",
        title: t("new_assessment"),
        patient: p.full_name || p.username,
        time: p.last_assessment_date,
      }));
    return items
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .filter((item, i, arr) => arr.findIndex((o) => o.patient === item.patient && o.time === item.time) === i)
      .slice(0, 5);
  }, [alerts, patients, t]);

  return (
    <div className="doctor-home-container">
      <DoctorHeader />

      <div className="doctor-home-content">
        <div className="doctor-home-overview">
          <h3 className="doctor-home-section-title h4">
            {t("todays_overview")}
          </h3>
          <div className="doctor-home-overview-cards">
            <OverviewCard
              icon="groups"
              cardValue={loading ? "…" : String(stats.totalPatients)}
              cardTitle={t("total_patients")}
            />
            <OverviewCard
              icon="warning"
              cardValue={loading ? "…" : String(stats.criticalAlerts)}
              cardTitle={t("critical_alerts")}
              variant="blue"
            />
            <OverviewCard
              icon="flag"
              cardValue={loading ? "…" : String(stats.flaggedThisWeek)}
              cardTitle={t("flagged_this_week")}
              variant="blue"
            />
            <OverviewCard
              icon="event_available"
              cardValue={loading ? "…" : String(stats.checkedInToday)}
              cardTitle={t("checked_in_today")}
            />
          </div>
        </div>

        <div className="doctor-home-recent-activity">
          <h3 className="doctor-home-section-title h4">
            {t("recent_activity")}
          </h3>
          <div className="doctor-home-recent-activity-cards">
            {!loading && recentActivity.length === 0 && (
              <p className="caption" style={{ color: "var(--text-500)" }}>{t("no_recent_activity")}</p>
            )}
            {recentActivity.map((item) => (
              <RecentActivityCard
                key={item.key}
                type={item.type}
                title={item.title}
                patient={item.patient}
                time={timeAgo(item.time, t)}
              />
            ))}
          </div>
        </div>

        <div className="doctor-home-quick-actions">
          <h3 className="doctor-home-section-title h4">{t("quick_actions")}</h3>
          <div className="doctor-home-quick-actions-cards">
            <div className="quick-action-card is-coming-soon" aria-disabled="true" title={t("coming_soon")}>
              <span className="material-symbols-rounded action-card-icon">
                person_add
              </span>
              <p className="quick-action-card-text caption">
                {t("add_patient")}
              </p>
              <span className="coming-soon-tag">{t("coming_soon")}</span>
            </div>
            <div className="quick-action-card is-coming-soon" aria-disabled="true" title={t("coming_soon")}>
              <span className="material-symbols-rounded action-card-icon">
                chat
              </span>
              <p className="quick-action-card-text caption">
                {t("send_patient_message")}
              </p>
              <span className="coming-soon-tag">{t("coming_soon")}</span>
            </div>
            <div className="quick-action-card is-coming-soon" aria-disabled="true" title={t("coming_soon")}>
              <span className="material-symbols-rounded action-card-icon">
                mixture_med
              </span>
              <p className="quick-action-card-text caption">
                {t("add_prescription")}
              </p>
              <span className="coming-soon-tag">{t("coming_soon")}</span>
            </div>
            <div className="quick-action-card is-coming-soon" aria-disabled="true" title={t("coming_soon")}>
              <span className="material-symbols-rounded action-card-icon">
                file_save
              </span>
              <p className="quick-action-card-text caption">
                {t("generate_report")}
              </p>
              <span className="coming-soon-tag">{t("coming_soon")}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DoctorHome;
