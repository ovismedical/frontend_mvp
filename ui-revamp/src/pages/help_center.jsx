import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuickStartGuideCard from "../components/ui/quickStartGuideCard";
import FAQItem from "../components/ui/faq";
import VersionCard from "../components/ui/versionCard";

const HelpCenter = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchTerm("");
    }
  };

  const quickStartGuides = [
    {
      icon: "stars_2",
      subtext: "Getting started with",
      title: "Daily Check-in",
    },
    {
      icon: "analytics",
      subtext: "Learn about",
      title: "Analytics Dashboard",
    },
    {
      icon: "settings",
      subtext: "Configure your",
      title: "Account Settings",
    },
    {
      icon: "notifications",
      subtext: "Set up",
      title: "Notifications",
    },
    {
      icon: "help",
      subtext: "Get help with",
      title: "Troubleshooting",
    },
  ];

  const faqs = [
    {
      question: "How often should I complete my daily check-in?",
      answer:
        "We recommend checking in once a day, ideally at the same time each day for consistency.",
    },
    {
      question: "What happens to my health data?",
      answer:
        "Your health data is stored securely and used only in accordance with our privacy policy.",
    },
    {
      question: "How is my privacy protected?",
      answer:
        "We take your privacy seriously and implement strict measures to protect your data.",
    },
    {
      question: "What should I do if I encounter a bug?",
      answer:
        "If you encounter a bug, please report it to our support team with as much detail as possible.",
    },
  ];

  const colorVariants = ["blue", "secondary", "lavender"];

  const versionCards = [
    {
      version: "V2.1.0",
      title: "Enhanced Search Features",
      description:
        "Improved search functionality with better filters and faster results.",
      date: "JAN 15, 2025",
    },
    {
      version: "V2.0.0",
      title: "UI Revamp",
      description: "A fresh new look and improved navigation experience.",
      date: "DEC 10, 2024",
    },
    {
      version: "V1.9.5",
      title: "Performance Improvements",
      description: "Faster load times and smoother transitions.",
      date: "NOV 01, 2024",
    },
  ];

  // --- Search Filtering Logic ---
  const lowerSearch = searchTerm.toLowerCase();

  const filteredQuickStartGuides = quickStartGuides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(lowerSearch) ||
      guide.subtext.toLowerCase().includes(lowerSearch)
  );

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(lowerSearch) ||
      faq.answer.toLowerCase().includes(lowerSearch)
  );

  const filteredVersionCards = versionCards.filter(
    (card) =>
      card.title.toLowerCase().includes(lowerSearch) ||
      card.description.toLowerCase().includes(lowerSearch) ||
      card.version.toLowerCase().includes(lowerSearch)
  );

  // Check if all filtered arrays are empty
  const noResults =
    isSearchVisible &&
    searchTerm &&
    filteredQuickStartGuides.length === 0 &&
    filteredFaqs.length === 0 &&
    filteredVersionCards.length === 0;

  return (
    <div className="help-center-container">
      <div className="help-center-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>
        <div className="help-center-header h4">Help Center</div>
        <span
          className="material-symbols-rounded search"
          onClick={toggleSearch}
          style={{ cursor: "pointer" }}
        >
          search
        </span>
      </div>

      {isSearchVisible && (
        <div className="help-center-search-input-container">
          <input
            className="body"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      )}

      <div className="help-center-content">
        <div className="help-center-system-status">
          <span className="material-symbols-rounded check_circle">
            check_circle
          </span>
          <div className="system-status-text">
            <p className="system-status-title body">All systems operational</p>
            <p className="system-status-subtitle caption">
              Last updated: 2 minutes ago
            </p>
          </div>
        </div>

        {noResults ? (
          <div className="help-center-no-results">
            <p className="h4">No results found for "{searchTerm}".</p>
          </div>
        ) : (
          <>
            {/* Quick Start Guide */}
            {(isSearchVisible ? filteredQuickStartGuides : quickStartGuides)
              .length > 0 && (
              <section className="quick-start-guide">
                <h2 className="help-center-section-title h4">
                  Quick Start Guide
                </h2>
                <div className="quick-start-guide-container">
                  {(isSearchVisible
                    ? filteredQuickStartGuides
                    : quickStartGuides
                  ).map((guide, index) => (
                    <QuickStartGuideCard
                      key={index}
                      icon={guide.icon}
                      subtext={guide.subtext}
                      title={guide.title}
                      variant={colorVariants[index % colorVariants.length]}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Frequently Asked Questions */}
            {(isSearchVisible ? filteredFaqs : faqs).length > 0 && (
              <section className="faq-section">
                <h2 className="help-center-section-title h4">
                  Frequently Asked Questions
                </h2>
                <div className="faq-items">
                  {(isSearchVisible ? filteredFaqs : faqs).map((faq, index) => (
                    <FAQItem
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Report & Feedback Section */}
            <section className="report-feedback-section">
              <h2 className="report-feedback-title body">Report & Feedback</h2>
              <p className="report-feedback-description caption">
                Help us improve by reporting bugs or sharing feedback
              </p>
              <div className="report-feedback-button">
                <button className="report-feedback-button bug caption">
                  <span className="material-symbols-rounded report">
                    report
                  </span>
                  Report bug
                </button>
                <button className="report-feedback-button feedback caption">
                  <span className="material-symbols-rounded lightbulb">
                    lightbulb
                  </span>
                  Send Feedback
                </button>
              </div>
            </section>

            {/* What's New / Version History */}
            {(isSearchVisible ? filteredVersionCards : versionCards).length >
              0 && (
              <section className="version-history-section">
                <h2 className="help-center-section-title h4">What’s New</h2>
                <div className="version-history-cards">
                  {(isSearchVisible ? filteredVersionCards : versionCards).map(
                    (card, idx) => (
                      <VersionCard
                        key={idx}
                        version={card.version}
                        title={card.title}
                        description={card.description}
                        date={card.date}
                      />
                    )
                  )}
                </div>
              </section>
            )}
          </>
        )}

        {/* Still Need Help Section */}
        <section className="still-need-help-section">
          <h3 className="still-need-help-title body">Still Need Help?</h3>
          <p className="still-need-help-description caption">
            Our support team is here to assist you with any questions or issues.
          </p>
          <div className="still-need-help-button">
            <button className="still-need-help-button mail caption">
              <span className="material-symbols-rounded mail">mail</span>
              Email Us
            </button>
            <button className="still-need-help-button call caption">
              <span className="material-symbols-rounded call">call</span>
              Call Support
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter;
