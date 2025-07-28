import Picker from "react-mobile-picker";

const FrequencyPicker = ({ selected, onChange }) => {
  const options = ["Weekly", "Bi-weekly", "Monthly", "Bi-monthly", "Yearly"];

  return (
    <div className="frequency-picker-container display">
      <Picker
        value={{ frequency: selected }}
        onChange={(val) => onChange(val.frequency)}
        height={240}
        itemHeight={50}
      >
        <Picker.Column name="frequency">
          {options.map((option) => (
            <Picker.Item key={option} value={option}>
              {({ selected }) => (
                <div
                  style={{
                    width: "100%",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "15px",
                    color: selected ? "var(--blue-700)" : "var(--text-200)",
                    backgroundColor: selected
                      ? "var(--blue-light-100)"
                      : "transparent",
                    border: selected ? "1px solid var(--blue-700)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {option}
                </div>
              )}
            </Picker.Item>
          ))}
        </Picker.Column>
      </Picker>
    </div>
  );
};

export default FrequencyPicker;
