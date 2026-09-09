import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import QuickStartGuideCard from "../../components/ui/quickStartGuideCard";
import FAQItem from "../../components/ui/faq";
import VersionCard from "../../components/ui/versionCard";
import BackButton from "../../components/ui/backButton";
const HelpCenter = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === 'zh' ? 'zh' : 'en';

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Helper function to get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    return textObj[currentLang] || textObj.en;
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchTerm("");
    }
  };

  // Backend Handling: Fetch help center quick start guides, FAQs, and version history from backend
  const quickStartGuides = [
    {
      icon: "stars_2",
      subtext: {
        en: "Getting started with",
        zh: "開始使用"
      },
      title: {
        en: "Daily Check-in",
        zh: "每日打卡"
      },
    },
    {
      icon: "analytics",
      subtext: {
        en: "Learn about",
        zh: "了解"
      },
      title: {
        en: "Analytics Dashboard",
        zh: "分析儀表板"
      },
    },
    {
      icon: "settings",
      subtext: {
        en: "Configure your",
        zh: "配置您的"
      },
      title: {
        en: "Account Settings",
        zh: "帳戶設置"
      },
    },
    {
      icon: "notifications",
      subtext: {
        en: "Set up",
        zh: "設置"
      },
      title: {
        en: "Notifications",
        zh: "通知"
      },
    },
    {
      icon: "help",
      subtext: {
        en: "Get help with",
        zh: "獲得幫助"
      },
      title: {
        en: "Troubleshooting",
        zh: "故障排除"
      },
    },
  ];

  // Backend Handling: Fetch FAQs from backend
  const faqs = [
    {
      question: {
        en: "How often should I complete my daily check-in?",
        zh: "我應該多久完成一次每日打卡？"
      },
      answer: {
        en: "We recommend checking in once a day, ideally at the same time each day for consistency.",
        zh: "我們建議每天打卡一次，最好每天在同一時間進行以保持一致性。"
      },
    },
    {
      question: {
        en: "What happens to my health data?",
        zh: "我的健康數據會怎樣？"
      },
      answer: {
        en: "Your health data is stored securely and used only in accordance with our privacy policy.",
        zh: "您的健康數據會安全存儲，僅按照我們的隱私政策使用。"
      },
    },
    {
      question: {
        en: "How is my privacy protected?",
        zh: "我的隱私如何受到保護？"
      },
      answer: {
        en: "We take your privacy seriously and implement strict measures to protect your data.",
        zh: "我們認真對待您的隱私，並實施嚴格措施保護您的數據。"
      },
    },
    {
      question: {
        en: "What should I do if I encounter a bug?",
        zh: "如果我遇到錯誤該怎麼辦？"
      },
      answer: {
        en: "If you encounter a bug, please report it to our support team with as much detail as possible.",
        zh: "如果您遇到錯誤，請盡可能詳細地向我們的支援團隊報告。"
      },
    },
  ];

  const colorVariants = ["blue", "secondary", "lavender"];

  // Backend Handling: Fetch version history from backend
  const versionCards = [
    {
      version: "V2.1.0",
      title: {
        en: "Enhanced Search Features",
        zh: "增強搜索功能"
      },
      description: {
        en: "Improved search functionality with better filters and faster results.",
        zh: "改進的搜索功能，具有更好的過濾器和更快的結果。"
      },
      date: {
        en: "JAN 15, 2025",
        zh: "2025年1月15日"
      },
    },
    {
      version: "V2.0.0",
      title: {
        en: "UI Revamp",
        zh: "界面改版"
      },
      description: {
        en: "A fresh new look and improved navigation experience.",
        zh: "全新外觀和改進的導航體驗。"
      },
      date: {
        en: "DEC 10, 2024",
        zh: "2024年12月10日"
      },
    },
    {
      version: "V1.9.5",
      title: {
        en: "Performance Improvements",
        zh: "性能改進"
      },
      description: {
        en: "Faster load times and smoother transitions.",
        zh: "更快的加載時間和更流暢的過渡。"
      },
      date: {
        en: "NOV 01, 2024",
        zh: "2024年11月1日"
      },
    },
  ];

  // --- Search Filtering Logic ---
  const lowerSearch = searchTerm.toLowerCase();

  const filteredQuickStartGuides = quickStartGuides.filter(
    (guide) =>
      getLocalizedText(guide.title).toLowerCase().includes(lowerSearch) ||
      getLocalizedText(guide.subtext).toLowerCase().includes(lowerSearch)
  );

  const filteredFaqs = faqs.filter(
    (faq) =>
      getLocalizedText(faq.question).toLowerCase().includes(lowerSearch) ||
      getLocalizedText(faq.answer).toLowerCase().includes(lowerSearch)
  );

  const filteredVersionCards = versionCards.filter(
    (card) =>
      getLocalizedText(card.title).toLowerCase().includes(lowerSearch) ||
      getLocalizedText(card.description).toLowerCase().includes(lowerSearch) ||
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
        <BackButton className="chevron_backward" onClick={() => navigate(-1)} />
        <div className="help-center-header h4">{t("help_center")}</div>
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
            placeholder={t("search")}
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
            <p className="system-status-title body">{t("all_systems_operational")}</p>
            <p className="system-status-subtitle caption">
              {t("last_updated")}
            </p>
          </div>
        </div>

        {noResults ? (
          <div className="help-center-no-results">
            <p className="h4">{t("no_results_found")} "{searchTerm}".</p>
          </div>
        ) : (
          <>
            {/* Quick Start Guide */}
            {(isSearchVisible ? filteredQuickStartGuides : quickStartGuides)
              .length > 0 && (
              <section className="quick-start-guide">
                <h2 className="help-center-section-title h4">
                  {t("quick_start_guide")}
                </h2>
                <div className="quick-start-guide-container">
                  {(isSearchVisible
                    ? filteredQuickStartGuides
                    : quickStartGuides
                  ).map((guide, index) => (
                    <QuickStartGuideCard
                      key={index}
                      icon={guide.icon}
                      subtext={getLocalizedText(guide.subtext)}
                      title={getLocalizedText(guide.title)}
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
                  {t("frequently_asked_questions")}
                </h2>
                <div className="faq-items">
                  {(isSearchVisible ? filteredFaqs : faqs).map((faq, index) => (
                    <FAQItem
                      key={index}
                      question={getLocalizedText(faq.question)}
                      answer={getLocalizedText(faq.answer)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Report & Feedback Section */}
            <section className="report-feedback-section">
              {/* Backend Handling: Push reported bug or feedback to backend */}
              <h2 className="report-feedback-title body">{t("report_feedback")}</h2>
              <p className="report-feedback-description caption">
                {t("report_feedback_description")}
              </p>
              <div className="report-feedback-button">
                <button className="report-feedback-button bug caption">
                  <span className="material-symbols-rounded report">
                    report
                  </span>
                  {t("report_bug")}
                </button>
                <button className="report-feedback-button feedback caption">
                  <span className="material-symbols-rounded lightbulb">
                    lightbulb
                  </span>
                  {t("send_feedback")}
                </button>
              </div>
            </section>

            {/* What's New / Version History */}
            {(isSearchVisible ? filteredVersionCards : versionCards).length >
              0 && (
              <section className="version-history-section">
                <h2 className="help-center-section-title h4">{t("whats_new")}</h2>
                <div className="version-history-cards">
                  {(isSearchVisible ? filteredVersionCards : versionCards).map(
                    (card, idx) => (
                      <VersionCard
                        key={idx}
                        version={card.version}
                        title={getLocalizedText(card.title)}
                        description={getLocalizedText(card.description)}
                        date={getLocalizedText(card.date)}
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
          <h3 className="still-need-help-title body">{t("still_need_help")}</h3>
          <p className="still-need-help-description caption">
            {t("still_need_help_description")}
          </p>
          <div className="still-need-help-button">
            {/* Backend Handling: Push contact request (email/call) to backend */}
            <button className="still-need-help-button mail caption">
              <span className="material-symbols-rounded mail">mail</span>
              {t("email_us")}
            </button>
            <button className="still-need-help-button call caption">
              <span className="material-symbols-rounded call">call</span>
              {t("call_support")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter;
