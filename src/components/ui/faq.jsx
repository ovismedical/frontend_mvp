import React, { useState } from "react";
import "../../styles/components/faq.css";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAQ = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container">
      <div className="questionContainer" onClick={toggleFAQ}>
        <span className="question body">{question}</span>
        <span className="icon">{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && <p className="answer body">{answer}</p>}
    </div>
  );
};

export default FAQItem;
