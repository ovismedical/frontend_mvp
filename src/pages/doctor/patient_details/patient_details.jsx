import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tabs from "../../../components/ui/tabs";
import PatientCard from "../../../components/ui/patientCard";
import SmartInsightCard from "../../../components/ui/smartInsightCard";
import { doctorAPI, triageAPI } from "../../../utils/api";
import { timeAgo } from "../../../utils/timeAgo";
import BackButton from "../../../components/ui/backButton";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const ALERT_STYLE = {
  RED: { color: "var(--error-700)", backgroundColor: "var(--error-100)", icon: "emergency", labelKey: "status_critical" },
  ORANGE: { color: "var(--on-secondary-tint)", backgroundColor: "var(--secondary-100)", icon: "warning", labelKey: "status_at_risk" },
  YELLOW: { color: "var(--warning-700, #b45309)", backgroundColor: "var(--warning-100, #fef3c7)", icon: "error_outline", labelKey: "status_at_risk" },
  GREEN: { color: "var(--success-700)", backgroundColor: "var(--success-100)", icon: "check_circle", labelKey: "status_completed" },
};
const alertStyle = (level) => ALERT_STYLE[level] || { color: "var(--neutral-500)", backgroundColor: "var(--neutral-100)", icon: "help", labelKey: "status_unknown" };

const symptomsOf = (assessment) => {
  const symptoms = assessment?.structured_assessment?.symptoms;
  return symptoms && typeof symptoms === "object" && !Array.isArray(symptoms) ? symptoms : {};
};
const pretty = (key) => String(key).replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
const formatDateTime = (value, locale) =>
  value ? new Date(value).toLocaleString(locale, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "";

const PatientDetails = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { patientId } = useParams();
  const locale = i18n.language === "zh" ? "zh-HK" : "en-US";

  const [profile, setProfile] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(t("overview"));
  const [expanded, setExpanded] = useState({});
  const [transcripts, setTranscripts] = useState({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [details, florence, quests, smart] = await Promise.allSettled([
        doctorAPI.getPatientDetails(),
        doctorAPI.getPatientAssessments(patientId),
        doctorAPI.getPatientQuestionnaires(patientId),
        triageAPI.getSmartInsights(patientId),
      ]);
      if (cancelled) return;
      if (details.status === "fulfilled") {
        const found = (details.value.patients || []).find((p) => p.username === patientId) || null;
        setProfile(found);
        if (!found) setError(t("patient_not_found"));
      } else {
        setError(details.reason?.message || t("patient_not_found"));
      }
      if (florence.status === "fulfilled") setAssessments(florence.value.assessments || []);
      if (quests.status === "fulfilled") setQuestionnaires(quests.value.questionnaires || []);
      if (smart.status === "fulfilled") setInsights(smart.value.insights || []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [patientId, t]);

  const latest = assessments[0] || null;
  const latestAlert = latest?.alert_level || latest?.triage_assessment?.alert_level || null;
  const latestQuestionnaire = questionnaires[0] || null;

  const weekStats = useMemo(() => {
    const now = Date.now();
    const inWindow = (ts, start, end) => {
      const time = new Date(ts).getTime();
      return time >= start && time < end;
    };
    const thisWeek = { assessments: 0, severities: [] };
    const lastWeek = { assessments: 0 };
    for (const a of assessments) {
      if (inWindow(a.created_at, now - WEEK_MS, now + 1)) {
        thisWeek.assessments += 1;
        Object.values(symptomsOf(a)).forEach((s) => {
          if (s && typeof s.severity_rating === "number") thisWeek.severities.push(s.severity_rating);
        });
      } else if (inWindow(a.created_at, now - 2 * WEEK_MS, now - WEEK_MS)) {
        lastWeek.assessments += 1;
      }
    }
    for (const q of questionnaires) {
      const ts = q.timestamp || q.submitted_at;
      if (inWindow(ts, now - WEEK_MS, now + 1)) {
        thisWeek.assessments += 1;
        (q.clinical_summary?.areas_of_concern || []).forEach((c) => {
          if (typeof c.severity_score === "number" && c.severity_score > 0) thisWeek.severities.push(Math.min(5, c.severity_score));
        });
      } else if (inWindow(ts, now - 2 * WEEK_MS, now - WEEK_MS)) {
        lastWeek.assessments += 1;
      }
    }
    const avg = thisWeek.severities.length
      ? Math.round((thisWeek.severities.reduce((a, b) => a + b, 0) / thisWeek.severities.length) * 10) / 10
      : null;
    return { count: thisWeek.assessments, avgSeverity: avg, delta: thisWeek.assessments - lastWeek.assessments };
  }, [assessments, questionnaires]);

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const loadTranscript = async (assessment) => {
    const key = assessment.session_id;
    if (transcripts[key]) {
      setTranscripts((prev) => ({ ...prev, [key]: { ...prev[key], open: !prev[key].open } }));
      return;
    }
    setTranscripts((prev) => ({ ...prev, [key]: { loading: true, open: true } }));
    try {
      const detail = await doctorAPI.getPatientAssessmentDetail(patientId, key);
      setTranscripts((prev) => ({ ...prev, [key]: { open: true, messages: detail.conversation_history || [] } }));
    } catch {
      setTranscripts((prev) => ({ ...prev, [key]: { open: true, messages: [] } }));
    }
  };

  const tabs = [
    { name: t("overview") },
    { name: t("assessments") },
    { name: t("checkins") },
    { name: t("medications") },
  ];

  if (!loading && (!profile || error)) {
    return (
      <div className="patient-details-container">
        <div className="patient-details-header">
          <BackButton className="chevron_backward" onClick={() => navigate("/doctor_patients")} />
        </div>
        <div className="doctor-notifications-list-empty h4">{error || t("patient_not_found")}</div>
      </div>
    );
  }

  const name = profile?.full_name || profile?.username || patientId;
  const treatment = profile?.treatment_status || "undergoing_treatment";
  const alertMeta = alertStyle(latestAlert);
  const cardStatus = latestAlert
    ? { label: `${t(alertMeta.labelKey)} · ${latestAlert}`, icon: alertMeta.icon, color: alertMeta.color, backgroundColor: alertMeta.backgroundColor }
    : { label: t("no_alert_data"), icon: "help", color: "var(--neutral-500)", backgroundColor: "var(--neutral-100)" };

  return (
    <div className="patient-details-container">
      <div className="patient-details-header">
        <BackButton className="chevron_backward" onClick={() => navigate("/doctor_patients")} />
      </div>

      <div className="patient-card-container">
        <PatientCard
          name={name}
          subtitle={`${t(treatment)} · ${t("patient_id_label")} ${profile?.username || patientId}`}
          status={cardStatus}
        />
      </div>

      <Tabs tabs={tabs} onTabChange={setActiveTab} activeTab={activeTab} />

      {loading && <div className="patient-list-loading body">{t("loading")}</div>}

      {!loading && activeTab === t("overview") && (
        <div className="overview-tab-content">
          <div className="daily-health-summary-cards">
            <div className="daily-health-summary-card">
              <div className="daily-health-summary-card-info">
                <span className="material-symbols-rounded assignment_turned_in" style={{ color: alertMeta.color }}>
                  {alertMeta.icon}
                </span>
                <h3 className="daily-health-summary-card-title body">{latestAlert || t("no_alert_data")}</h3>
              </div>
              <p className="daily-health-summary-card-subtext caption">
                {t("latest_alert")}{latest ? ` · ${timeAgo(latest.created_at, t)}` : ""}
              </p>
            </div>
            <div className="daily-health-summary-card">
              <div className="daily-health-summary-card-info">
                <span className="material-symbols-rounded mixture_med">local_fire_department</span>
                <h3 className="daily-health-summary-card-title body">{t("streak_days", { count: profile?.streak ?? 0 })}</h3>
              </div>
              <p className="daily-health-summary-card-subtext caption">
                {t("current_streak")} · {t("longest_streak_short", { count: profile?.longest_streak ?? 0 })}
              </p>
            </div>
          </div>

          <div className="weekly-summary-container">
            <h2 className="weekly-summary-title h4">{t("weekly_summary")}</h2>
            <div className="weekly-summary-row">
              <div className="wellness-score-card">
                <span className={`wellness-score-value h4 ${weekStats.avgSeverity >= 3 ? "downward" : "upward"}`}>
                  {weekStats.avgSeverity ?? "—"}
                </span>
                <h3 className="wellness-score-title body">{t("avg_severity_7d")}</h3>
                <div className="wellness-score-caption-container">
                  <span className="wellness-score-caption caption">{t("out_of_five")}</span>
                </div>
              </div>
              <div className="engagement-level-card">
                <span className={`engagement-level-value h4 ${weekStats.delta < 0 ? "downward" : "upward"}`}>
                  {weekStats.count}
                </span>
                <h3 className="engagement-level-title body">{t("checkins_this_week")}</h3>
                <div className="engagement-level-caption-container">
                  <span className={`material-symbols-rounded caption-icon ${weekStats.delta < 0 ? "downward" : "upward"}`}>
                    {weekStats.delta < 0 ? "arrow_downward_alt" : "arrow_upward_alt"}
                  </span>
                  <span className="engagement-level-caption caption">
                    {t("vs_prev_week", { value: `${weekStats.delta >= 0 ? "+" : ""}${weekStats.delta}` })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mood-trend-container">
              <div className="mood-trend-header">
                <span className="mood-trend-title h4">{t("areas_of_concern")}</span>
                {latestQuestionnaire && (
                  <span className="mood-trend-status caption">{timeAgo(latestQuestionnaire.timestamp || latestQuestionnaire.submitted_at, t)}</span>
                )}
              </div>
              {latestQuestionnaire?.clinical_summary?.areas_of_concern?.length ? (
                <div className="concern-chip-list">
                  {latestQuestionnaire.clinical_summary.areas_of_concern.map((c) => (
                    <span key={c.section_id} className={`concern-chip caption${c.severity_score >= 3 ? " concern-chip--high" : ""}`}>
                      {c.area}
                      <strong>{c.severity_label || c.severity_score}</strong>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="caption" style={{ color: "var(--text-500)" }}>
                  {latestQuestionnaire ? t("no_concerns") : t("no_checkins_for", { name })}
                </p>
              )}
              {latestQuestionnaire?.clinical_summary?.alert_flags?.length > 0 && (
                <ul className="concern-flag-list caption">
                  {latestQuestionnaire.clinical_summary.alert_flags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {latest?.triage_assessment && (
            <div className="weekly-summary-container">
              <h2 className="weekly-summary-title h4">{t("latest_triage")}</h2>
              <div className="triage-summary body">
                <p><strong>{t("recommended")}:</strong> {latest.triage_assessment.recommended_timeline || "—"}</p>
                {latest.triage_assessment.alert_rationale && (
                  <p><strong>{t("rationale")}:</strong> {latest.triage_assessment.alert_rationale}</p>
                )}
                {latest.triage_assessment.key_symptoms?.length > 0 && (
                  <p><strong>{t("key_symptoms")}:</strong> {latest.triage_assessment.key_symptoms.join(", ")}</p>
                )}
                {latest.triage_assessment.confidence_level && (
                  <p className="caption" style={{ color: "var(--text-500)" }}>
                    {t("confidence")}: {latest.triage_assessment.confidence_level}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="weekly-smart-insight">
            <h2 className="weekly-insights-title h4">{t("smart_insights")}</h2>
            {insights.length === 0 && <p className="caption" style={{ color: "var(--text-500)" }}>{t("no_smart_insights")}</p>}
            {insights.map((insight, i) => (
              <SmartInsightCard
                key={`${insight.title}-${i}`}
                icon={insight.icon}
                title={t(insight.title)}
                description={t(insight.description)}
                insightType={insight.insightType}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && activeTab === t("assessments") && (
        <div className="doctor-notifications-list-col patient-record-list">
          {assessments.length === 0 && (
            <div className="doctor-notifications-list-empty h4">{t("no_assessments_for", { name })}</div>
          )}
          {assessments.map((a) => {
            const meta = alertStyle(a.alert_level);
            const triage = a.triage_assessment || {};
            const symptoms = symptomsOf(a);
            const transcript = transcripts[a.session_id];
            return (
              <div key={a._id || a.session_id} className="doctor-notifications-item patient-record-item">
                <div className="doctor-notifications-info">
                  <div className="doctor-notifications-info-row">
                    <span className="doctor-notifications-patient h4">
                      <span className="alert-pill caption" style={{ color: meta.color, backgroundColor: meta.backgroundColor }}>
                        {a.alert_level || "—"}
                      </span>
                      {a.assessment_type === "questionnaire_triage" ? t("questionnaire_triage") : t("florence_chat")}
                    </span>
                    <span className="doctor-notifications-time caption">{formatDateTime(a.created_at, locale)}</span>
                  </div>
                  <div className="doctor-notifications-description body">
                    {triage.alert_rationale || triage.recommended_timeline || t("no_alert_data")}
                  </div>
                  {Object.keys(symptoms).length > 0 && (
                    <div className="concern-chip-list">
                      {Object.entries(symptoms).map(([k, v]) => (
                        <span key={k} className={`concern-chip caption${v?.severity_rating >= 3 ? " concern-chip--high" : ""}`}>
                          {pretty(k)} <strong>{v?.severity_rating ?? "—"}/5</strong>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="record-actions caption">
                    <button type="button" className="record-link" onClick={() => toggle(a.session_id)}>
                      {expanded[a.session_id] ? t("hide") : t("diagnoses")}
                    </button>
                    <button type="button" className="record-link" onClick={() => loadTranscript(a)}>
                      {transcript?.open ? t("hide_transcript") : t("view_transcript")}
                    </button>
                  </div>
                  {expanded[a.session_id] && (
                    <div className="record-expanded body">
                      {triage.recommended_timeline && <p><strong>{t("recommended")}:</strong> {triage.recommended_timeline}</p>}
                      {triage.clinical_reasoning && <p>{triage.clinical_reasoning}</p>}
                      {(triage.diagnosis_predictions || []).map((d, i) => (
                        <div key={i} className="record-diagnosis">
                          <strong>{d.suspected_diagnosis}</strong>
                          <span className="caption"> · {d.probability} · {t("urgency")} {d.urgency}/5</span>
                          <p className="caption">{d.reasoning}</p>
                        </div>
                      ))}
                      {a.structured_assessment?.mood_assessment && (
                        <p className="caption"><strong>{t("mood")}:</strong> {a.structured_assessment.mood_assessment}</p>
                      )}
                    </div>
                  )}
                  {transcript?.open && (
                    <div className="record-transcript">
                      {transcript.loading && <p className="caption">{t("loading_transcript")}</p>}
                      {!transcript.loading && transcript.messages?.length === 0 && <p className="caption">{t("no_transcript")}</p>}
                      {(transcript.messages || []).map((m, i) => (
                        <div key={i} className={`transcript-bubble caption ${m.role === "user" ? "transcript-bubble--patient" : "transcript-bubble--florence"}`}>
                          <span className="transcript-role overline-timestamp">{m.role === "user" ? name : "Florence"}</span>
                          <div>{m.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && activeTab === t("checkins") && (
        <div className="doctor-notifications-list-col patient-record-list">
          {questionnaires.length === 0 && (
            <div className="doctor-notifications-list-empty h4">{t("no_checkins_for", { name })}</div>
          )}
          {questionnaires.map((q, idx) => {
            const key = `q-${q.timestamp || idx}`;
            const summary = q.clinical_summary || {};
            const meta = alertStyle(q.alert_level);
            return (
              <div key={key} className="doctor-notifications-item patient-record-item">
                <div className="doctor-notifications-info">
                  <div className="doctor-notifications-info-row">
                    <span className="doctor-notifications-patient h4">
                      {q.alert_level && (
                        <span className="alert-pill caption" style={{ color: meta.color, backgroundColor: meta.backgroundColor }}>{q.alert_level}</span>
                      )}
                      {t("checkins")}
                    </span>
                    <span className="doctor-notifications-time caption">{formatDateTime(q.timestamp || q.submitted_at, locale)}</span>
                  </div>
                  <div className="doctor-notifications-description body">
                    {summary.areas_of_concern?.length
                      ? summary.areas_of_concern.map((c) => `${c.area} (${c.severity_label || c.severity_score})`).join(", ")
                      : t("no_concerns")}
                  </div>
                  <div className="caption" style={{ color: "var(--text-500)" }}>
                    {t("answers_count", { count: q.completion?.questions_answered ?? Object.keys(q.answers || {}).length })}
                    {summary.alert_flags?.length ? ` · ${summary.alert_flags.length} ${t("flags").toLowerCase()}` : ""}
                  </div>
                  {summary.alert_flags?.length > 0 && (
                    <ul className="concern-flag-list caption">
                      {summary.alert_flags.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  )}
                  <div className="record-actions caption">
                    <button type="button" className="record-link" onClick={() => toggle(key)}>
                      {expanded[key] ? t("hide") : t("view_details")}
                    </button>
                  </div>
                  {expanded[key] && (
                    <div className="record-expanded body">
                      {(q.sections || [])
                        .filter((s) => (s.responses || []).some((r) => r.was_shown && r.display_value !== null && r.display_value !== undefined))
                        .map((s) => (
                          <div key={s.section_id} className="record-section">
                            <strong>{s.title}</strong>
                            {s.severity_label && <span className="caption"> · {s.severity_label}</span>}
                            {s.responses
                              .filter((r) => r.was_shown && r.display_value !== null && r.display_value !== undefined)
                              .map((r) => (
                                <div key={r.question_id} className="record-response caption">
                                  <span>{r.question_text}</span>
                                  <span>{Array.isArray(r.display_value) ? r.display_value.join(", ") || "—" : String(r.display_value)}</span>
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && activeTab === t("medications") && (
        <div className="medications-tab-content">
          <div className="patient-medications-list">
            <div className="medications-section">
              <h3 className="medications-section-title h4">{t("current_medications")}</h3>
              <p className="caption" style={{ color: "var(--text-500)" }}>{t("no_active_medications")}</p>
              <p className="caption" style={{ color: "var(--text-500)", marginTop: 8 }}>{t("medications_not_connected")}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientDetails;
