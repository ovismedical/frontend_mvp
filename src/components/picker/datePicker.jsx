import { useState, useEffect } from "react";
import Picker from "react-mobile-picker";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Helper to calculate age in years given a date
function calculateAge(year, monthIndex, day) {
  const today = new Date();
  const birthDate = new Date(year, monthIndex, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
}

// Styles function for selected/unselected items
const getItemStyle = (selected, position) => {
  const sharedStyles = {
    height: 50,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: selected ? "var(--blue-700)" : "var(--text-200)",
    backgroundColor: selected ? "var(--blue-light-100)" : "transparent",
    border: selected ? "1px solid var(--blue-700)" : "none",
    userSelect: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  };

  if (!selected) return sharedStyles;

  if (position === "left") {
    return {
      ...sharedStyles,
      borderRadius: "15px 0 0 15px",
      borderLeftWidth: "1px",
      borderRightWidth: "0",
    };
  } else if (position === "middle") {
    return {
      ...sharedStyles,
      borderRadius: "0",
      borderLeftWidth: "0",
      borderRightWidth: "0",
      marginLeft: "-1px",
      marginRight: "-1px",
    };
  } else if (position === "right") {
    return {
      ...sharedStyles,
      borderRadius: "0 15px 15px 0",
      borderLeftWidth: "0",
      borderRightWidth: "1px",
    };
  }

  return sharedStyles;
};

const DatePickerWithAge = ({ value, onChange }) => {
  const [age, setAge] = useState(calculateAge(2000, 0, 1));

  useEffect(() => {
    const year = parseInt(value.year);
    const monthIndex = months.indexOf(value.month);
    const day = parseInt(value.day);
    setAge(calculateAge(year, monthIndex, day));
  }, [value]);

  const days = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1900; y--) {
    years.push(y.toString());
  }

  const [pickerValue, setPickerValue] = useState({
    month: "",
    day: "",
    year: "",
  });

  useEffect(() => {
    const year = parseInt(pickerValue.year);
    const monthIndex = months.indexOf(pickerValue.month);
    const day = parseInt(pickerValue.day);
    setAge(calculateAge(year, monthIndex, day));
  }, [pickerValue]);

  return (
    <div className="date-picker-container">
      <Picker
        className="display"
        value={value}
        onChange={onChange}
        height={240}
        itemHeight={50}
      >
        <Picker.Column name="month">
          {months.map((m) => (
            <Picker.Item key={m} value={m}>
              {({ selected }) => (
                <div style={getItemStyle(selected, "left")}>{m}</div>
              )}
            </Picker.Item>
          ))}
        </Picker.Column>

        <Picker.Column name="day">
          {days.map((d) => (
            <Picker.Item key={d} value={d}>
              {({ selected }) => (
                <div style={getItemStyle(selected, "middle")}>{d}</div>
              )}
            </Picker.Item>
          ))}
        </Picker.Column>

        <Picker.Column name="year">
          {years.map((y) => (
            <Picker.Item key={y} value={y}>
              {({ selected }) => (
                <div style={getItemStyle(selected, "right")}>{y}</div>
              )}
            </Picker.Item>
          ))}
        </Picker.Column>
      </Picker>

      <div className="age-display body">
        <span className="material-symbols-rounded cake-icon">cake_add</span>
        I’m {age} {age === 1 ? "year" : "years"} of age
      </div>
    </div>
  );
};

export default DatePickerWithAge;
