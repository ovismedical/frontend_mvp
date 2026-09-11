import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackButton from "../../../components/ui/backButton";
import { memoriesAPI } from "../../../utils/api.js";

// What Florence remembers between check-ins: the patient can see every note, forget one or all of
// them, and switch remembering off. Every call returns the full current state, so the page just
// renders whatever the server sends back.
const FlorenceMemory = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [enabled, setEnabled] = useState(true);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorKey, setErrorKey] = useState("");   // a translation key, so a language switch re-renders it
  const [confirmClear, setConfirmClear] = useState(false);

  const apply = (data) => {
    setEnabled(data?.enabled !== false);
    setMemories(data?.memories || []);
  };

  useEffect(() => {
    let cancelled = false;
    memoriesAPI
      .getMine()
      .then((data) => !cancelled && apply(data))
      .catch(() => !cancelled && setErrorKey("memory_load_failed"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const run = async (call) => {
    setBusy(true);
    setErrorKey("");
    try {
      apply(await call());
    } catch {
      setErrorKey("memory_update_failed");
    } finally {
      setBusy(false);
      setConfirmClear(false);
    }
  };

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    run(memoriesAPI.clearAll);
  };

  return (
    <div className="display-language-container florence-memory-container">
      <div className="display-language-header">
        <BackButton className="chevron_backward" onClick={() => navigate(-1)} />
        <div className="h4">{t("florence_memory")}</div>
        <span className="material-symbols-rounded search" aria-hidden="true"></span>
      </div>

      <div className="florence-memory-content">
        <p className="caption florence-memory-intro">{t("florence_memory_intro")}</p>

        <div className="settings-item florence-memory-switch">
          <div className="settings-left">
            <span className="material-symbols-rounded settings-icon" aria-hidden="true">
              psychology
            </span>
            <div className="settings-item-textwrap">
              <span className="settings-item-text body" id="florence-memory-enabled-label">
                {t("memory_enabled")}
              </span>
              <span className="settings-item-subtext caption">{t("memory_enabled_desc")}</span>
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              aria-labelledby="florence-memory-enabled-label"
              checked={enabled}
              disabled={loading || busy}
              onChange={(e) => {
                const next = e.target.checked;
                run(() => memoriesAPI.setEnabled(next));
              }}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {errorKey && (
          <p className="caption florence-memory-error" role="alert">
            {t(errorKey)}
          </p>
        )}

        {loading ? (
          <p className="caption florence-memory-empty">{t("loading")}</p>
        ) : memories.length === 0 ? (
          <p className="caption florence-memory-empty">
            {enabled ? t("florence_memory_empty") : t("florence_memory_off")}
          </p>
        ) : (
          <>
            <ul className="florence-memory-list">
              {memories.map((memory) => (
                <li key={memory.memory_id} className="settings-item florence-memory-item">
                  <span className="settings-item-text body">{memory.text}</span>
                  <button
                    type="button"
                    className="florence-memory-delete"
                    aria-label={t("florence_memory_delete", { text: memory.text })}
                    disabled={busy}
                    onClick={() => run(() => memoriesAPI.remove(memory.memory_id))}
                  >
                    <span className="material-symbols-rounded" aria-hidden="true">
                      delete
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="florence-memory-clear body"
              disabled={busy}
              onClick={handleClearAll}
            >
              {confirmClear ? t("florence_memory_confirm_clear") : t("florence_memory_clear_all")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FlorenceMemory;
