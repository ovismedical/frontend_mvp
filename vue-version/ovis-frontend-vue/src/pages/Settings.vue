<template>
  <div :class="styles.settings">
    <aside :class="styles.sidebar">
      <Sidebar />
    </aside>

    <main :class="styles.mainContent">
      <!-- Modern Header -->
      <header :class="styles.topHeader">
        <div :class="styles.headerContent">
          <h1 :class="styles.pageTitle">Settings</h1>
          <p :class="styles.pageSubtitle">Manage your account preferences and privacy settings</p>
        </div>
        <div :class="styles.devNote">Under Development</div>
      </header>

      <!-- Content Grid -->
      <section :class="styles.contentGrid">
        <!-- Account Settings -->
        <div :class="[styles.card, styles.accountCard]">
          <div :class="styles.cardIcon">👤</div>
          <h3>Account Settings</h3>
          <p>Manage your personal information and account details.</p>
          <div :class="styles.settingsList">
            <div :class="styles.settingItem">
              <div :class="styles.settingInfo">
                <strong>Profile Information</strong>
                <small>Update your name, email, and contact details</small>
              </div>
              <button :class="styles.settingBtn">Edit</button>
            </div>
            <div :class="styles.settingItem">
              <div :class="styles.settingInfo">
                <strong>Password & Security</strong>
                <small>Change your password and security preferences</small>
              </div>
              <button :class="styles.settingBtn">Change</button>
            </div>
            <div :class="styles.settingItem">
              <div :class="styles.settingInfo">
                <strong>Healthcare Provider</strong>
                <small>Update your doctor and hospital information</small>
              </div>
              <button :class="styles.settingBtn">Update</button>
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div :class="[styles.card, styles.privacyCard]">
          <div :class="styles.cardIcon">🔒</div>
          <h3>Privacy & Data</h3>
          <p>Control how your health data is used and shared.</p>
          <div :class="styles.toggleList">
            <div :class="styles.toggleItem">
              <div :class="styles.toggleInfo">
                <strong>Data Sharing with Provider</strong>
                <small>Allow your healthcare provider to access your wellness data</small>
              </div>
              <div :class="[styles.toggle, styles.enabled]">
                <div :class="styles.toggleSwitch"></div>
              </div>
            </div>
            <div :class="styles.toggleItem">
              <div :class="styles.toggleInfo">
                <strong>Anonymous Analytics</strong>
                <small>Help improve Ovis by sharing anonymized usage data</small>
              </div>
              <div :class="[styles.toggle, styles.enabled]">
                <div :class="styles.toggleSwitch"></div>
              </div>
            </div>
            <div :class="styles.toggleItem">
              <div :class="styles.toggleInfo">
                <strong>Marketing Communications</strong>
                <small>Receive emails about new features and health tips</small>
              </div>
              <div :class="styles.toggle">
                <div :class="styles.toggleSwitch"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div :class="[styles.card, styles.notificationCard]">
          <div :class="styles.cardIcon">🔔</div>
          <h3>Notifications</h3>
          <p>Choose when and how you want to receive reminders.</p>
          <div :class="styles.notificationList">
            <div :class="styles.notificationItem">
              <strong>Daily Check-in Reminders</strong>
              <select :class="styles.notificationSelect">
                <option>9:00 AM</option>
                <option>12:00 PM</option>
                <option>6:00 PM</option>
                <option>Off</option>
              </select>
            </div>
            <div :class="styles.notificationItem">
              <strong>Wellness Score Updates</strong>
              <select :class="styles.notificationSelect">
                <option>Weekly</option>
                <option>Daily</option>
                <option>Off</option>
              </select>
            </div>
            <div :class="styles.notificationItem">
              <strong>Doctor Messages</strong>
              <select :class="styles.notificationSelect">
                <option>Immediately</option>
                <option>Daily Summary</option>
                <option>Off</option>
              </select>
            </div>
          </div>
        </div>

        <!-- App Preferences -->
        <div :class="[styles.card, styles.preferencesCard]">
          <div :class="styles.cardIcon">⚙️</div>
          <h3>App Preferences</h3>
          <p>Customize your Ovis experience and interface.</p>
          <div :class="styles.preferencesList">
            <div :class="styles.preferenceItem">
              <strong>Theme</strong>
              <select :class="styles.preferenceSelect">
                <option>Light Mode</option>
                <option>Dark Mode</option>
                <option>Auto</option>
              </select>
            </div>
            <div :class="styles.preferenceItem">
              <strong>Language</strong>
              <select :class="styles.preferenceSelect">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div :class="styles.preferenceItem">
              <strong>Time Format</strong>
              <select :class="styles.preferenceSelect">
                <option>12 Hour</option>
                <option>24 Hour</option>
              </select>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import styles from './Settings.module.css'
</script> 