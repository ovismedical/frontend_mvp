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
          { value: "others_specify", label: "Other – please specify" }
        ],
        conditional: {
          dependsOn: "appetite_rating",
          showIf: (value) => value >= 4
        },
        required: false
      },
      {
        id: "appetite_causes_other_text",
        type: "text",
        text: "Please specify:",
        placeholder: "Describe the cause...",
        conditional: {
          dependsOn: "appetite_causes",
          showIf: (value) => Array.isArray(value) && value.includes("others_specify")
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
          { value: "liquid", label: "Liquid consistency with no solid pieces", hex: "#F5DEB3" },
          { value: "others_specify", label: "Other – please specify", hex: null, isOther: true }
        ],
        conditional: {
          dependsOn: "bowel_frequency",
          showIf: (value) => ["3-4", "5-6", "6+"].includes(value)
        },
        required: false
      },
      {
        id: "stool_appearance_other_text",
        type: "text",
        text: "Please specify:",
        placeholder: "Describe the appearance...",
        conditional: {
          dependsOn: "stool_appearance",
          showIf: (value) => Array.isArray(value) && value.includes("others_specify")
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
    icon: "pulmonology",
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
          { value: "others_specify", label: "Other – please specify" }
        ],
        conditional: {
          dependsOn: "dyspnea_frequency",
          showIf: (value) => ["3-4", "5-6", "6+"].includes(value)
        },
        required: false
      },
      {
        id: "dyspnea_activities_other_text",
        type: "text",
        text: "Please specify:",
        placeholder: "Describe the activity...",
        conditional: {
          dependsOn: "dyspnea_activities",
          showIf: (value) => Array.isArray(value) && value.includes("others_specify")
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
          { value: "others_specify", label: "Other – please specify" }
        ],
        conditional: {
          dependsOn: "dysuria_frequency",
          showIf: (value) => ["3-4", "5-6", "6+"].includes(value)
        },
        required: false
      },
      {
        id: "dysuria_location_other_text",
        type: "text",
        text: "Please specify:",
        placeholder: "Describe the location...",
        conditional: {
          dependsOn: "dysuria_location",
          showIf: (value) => Array.isArray(value) && value.includes("others_specify")
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
          min: 0.5,
          max: 9.5,
          step: 0.5,
          unit: " hours",
          minLabel: "Less than 1 hour",
          maxLabel: "More than 9 hours"
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
          { value: "not_applicable", label: "Not applicable" },
          { value: "muscle_pain", label: "Muscle pain" },
          { value: "joint_pain", label: "Joint pain" },
          { value: "sore_throat", label: "Sore throat" },
          { value: "headaches", label: "Headaches" },
          { value: "anxiety", label: "Feeling anxious and/or depressed" },
          { value: "memory", label: "Memory or concentration problems" },
          { value: "exhausted", label: "Exhausted by everyday tasks" },
          { value: "others_specify", label: "Other – please specify" }
        ],
        exclusiveOptions: ["not_applicable"],
        conditional: {
          dependsOn: "sleep_quality",
          showIf: (value) => value >= 4
        },
        required: false
      },
      {
        id: "sleep_symptoms_other_text",
        type: "text",
        text: "Please specify:",
        placeholder: "Describe your symptom...",
        conditional: {
          dependsOn: "sleep_symptoms",
          showIf: (value) => Array.isArray(value) && value.includes("others_specify")
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
          max: 15,
          step: 1,
          unit: " minutes",
          maxLabel: "15+ min"
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
          { value: "not_applicable", label: "Not applicable" },
          { value: "palpitations", label: "Palpitations (Rapid heartbeat)" },
          { value: "sweating", label: "Sweating" },
          { value: "nausea", label: "Nausea" },
          { value: "dizziness", label: "Dizziness" },
          { value: "anxiety", label: "Anxiety" },
          { value: "headache", label: "Headache" },
          { value: "weakness", label: "Weakness" },
          { value: "suffocation", label: "Feeling of suffocation" },
          { value: "chills", label: "Followed by chills" },
          { value: "others_specify", label: "Other – please specify" }
        ],
        exclusiveOptions: ["not_applicable"],
        conditional: {
          dependsOn: "hot_flash_frequency",
          showIf: (value) => ["3-4", "5-6", "6+"].includes(value)
        },
        required: false
      },
      {
        id: "hot_flash_symptoms_other_text",
        type: "text",
        text: "Please specify:",
        placeholder: "Describe your symptom...",
        conditional: {
          dependsOn: "hot_flash_symptoms",
          showIf: (value) => Array.isArray(value) && value.includes("others_specify")
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
          { value: "left_temple", label: "Left temple", style: { top: "25%", left: "30%" } },
          { value: "right_temple", label: "Right temple", style: { top: "25%", left: "70%" } },
          { value: "behind_eyes", label: "Between eyes", style: { top: "30%", left: "50%" } },
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
        type: "joint-diagram",
        text: "Please choose all the areas where you have experienced joint pain since the last record.",
        bodyRegions: [
          // Front view
          { value: "left_shoulder",  label: "Left shoulder girdle",   side: "front" },
          { value: "right_shoulder", label: "Right shoulder girdle",  side: "front" },
          { value: "left_elbow",     label: "Left elbow",             side: "front" },
          { value: "right_elbow",    label: "Right elbow",            side: "front" },
          { value: "left_wrist",     label: "Left wrist",             side: "front" },
          { value: "right_wrist",    label: "Right wrist",            side: "front" },
          { value: "left_fingers",   label: "Fingers on left hand",   side: "front" },
          { value: "right_fingers",  label: "Fingers on right hand",  side: "front" },
          { value: "left_hip",       label: "Left hip",               side: "front" },
          { value: "right_hip",      label: "Right hip",              side: "front" },
          { value: "left_knee",      label: "Left knee",              side: "front" },
          { value: "right_knee",     label: "Right knee",             side: "front" },
          { value: "left_ankle",     label: "Left ankle",             side: "front" },
          { value: "right_ankle",    label: "Right ankle",            side: "front" },
          { value: "left_toes",      label: "Toes on left foot",      side: "front" },
          { value: "right_toes",     label: "Toes on right foot",     side: "front" },
          // Back view
          { value: "upper_back",     label: "Upper back",             side: "back" },
          { value: "lower_back",     label: "Lower back",             side: "back" }
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
        type: "muscle-diagram",
        text: "Please choose all the areas where you have experienced muscle pain since the last record.",
        bodyRegions: [
          // Front view
          { value: "left_jaw",        label: "Left jaw",          side: "front" },
          { value: "right_jaw",       label: "Right jaw",         side: "front" },
          { value: "left_neck",       label: "Left neck",         side: "front" },
          { value: "right_neck",      label: "Right neck",        side: "front" },
          { value: "left_chest",      label: "Left chest",        side: "front" },
          { value: "right_chest",     label: "Right chest",       side: "front" },
          { value: "left_abdomen",    label: "Left abdomen",      side: "front" },
          { value: "right_abdomen",   label: "Right abdomen",     side: "front" },
          { value: "left_shoulder",   label: "Left shoulder",     side: "front" },
          { value: "right_shoulder",  label: "Right shoulder",    side: "front" },
          { value: "left_bicep",      label: "Left bicep",        side: "front" },
          { value: "right_bicep",     label: "Right bicep",       side: "front" },
          { value: "left_lower_arm",  label: "Left forearm",      side: "front" },
          { value: "right_lower_arm", label: "Right forearm",     side: "front" },
          { value: "left_hand",       label: "Left hand",         side: "front" },
          { value: "right_hand",      label: "Right hand",        side: "front" },
          { value: "left_oblique",    label: "Left oblique",      side: "front" },
          { value: "right_oblique",   label: "Right oblique",     side: "front" },
          { value: "left_adductor",   label: "Left adductor",     side: "front" },
          { value: "right_adductor",  label: "Right adductor",    side: "front" },
          { value: "left_quadriceps", label: "Left quadriceps",   side: "front" },
          { value: "right_quadriceps",label: "Right quadriceps",  side: "front" },
          { value: "left_lower_leg",  label: "Left lower leg",    side: "front" },
          { value: "right_lower_leg", label: "Right lower leg",   side: "front" },
          { value: "left_foot",       label: "Left foot",         side: "front" },
          { value: "right_foot",      label: "Right foot",        side: "front" },
          // Back view
          { value: "left_trapezius",  label: "Left trapezius",    side: "back" },
          { value: "right_trapezius", label: "Right trapezius",   side: "back" },
          { value: "left_upper_back", label: "Left upper back",   side: "back" },
          { value: "right_upper_back",label: "Right upper back",  side: "back" },
          { value: "left_lower_back", label: "Left lower back",   side: "back" },
          { value: "right_lower_back",label: "Right lower back",  side: "back" },
          { value: "left_buttock",    label: "Left buttock",      side: "back" },
          { value: "right_buttock",   label: "Right buttock",     side: "back" },
          { value: "left_tricep",     label: "Left tricep",       side: "back" },
          { value: "right_tricep",    label: "Right tricep",      side: "back" },
          { value: "left_hamstrings", label: "Left hamstrings",   side: "back" },
          { value: "right_hamstrings",label: "Right hamstrings",  side: "back" },
          { value: "left_calf",       label: "Left calf",         side: "back" },
          { value: "right_calf",      label: "Right calf",        side: "back" }
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
