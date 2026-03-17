import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SideEffectInput from "../../../components/ui/sideEffectInput";
import Button from "../../../components/ui/button";

const AddMedications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patientId } = useParams();
  const { t, i18n } = useTranslation();

  const editing = !!location.state?.medication;

  const [medication, setMedication] = useState(
    editing
      ? {
          name: location.state.medication.medName || "",
          strength: location.state.medication.strength?.toString() || "",
          quantity: location.state.medication.quantity?.toString() || "",
          type: location.state.medication.type?.toLowerCase() || "",
          expirationDate: location.state.medication.expirationDate || "",
          dosage: location.state.medication.dosageInstructions || "",
          usedFor: location.state.medication.usedFor || "",
        }
      : {
          name: "",
          strength: "",
          quantity: "",
          type: "",
          expirationDate: "",
          dosage: "",
          usedFor: "",
        }
  );

  const [sideEffects, setSideEffects] = useState(
    editing
      ? location.state.medication.sideEffects || {
          common: [],
          lessCommon: [],
          serious: [],
        }
      : {
          common: [],
          lessCommon: [],
          serious: [],
        }
  );

  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [errors, setErrors] = useState({});

  const medicationTypes = [
    { value: "tablet", label: t("tablet") },
    { value: "capsule", label: t("capsule") },
    { value: "syrup", label: t("syrup") },
    { value: "injection", label: t("injection") },
  ];

  const isValidFutureDate = (dateStr) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const isValidStrength = (str) => {
    return (
      /^(\d+(\.\d+)?)(\s?(mg|g))?$/i.test(str.trim()) && parseFloat(str) > 0
    );
  };

  const isValidQuantity = (str) => {
    return /^\d+$/.test(str.trim()) && parseInt(str, 10) > 0;
  };

  const handleExpirationDateChange = (e) => {
    let value = e.target.value.replace(/[^\d-]/g, "");
    if (value.length === 4 || value.length === 7) {
      if (value[value.length - 1] !== "-") value += "-";
    }
    if (value.length > 10) value = value.slice(0, 10);
    setMedication({ ...medication, expirationDate: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!medication.name.trim()) newErrors.name = t("medication_name_required");
    if (!medication.strength.trim()) {
      newErrors.strength = t("strength_required");
    } else if (!isValidStrength(medication.strength)) {
      newErrors.strength = t("strength_invalid");
    }
    if (!medication.quantity.trim()) {
      newErrors.quantity = t("quantity_required");
    } else if (!isValidQuantity(medication.quantity)) {
      newErrors.quantity = t("quantity_invalid");
    }
    if (!medication.type.trim()) newErrors.type = t("type_required");
    if (!medication.expirationDate.trim()) {
      newErrors.expirationDate = t("expiration_date_required");
    } else if (!isValidFutureDate(medication.expirationDate)) {
      newErrors.expirationDate = t("expiration_date_invalid");
    }
    if (!medication.dosage.trim()) newErrors.dosage = t("dosage_required");
    if (!medication.usedFor.trim()) newErrors.usedFor = t("used_for_required");
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setMessage({ text: t("medication_saved_success"), type: "success" });
    setTimeout(() => {
      navigate(`/patient_details/${patientId}`);
    }, 1200);
  };

  return (
    <div className="add-medications-container">
      {/* Header */}
      <div className="add-medications-header">
        <span
          className="material-symbols-rounded add-medications-back"
          onClick={() => navigate(`/patient_details/${patientId}`)}
        >
          chevron_backward
        </span>
        <h3 className="add-medications-title">
          {editing ? t("update_medication") : t("add_medication")}
        </h3>
        <span style={{ width: "24px" }}></span>
      </div>

      {/* Success Message */}
      {message.text && (
        <div className={`message ${message.type}`}>
          <span className="material-symbols-rounded">check_circle</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Content */}
      <div className="add-medications-content">
        <div className="add-medications-field caption">
          <label>{t("medication_name")}</label>
          <input
            className={`caption${errors.name ? " error" : ""}`}
            type="text"
            placeholder={t("enter_medication_name")}
            value={medication.name}
            onChange={(e) =>
              setMedication({ ...medication, name: e.target.value })
            }
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="add-medications-row">
          <div className="add-medications-field caption">
            <label>{t("strength")}</label>
            <input
              className={`caption${errors.strength ? " error" : ""}`}
              type="text"
              placeholder={t("enter_strength")}
              value={medication.strength}
              onChange={(e) =>
                setMedication({ ...medication, strength: e.target.value })
              }
            />
            {errors.strength && (
              <span className="field-error">{errors.strength}</span>
            )}
          </div>
          <div className="add-medications-field caption">
            <label>{t("quantity")}</label>
            <input
              className={`caption${errors.quantity ? " error" : ""}`}
              type="text"
              placeholder={t("enter_quantity")}
              value={medication.quantity}
              onChange={(e) =>
                setMedication({ ...medication, quantity: e.target.value })
              }
            />
            {errors.quantity && (
              <span className="field-error">{errors.quantity}</span>
            )}
          </div>
        </div>

        <div className="add-medications-field caption">
          <label>{t("type")}</label>
          <div
            className="add-medications-dropdown"
            tabIndex={0}
            onBlur={() => setShowDropdown(false)}
          >
            <div
              className={
                "add-medications-dropdown-selected caption" +
                (!medication.type ? " placeholder" : "") +
                (errors.type ? " error" : "")
              }
              onClick={() => setShowDropdown((v) => !v)}
            >
              {medication.type
                ? medicationTypes.find((t) => t.value === medication.type)
                    ?.label
                : t("select_type")}
              <span
                className="material-symbols-rounded"
                style={{ fontSize: 18 }}
              >
                expand_more
              </span>
            </div>
            {showDropdown && (
              <div className="add-medications-dropdown-list">
                {medicationTypes.map((type) => (
                  <div
                    key={type.value}
                    className={
                      "add-medications-dropdown-item caption" +
                      (medication.type === type.value ? " selected" : "")
                    }
                    onClick={() => {
                      setMedication({ ...medication, type: type.value });
                      setShowDropdown(false);
                    }}
                  >
                    {type.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.type && <span className="field-error">{errors.type}</span>}
        </div>

        <div className="add-medications-field caption">
          <label>{t("expiration_date")}</label>
          <input
            className={`caption${errors.expirationDate ? " error" : ""}`}
            type="text"
            placeholder={t("enter_expiration_date")}
            value={medication.expirationDate}
            onChange={handleExpirationDateChange}
            maxLength={10}
            inputMode="numeric"
            autoComplete="off"
          />
          {errors.expirationDate && (
            <span className="field-error">{errors.expirationDate}</span>
          )}
        </div>

        <div className="add-medications-field caption">
          <label>{t("dosage_instructions")}</label>
          <input
            className={`caption${errors.dosage ? " error" : ""}`}
            type="text"
            placeholder={t("enter_dosage_instructions")}
            value={medication.dosage}
            onChange={(e) =>
              setMedication({ ...medication, dosage: e.target.value })
            }
          />
          {errors.dosage && (
            <span className="field-error">{errors.dosage}</span>
          )}
        </div>

        <div className="add-medications-field caption">
          <label>{t("used_for")}</label>
          <input
            className={`caption${errors.usedFor ? " error" : ""}`}
            type="text"
            placeholder={t("enter_used_for")}
            value={medication.usedFor}
            onChange={(e) =>
              setMedication({ ...medication, usedFor: e.target.value })
            }
          />
          {errors.usedFor && (
            <span className="field-error">{errors.usedFor}</span>
          )}
        </div>

        {/* Side Effects */}
        <div className="add-medications-side-effects-content">
          <SideEffectInput
            label={t("common_side_effects")}
            category="common"
            sideEffects={sideEffects}
            setSideEffects={setSideEffects}
            placeholder={t("add_common_side_effects_placeholder")}
          />
          <SideEffectInput
            label={t("less_common_side_effects")}
            category="lessCommon"
            sideEffects={sideEffects}
            setSideEffects={setSideEffects}
            placeholder={t("add_less_common_side_effects_placeholder")}
          />
          <SideEffectInput
            label={t("serious_side_effects")}
            category="serious"
            sideEffects={sideEffects}
            setSideEffects={setSideEffects}
            placeholder={t("add_serious_side_effects_placeholder")}
          />
        </div>

        <Button
          variant="filled"
          iconName="check"
          iconPosition="left"
          iconFill={1}
          className="add-medication-confirm-button"
          onClick={handleSubmit}
        >
          {editing ? t("update_medication") : t("add_medication")}
        </Button>
      </div>
    </div>
  );
};

export default AddMedications;
