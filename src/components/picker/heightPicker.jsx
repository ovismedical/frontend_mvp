import Picker from "react-mobile-picker";

const HeightPicker = ({ unit = "cm", value, onChange }) => {
  const options = [];

  if (unit === "cm") {
    for (let i = 50; i <= 250; i++) {
      options.push(i + " cm");
    }
  } else if (unit === "inch") {
    for (let i = 20; i <= 100; i++) {
      options.push(i + " in");
    }
  }

  return (
    <div className="height-picker display">
      <Picker
        value={value}
        onChange={onChange}
        height={240}
        itemHeight={50}
      >
        <Picker.Column name="height">
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
                    backgroundColor: selected ? "var(--blue-light-100)" : "transparent",
                    border: selected ? "1px solid var(--blue-700)" : "none",
                    transition: "all 0.2s ease",
                    userSelect: "none",
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

export default HeightPicker;
