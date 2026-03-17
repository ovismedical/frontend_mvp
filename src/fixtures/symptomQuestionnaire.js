// Complete symptom questionnaire data structure
export const symptomQuestionnaire = [
  {
    id: "SN001",
    title: "Appetite Loss",
    icon: "restaurant",
    questions: [
      {
        id: "appetite_rating",
        type: "rating",
        text: "How is your appetite on a scale of one to five?",
        options: [
          { value: 1, label: "Very good" },
          { value: 2, label: "Good" },
          { value: 3, label: "Normal" },
          { value: 4, label: "Poor" },
          { value: 5, label: "Very poor" }
        ],
        required: true
      },
      {
        id: "appetite_causes",
        type: "multi-select",
        text: "What led to your poor appetite? (Choose all that apply)",
        options: [
          { value: "nausea", label: "Nausea and vomiting" },
          { value: "mouth_sores", label: "Mouth sores" },
          { value: "swallowing", label: "Swallowing difficulties" },
          { value: "taste", label: "Taste changes" },
          { value: "fullness", label: "Feeling of fullness" },
          { value: "mood", label: "Low mood / Lost interest in taking food and drinks" },
          { value: "others", label: "Others, please specify" }
        ],
        conditional: {
          dependsOn: "appetite_rating",
          showIf: (value) => value >= 4
        },
        required: false
      }
    ]
  },
  {
    id: "SN002",
    title: "Constipation/Diarrhoea",
    icon: "wc",
    questions: [
      {
        id: "bowel_frequency",
        type: "single-select",
        text: "How many times have you had bowel opening since the last record?",
        options: [
          { value: "none", label: "None" },
          { value: "1-2", label: "1-2 times" },
          { value: "3-4", label: "3-4 times" },
          { value: "5-6", label: "5-6 times" },
          { value: "6+", label: "6+ times" }
        ],
        required: true
      },
      {
        id: "bowel_description",
        type: "multi-select",
        text: "How would you describe it/them? (Choose all that apply)",
        options: [
          { value: "constipation", label: "Constipation" },
          { value: "diarrhoea", label: "Diarrhoea" },
          { value: "normal", label: "Normal" }
        ],
        conditional: {
          dependsOn: "bowel_frequency",
          showIf: (value) => value !== "none"
        },
        required: false
      },
      {
        id: "stool_appearance",
        type: "color-chart",
        text: "Which of the following has the closest resemblance to the shape of your faeces?",
        colorOptions: [
          { value: "small_pebbles", label: "Small pebbles", hex: "#8B4513" },
          { value: "black_tarry", label: "Black and tarry", hex: "#000000" },
          { value: "mushy_ragged", label: "Mushy with ragged edges", hex: "#D2691E" },
          { value: "lumpy_sausage", label: "Lumpy and sausage-like", hex: "#CD853F" },
          { value: "sausage_cracks", label: "Sausage-shape with cracks on surface", hex: "#DEB887" },
          { value: "smooth_sausage", label: "Smooth, soft sausage-shape", hex: "#F4A460" },
          { value: "soft_blobs", label: "Soft blobs with clear cut edges", hex: "#D2B48C" },
          { value: "liquid", label: "Liquid consistency with no solid pieces", hex: "#F5DEB3" }
        ],
        conditional: {
          dependsOn: "bowel_frequency",
          showIf: (value) => ["3-4", "5-6", "6+"].includes(value)
        },
        required: false
      }
    ]
  },
  {
    id: "SN003",
    title: "Cough",
    icon: "coronavirus",
    questions: [
      {
        id: "cough_frequency",
        type: "single-select",
        text: "How frequent is the coughing?",
        options: [
          { value: "none", label: "None" },
          { value: "1-2", label: "1-2 times" },
          { value: "3-4", label: "3-4 times" },
          { value: "5-6", label: "5-6 times" },
          { value: "6+", label: "6+ times" }
        ],
        required: true
      },
      {
        id: "cough_pain",
        type: "rating",
        text: "How would you describe the pain in your chest when you cough? Rate it on a scale of one to five.",
        options: [
          { value: 0, label: "None" },
          { value: 1, label: "Very mild" },
          { value: 2, label: "Mild" },
          { value: 3, label: "Moderate" },
          { value: 4, label: "Bad" },
          { value: 5, label: "Very bad" }
        ],
        conditional: {
          dependsOn: "cough_frequency",
          showIf: (value) => value !== "none"
        },
        required: false
      },
      {
        id: "cough_type",
        type: "single-select",
        text: "Is your cough mostly dry or wet cough?",
        options: [
          { value: "dry", label: "Dry" },
          { value: "wet", label: "Wet" }
        ],
        conditional: {
          dependsOn: "cough_frequency",
          showIf: (value) => ["3-4", "5-6", "6+"].includes(value)
        },
        required: false
      },
      {
        id: "phlegm_color",
        type: "color-chart",
        text: "What is the colour of your phlegm?",
        colorOptions: [
          { value: "transparent", label: "Transparent", hex: "#FFFFFF" },
          { value: "white", label: "White", hex: "#F5F5F5" },
          { value: "yellow", label: "Yellow", hex: "#FFFF00" },
          { value: "green", label: "Green", hex: "#008000" },
          { value: "red", label: "Red", hex: "#FF0000" },
          { value: "brown", label: "Brown", hex: "#8B4513" },
          { value: "black", label: "Black", hex: "#000000" }
        ],
        conditional: {
          dependsOn: "cough_type",
          showIf: (value) => value === "wet"
        },
        required: false
      }
    ]
  },
  {
    id: "SN004",
    title: "Dyspnea",
    icon: "lungs",
    questions: [
      {
        id: "dyspnea_frequency",
        type: "single-select",
        text: "How often did you experience shortness of breath?",
        options: [
          { value: "none", label: "None" },
          { value: "1-2", label: "1-2 times" },
          { value: "3-4", label: "3-4 times" },
          { value: "5-6", label: "5-6 times" },
          { value: "6+", label: "6+ times" }
        ],
        required: true
      },
      {
        id: "dyspnea_pain",
        type: "rating",
        text: "How would you describe the pain when you are short of breath? Rate it on a scale of one to five.",
        options: [
          { value: 0, label: "None" },
          { value: 1, label: "Very mild" },
          { value: 2, label: "Mild" },
          { value: 3, label: "Moderate" },
          { value: 4, label: "Bad" },
          { value: 5, label: "Very bad" }
        ],
        required: true
      },
      {
        id: "dyspnea_activities",
        type: "multi-select",
        text: "What activities usually cause shortness of breath? (Choose all that apply)",
        options: [
          { value: "talking", label: "Talking" },
          { value: "standing", label: "Standing" },
          { value: "running", label: "Running" },
          { value: "getting_up", label: "Getting out of bed" },
          { value: "stairs", label: "Walking up the stairs" },
          { value: "walking", label: "Walking short distances" },
          { value: "others", label: "Others, please specify" }
        ],
        conditional: {
          dependsOn: "dyspnea_frequency",
          showIf: (value) => ["3-4", "5-6", "6+"].includes(value)
        },
        required: false
      }
    ]
  },
  {
    id: "SN005",
    title: "Dysuria",
    icon: "water_drop",
    questions: [
      {
        id: "dysuria_frequency",
        type: "single-select",
        text: "How often did you have difficulty urinating since the last record?",
        options: [
          { value: "none", label: "None" },
          { value: "1-2", label: "1-2 times" },
          { value: "3-4", label: "3-4 times" },
          { value: "5-6", label: "5-6 times" },
          { value: "6+", label: "6+ times" }
        ],
        required: true
      },
      {
        id: "dysuria_severity",
        type: "rating",
        text: "To what extent does it affect you? Rate it on a scale of one to five.",
        options: [
          { value: 1, label: "Very mild" },
          { value: 2, label: "Mild" },
          { value: 3, label: "Moderate" },
          { value: 4, label: "Bad" },
          { value: 5, label: "Very bad" }
        ],
        required: true
      },
      {
        id: "dysuria_location",
        type: "multi-select",
        text: "Where do you feel pain/a burning sensation when you urinate? (Choose all that apply)",
        options: [
          { value: "bladder", label: "Bladder" },
          { value: "prostate", label: "Prostate" },
          { value: "urethra", label: "Urethra" },
          { value: "others", label: "Others, please specify" }
        ],
        conditional: {
          dependsOn: "dysuria_frequency",
          showIf: (value) => ["3-4", "5-6", "6+"].includes(value)
        },
        required: false
      },
      {
        id: "urine_color",
        type: "color-chart",
        text: "Which of the following has the closest resemblance to the colour of your urine?",
        colorOptions: [
          { value: "transparent", label: "Transparent", hex: "#FFFFFF" },
          { value: "yellow", label: "Yellow", hex: "#FFFF00" },
          { value: "orange", label: "Orange", hex: "#FFA500" },
          { value: "red", label: "Red", hex: "#FF0000" },
          { value: "brown", label: "Brown", hex: "#8B4513" },
          { value: "blue_green", label: "Blue green", hex: "#00CED1" }
        ],
        conditional: {
          dependsOn: "dysuria_frequency",
          showIf: (value) => ["3-4", "5-6", "6+"].includes(value)
        },
        required: false
      }
    ]
  },
  {
    id: "SN006",
    title: "Insomnia",
    icon: "bedtime",
    questions: [
      {
        id: "sleep_quality",
        type: "rating",
        text: "How would you rate the quality of sleep last night? Rate it on a scale of one to five.",
        options: [
          { value: 1, label: "Very good" },
          { value: 2, label: "Good" },
          { value: 3, label: "Normal" },
          { value: 4, label: "Poor" },
          { value: 5, label: "Very poor" }
        ],
        required: true
      },
      {
        id: "sleep_hours",
        type: "slider",
        text: "Around how many hours have you slept last night in total?",
        sliderConfig: {
          min: 1,
          max: 9,
          step: 0.5,
          unit: " hours"
        },
        conditional: {
          dependsOn: "sleep_quality",
          showIf: (value) => value >= 4
        },
        required: false
      },
      {
        id: "sleep_symptoms",
        type: "multi-select",
        text: "Have these symptoms affected your quality of sleep? (Choose all that apply)",
        options: [
          { value: "muscle_pain", label: "Muscle pain" },
          { value: "joint_pain", label: "Joint pain" },
          { value: "sore_throat", label: "Sore throat" },
          { value: "headaches", label: "Headaches" },
          { value: "anxiety", label: "Feeling anxious and/or depressed" },
          { value: "memory", label: "Memory or concentration problems" },
          { value: "exhausted", label: "Exhausted by everyday tasks" },
          { value: "not_applicable", label: "Not applicable" },
          { value: "others", label: "Others, please specify" }
        ],
        conditional: {
          dependsOn: "sleep_quality",
          showIf: (value) => value >= 4
        },
        required: false
      }
    ]
  },
  {
    id: "SN007",
    title: "Fatigue",
    icon: "battery_alert",
    questions: [
      {
        id: "fatigue_level",
        type: "rating",
        text: "How is the general level of fatigue during the past 24 hours? Rate it on a scale of one to five.",
        options: [
          { value: 0, label: "None" },
          { value: 1, label: "Very mild" },
          { value: 2, label: "Mild" },
          { value: 3, label: "Moderate" },
          { value: 4, label: "Bad" },
          { value: 5, label: "Very bad" }
        ],
        required: true
      },
      {
        id: "fatigue_interference",
        type: "rating",
        text: "How has fatigue interfered with your general activity? Rate it on a scale of one to five.",
        options: [
          { value: 0, label: "None" },
          { value: 1, label: "Very mild" },
          { value: 2, label: "Mild" },
          { value: 3, label: "Moderate" },
          { value: 4, label: "Bad" },
          { value: 5, label: "Very bad" }
        ],
        conditional: {
          dependsOn: "fatigue_level",
          showIf: (value) => value >= 2
        },
        required: false
      }
    ]
  },
  {
    id: "SN008",
    title: "Nausea/Vomiting",
    icon: "sick",
    questions: [
      {
        id: "nausea_level",
        type: "rating",
        text: "How would you describe your nausea? Rate it on a scale of one to five.",
        options: [
          { value: 0, label: "None" },
          { value: 1, label: "Very mild" },
          { value: 2, label: "Mild" },
          { value: 3, label: "Moderate" },
          { value: 4, label: "Bad" },
          { value: 5, label: "Very bad" }
        ],
        required: true
      },
      {
        id: "vomiting_episodes",
        type: "single-select",
        text: "How many episodes of vomiting occurred since the last record?",
        options: [
          { value: "none", label: "None" },
          { value: "1-2", label: "1-2 times" },
          { value: "3-4", label: "3-4 times" },
          { value: "5-6", label: "5-6 times" },
          { value: "6+", label: "6+ times" }
        ],
        required: true
      },
      {
        id: "vomit_color",
        type: "color-chart",
        text: "What was the colour of the vomit?",
        colorOptions: [
          { value: "white", label: "White", hex: "#FFFFFF" },
          { value: "foamy", label: "Foamy", hex: "#F5F5F5" },
          { value: "green", label: "Green", hex: "#008000" },
          { value: "yellow", label: "Yellow", hex: "#FFFF00" },
          { value: "orange", label: "Orange", hex: "#FFA500" },
          { value: "pink", label: "Pink", hex: "#FFC0CB" },
          { value: "red", label: "Red", hex: "#FF0000" },
          { value: "bloody", label: "Bloody", hex: "#8B0000" },
          { value: "brown", label: "Brown", hex: "#8B4513" },
          { value: "black", label: "Black", hex: "#000000" }
        ],
        conditional: {
          dependsOn: "vomiting_episodes",
          showIf: (value) => value !== "none"
        },
        required: false
      }
    ]
  },
  {
    id: "SN009",
    title: "Hot flashes",
    icon: "heat",
    questions: [
      {
        id: "hot_flash_frequency",
        type: "single-select",
        text: "How many times have you experienced hot flashes since the last record?",
        options: [
          { value: "none", label: "None" },
          { value: "1-2", label: "1-2 times" },
          { value: "3-4", label: "3-4 times" },
          { value: "5-6", label: "5-6 times" },
          { value: "6+", label: "6+ times" }
        ],
        required: true
      },
      {
        id: "hot_flash_intensity",
        type: "rating",
        text: "How intense are your hot flashes? Rate it on a scale of one to five.",
        options: [
          { value: 1, label: "Very mild" },
          { value: 2, label: "Mild" },
          { value: 3, label: "Moderate" },
          { value: 4, label: "Bad" },
          { value: 5, label: "Very bad" }
        ],
        required: true
      },
      {
        id: "hot_flash_duration",
        type: "slider",
        text: "How long do they last?",
        sliderConfig: {
          min: 0,
          max: 30,
          step: 1,
          unit: " minutes"
        },
        conditional: {
          dependsOn: "hot_flash_frequency",
          showIf: (value) => ["3-4", "5-6", "6+"].includes(value)
        },
        required: false
      },
      {
        id: "hot_flash_symptoms",
        type: "multi-select",
        text: "Do they come with the following symptoms? (Choose all that apply)",
        options: [
          { value: "palpitations", label: "Palpitations (Rapid heartbeat)" },
          { value: "sweating", label: "Sweating" },
          { value: "nausea", label: "Nausea" },
          { value: "dizziness", label: "Dizziness" },
          { value: "anxiety", label: "Anxiety" },
          { value: "headache", label: "Headache" },
          { value: "weakness", label: "Weakness" },
          { value: "suffocation", label: "Feeling of suffocation" },
          { value: "chills", label: "Followed by chills" }
        ],
        conditional: {
          dependsOn: "hot_flash_frequency",
          showIf: (value) => ["3-4", "5-6", "6+"].includes(value)
        },
        required: false
      }
    ]
  },
  {
    id: "SN010",
    title: "Vaginal condition",
    icon: "female",
    questions: [
      {
        id: "vaginal_discharge",
        type: "single-select",
        text: "Did you notice any vaginal discharge since the last record?",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "dry", label: "No and it feels dry" }
        ],
        required: true
      },
      {
        id: "vaginal_discomfort",
        type: "rating",
        text: "How would you describe your vaginal discomfort? Rate it on a scale of one to five.",
        options: [
          { value: 0, label: "None" },
          { value: 1, label: "Very mild" },
          { value: 2, label: "Mild" },
          { value: 3, label: "Moderate" },
          { value: 4, label: "Bad" },
          { value: 5, label: "Very bad" }
        ],
        required: true
      },
      {
        id: "discharge_color",
        type: "color-chart",
        text: "How would you describe the colour of the discharge(s)?",
        colorOptions: [
          { value: "clear", label: "Clear", hex: "#FFFFFF" },
          { value: "white", label: "White", hex: "#F5F5F5" },
          { value: "opaque", label: "Opaque in Colour", hex: "#D3D3D3" },
          { value: "yellowish", label: "Yellowish", hex: "#FFFFE0" },
          { value: "cottage_cheese", label: "Cottage-cheese like", hex: "#F0E68C" },
          { value: "bloody", label: "Bloody", hex: "#FF0000" }
        ],
        conditional: {
          dependsOn: "vaginal_discharge",
          showIf: (value) => ["yes", "dry"].includes(value)
        },
        required: false
      }
    ]
  },
  {
    id: "SN011",
    title: "Headaches",
    icon: "sentiment_stressed",
    questions: [
      {
        id: "headache_frequency",
        type: "single-select",
        text: "How many headaches did you experience since the last record?",
        options: [
          { value: "none", label: "None" },
          { value: "1-2", label: "1-2 times" },
          { value: "3-4", label: "3-4 times" },
          { value: "5-6", label: "5-6 times" },
          { value: "6+", label: "6+ times" }
        ],
        required: true
      },
      {
        id: "headache_severity",
        type: "rating",
        text: "How would you rate your headaches? Rate it on a scale of one to five.",
        options: [
          { value: 1, label: "Very mild" },
          { value: 2, label: "Mild" },
          { value: 3, label: "Moderate" },
          { value: 4, label: "Bad" },
          { value: 5, label: "Very bad" }
        ],
        required: true
      },
      {
        id: "headache_location",
        type: "body-diagram",
        text: "Where were your headaches located?",
        bodyRegions: [
          { value: "right_head", label: "Right side of head", style: { top: "20%", left: "70%" } },
          { value: "left_head", label: "Left side of head", style: { top: "20%", left: "30%" } },
          { value: "back_head", label: "Back of head", style: { top: "25%", left: "50%" } },
          { value: "neck", label: "Neck", style: { top: "35%", left: "50%" } },
          { value: "behind_eyes", label: "Behind eyes", style: { top: "30%", left: "50%" } },
          { value: "temple", label: "Temple", style: { top: "25%", left: "40%" } },
          { value: "forehead", label: "Forehead", style: { top: "15%", left: "50%" } },
          { value: "top_head", label: "Top of head", style: { top: "10%", left: "50%" } }
        ],
        conditional: {
          dependsOn: "headache_frequency",
          showIf: (value) => ["3-4", "5-6", "6+"].includes(value)
        },
        required: false
      }
    ]
  },
  {
    id: "SN012",
    title: "Joint pain",
    icon: "rheumatology",
    questions: [
      {
        id: "joint_pain_areas",
        type: "body-diagram",
        text: "Please choose all the areas where you have experienced joint pain since the last record.",
        bodyRegions: [
          { value: "left_shoulder", label: "Left shoulder girdle", style: { top: "25%", left: "20%" } },
          { value: "right_shoulder", label: "Right shoulder girdle", style: { top: "25%", left: "80%" } },
          { value: "left_elbow", label: "Left elbow", style: { top: "40%", left: "25%" } },
          { value: "right_elbow", label: "Right elbow", style: { top: "40%", left: "75%" } },
          { value: "left_wrist", label: "Left wrist", style: { top: "55%", left: "30%" } },
          { value: "right_wrist", label: "Right wrist", style: { top: "55%", left: "70%" } },
          { value: "left_fingers", label: "Fingers on left hand", style: { top: "60%", left: "25%" } },
          { value: "right_fingers", label: "Fingers on right hand", style: { top: "60%", left: "75%" } },
          { value: "upper_back", label: "Upper back", style: { top: "30%", left: "50%" } },
          { value: "lower_back", label: "Lower back", style: { top: "45%", left: "50%" } },
          { value: "left_hip", label: "Left hip", style: { top: "60%", left: "35%" } },
          { value: "right_hip", label: "Right hip", style: { top: "60%", left: "65%" } },
          { value: "left_knee", label: "Left knee", style: { top: "75%", left: "40%" } },
          { value: "right_knee", label: "Right knee", style: { top: "75%", left: "60%" } },
          { value: "left_ankle", label: "Left ankle", style: { top: "85%", left: "35%" } },
          { value: "right_ankle", label: "Right ankle", style: { top: "85%", left: "65%" } },
          { value: "left_toes", label: "Toes on left foot", style: { top: "90%", left: "30%" } },
          { value: "right_toes", label: "Toes on right foot", style: { top: "90%", left: "70%" } }
        ],
        required: true
      }
    ]
  },
  {
    id: "SN013",
    title: "Musculoskeletal pain",
    icon: "accessibility_new",
    questions: [
      {
        id: "muscle_pain_areas",
        type: "body-diagram",
        text: "Please choose all the areas where you have experienced muscle pain since the last record.",
        bodyRegions: [
          { value: "left_shoulder", label: "Left shoulder", style: { top: "25%", left: "20%" } },
          { value: "right_shoulder", label: "Right shoulder", style: { top: "25%", left: "80%" } },
          { value: "left_upper_arm", label: "Left upper arm", style: { top: "35%", left: "25%" } },
          { value: "right_upper_arm", label: "Right upper arm", style: { top: "35%", left: "75%" } },
          { value: "left_lower_arm", label: "Left lower arm", style: { top: "45%", left: "30%" } },
          { value: "right_lower_arm", label: "Right lower arm", style: { top: "45%", left: "70%" } },
          { value: "left_buttock", label: "Left buttock", style: { top: "55%", left: "35%" } },
          { value: "right_buttock", label: "Right buttock", style: { top: "55%", left: "65%" } },
          { value: "left_upper_leg", label: "Left upper leg", style: { top: "65%", left: "40%" } },
          { value: "right_upper_leg", label: "Right upper leg", style: { top: "65%", left: "60%" } },
          { value: "left_lower_leg", label: "Left lower leg", style: { top: "80%", left: "35%" } },
          { value: "right_lower_leg", label: "Right lower leg", style: { top: "80%", left: "65%" } },
          { value: "left_jaw", label: "Left jaw", style: { top: "20%", left: "30%" } },
          { value: "right_jaw", label: "Right jaw", style: { top: "20%", left: "70%" } },
          { value: "left_chest_male", label: "Left chest (male)", style: { top: "30%", left: "40%" } },
          { value: "right_chest_male", label: "Right chest (male)", style: { top: "30%", left: "60%" } },
          { value: "left_breast_female", label: "Left breast (female)", style: { top: "30%", left: "40%" } },
          { value: "right_breast_female", label: "Right breast (female)", style: { top: "30%", left: "60%" } },
          { value: "abdomen", label: "Abdomen", style: { top: "40%", left: "50%" } },
          { value: "upper_back", label: "Upper back", style: { top: "30%", left: "50%" } },
          { value: "lower_back", label: "Lower back", style: { top: "45%", left: "50%" } },
          { value: "neck", label: "Neck", style: { top: "25%", left: "50%" } }
        ],
        required: true
      }
    ]
  }
];

// Helper functions for conditional logic
export const conditionalLogic = {
  // Check if a question should be shown based on dependencies
  shouldShowQuestion: (question, answers) => {
    if (!question.conditional) return true;
    
    const dependentValue = answers[question.conditional.dependsOn];
    return question.conditional.showIf(dependentValue);
  },

  // Get all visible questions for a section
  getVisibleQuestions: (section, answers) => {
    return section.questions.filter(question => 
      conditionalLogic.shouldShowQuestion(question, answers)
    );
  },

  // Calculate progress — monotonically increasing (counts answered out of total)
  calculateProgress: (sections, answers) => {
    let totalQuestions = 0;
    let answered = 0;

    sections.forEach(section => {
      totalQuestions += section.questions.length;
      section.questions.forEach(question => {
        const val = answers[question.id];
        if (val !== undefined && val !== null && val !== "" &&
            !(Array.isArray(val) && val.length === 0)) {
          answered++;
        }
      });
    });

    return totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0;
  },

  // Get unanswered required visible questions for a section (for validation)
  getUnansweredRequired: (section, answers) => {
    const visible = conditionalLogic.getVisibleQuestions(section, answers);
    return visible.filter(q => {
      if (!q.required) return false;
      const val = answers[q.id];
      return val === undefined || val === null || val === "" ||
             (Array.isArray(val) && val.length === 0);
    }).map(q => q.id);
  }
};
