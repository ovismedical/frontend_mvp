// Dynamic symptom utilities to replace hardcoded mappings

export const getSymptomIcon = (symptomName) => {
  if (!symptomName) return 'health_and_safety';
  
  const symptom = symptomName.toLowerCase();
  
  // Physical symptoms
  if (symptom.includes('fatigue') || symptom.includes('tired') || symptom.includes('exhausted')) {
    return 'battery_alert';
  }
  if (symptom.includes('headache') || symptom.includes('head pain')) {
    return 'favorite';
  }
  if (symptom.includes('nausea') || symptom.includes('sick') || symptom.includes('vomit')) {
    return 'sick';
  }
  if (symptom.includes('pain') || symptom.includes('ache') || symptom.includes('hurt')) {
    return 'favorite';
  }
  if (symptom.includes('sleep') || symptom.includes('insomnia') || symptom.includes('restless')) {
    return 'bedtime';
  }
  if (symptom.includes('appetite') || symptom.includes('hunger') || symptom.includes('eating')) {
    return 'restaurant';
  }
  if (symptom.includes('energy') || symptom.includes('weak') || symptom.includes('lethargic')) {
    return 'battery_alert';
  }
  if (symptom.includes('breath') || symptom.includes('cough') || symptom.includes('respiratory')) {
    return 'air';
  }
  if (symptom.includes('digest') || symptom.includes('stomach') || symptom.includes('bowel')) {
    return 'restaurant';
  }
  if (symptom.includes('skin') || symptom.includes('rash') || symptom.includes('itch')) {
    return 'healing';
  }
  
  // Mental/emotional symptoms
  if (symptom.includes('mood') || symptom.includes('emotion') || symptom.includes('feeling')) {
    return 'mood';
  }
  if (symptom.includes('anxiety') || symptom.includes('worry') || symptom.includes('nervous')) {
    return 'psychology';
  }
  if (symptom.includes('depression') || symptom.includes('sad') || symptom.includes('down')) {
    return 'sentiment_dissatisfied';
  }
  if (symptom.includes('stress') || symptom.includes('pressure') || symptom.includes('overwhelmed')) {
    return 'psychology';
  }
  if (symptom.includes('memory') || symptom.includes('concentration') || symptom.includes('focus')) {
    return 'psychology';
  }
  
  // Treatment-related symptoms
  if (symptom.includes('side effect') || symptom.includes('reaction') || symptom.includes('adverse')) {
    return 'warning';
  }
  if (symptom.includes('treatment') || symptom.includes('therapy') || symptom.includes('medication')) {
    return 'medication';
  }
  
  // Default fallback
  return 'health_and_safety';
};

export const getSeverityIntensity = (severity) => {
  if (!severity) return 5;
  
  const severityLower = severity.toLowerCase();
  
  // Handle various severity descriptions
  if (severityLower.includes('mild') || severityLower.includes('slight') || severityLower.includes('low')) {
    return 3;
  }
  if (severityLower.includes('moderate') || severityLower.includes('medium') || severityLower.includes('fair')) {
    return 5;
  }
  if (severityLower.includes('severe') || severityLower.includes('intense') || severityLower.includes('high')) {
    return 8;
  }
  if (severityLower.includes('extreme') || severityLower.includes('critical') || severityLower.includes('unbearable')) {
    return 10;
  }
  
  // Handle numeric values
  if (typeof severity === 'number') {
    return Math.min(Math.max(severity, 1), 10);
  }
  
  // Handle "X/10" format
  if (typeof severity === 'string' && severity.includes('/')) {
    const match = severity.match(/(\d+)\/10/);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  // Default moderate intensity
  return 5;
};

export const getTrendFromIntensity = (intensity) => {
  if (intensity <= 3) return 'down';
  if (intensity <= 6) return 'stable';
  return 'up';
};

export const formatSymptomName = (name) => {
  if (!name) return 'Unknown Symptom';
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getInsightTypeFromSeverity = (severity) => {
  const intensity = getSeverityIntensity(severity);
  if (intensity <= 3) return 'success';
  if (intensity <= 6) return 'info';
  if (intensity <= 8) return 'warning';
  return 'error';
};
