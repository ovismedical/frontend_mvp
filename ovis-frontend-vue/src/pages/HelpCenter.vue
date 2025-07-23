<template>
  <div :class="styles.helpCenter">
    <aside :class="styles.sidebar">
      <Sidebar />
    </aside>

    <main :class="styles.mainContent">
      <!-- Modern Header -->
      <header :class="styles.topHeader">
        <div :class="styles.headerContent">
          <h1 :class="styles.pageTitle">Help Center</h1>
          <p :class="styles.pageSubtitle">Get answers to your questions and learn how to use Ovis</p>
        </div>
        <div :class="styles.devNote">Under Development</div>
      </header>

      <!-- Content Grid -->
      <section :class="styles.contentGrid">
        <!-- FAQ Section -->
        <div :class="[styles.card, styles.faqCard]">
          <div :class="styles.cardIcon">❓</div>
          <h3>Frequently Asked Questions</h3>
          <p>Common questions and answers about using the Ovis platform for your daily health monitoring.</p>
          <div :class="styles.faqList">
            <div :class="styles.faqItem">
              <strong>How often should I complete the daily check-in?</strong>
              <p>We recommend completing your check-in once daily, preferably at the same time each day.</p>
            </div>
            <div :class="styles.faqItem">
              <strong>What happens to my health data?</strong>
              <p>Your data is securely stored and only shared with your healthcare provider with your consent.</p>
            </div>
            <div :class="styles.faqItem">
              <strong>Can I view my progress over time?</strong>
              <p>Yes, your dashboard shows your wellness trends and streak progress.</p>
            </div>
          </div>
        </div>

        <!-- Contact Support -->
        <div :class="[styles.card, styles.supportCard]">
          <div :class="styles.cardIcon">💬</div>
          <h3>Contact Support</h3>
          <p>Need additional help? Our support team is here to assist you.</p>
          <div :class="styles.contactOptions">
            <div :class="styles.contactItem">
              <i class="fas fa-envelope"></i>
              <span>support@ovis-health.com</span>
            </div>
            <div :class="styles.contactItem">
              <i class="fas fa-phone"></i>
              <span>1-800-OVIS-HELP</span>
            </div>
            <div :class="styles.contactItem">
              <i class="fas fa-clock"></i>
              <span>Mon-Fri 9AM-5PM EST</span>
            </div>
          </div>
        </div>

        <!-- Quick Guides -->
        <div :class="[styles.card, styles.guidesCard]">
          <div :class="styles.cardIcon">📖</div>
          <h3>Quick Start Guides</h3>
          <p>Step-by-step guides to help you get the most out of Ovis.</p>
          <div :class="styles.guidesList">
            <div :class="styles.guideItem">
              <i class="fas fa-play-circle"></i>
              <span>Getting Started with Daily Check-ins</span>
            </div>
            <div :class="styles.guideItem">
              <i class="fas fa-chart-line"></i>
              <span>Understanding Your Wellness Score</span>
            </div>
            <div :class="styles.guideItem">
              <i class="fas fa-user-md"></i>
              <span>Connecting with Your Healthcare Provider</span>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div :class="[styles.card, styles.statusCard]">
          <div :class="styles.cardIcon">🟢</div>
          <h3>System Status</h3>
          <p>Current status of Ovis platform services.</p>
          <div :class="styles.statusList">
            <div :class="styles.statusItem">
              <span :class="styles.statusDot"></span>
              <span>All systems operational</span>
            </div>
            <div :class="styles.statusItem">
              <span :class="[styles.statusDot, styles.warning]"></span>
              <span>Help Center features in development</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import styles from './HelpCenter.module.css'
</script> 