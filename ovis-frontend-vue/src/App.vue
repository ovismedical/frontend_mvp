<template>
  <div id="app">
    <router-view /> <!-- This renders your page-level components like MainPage, AdminLogin, etc. -->
  </div>
</template>

<script setup>
// No script needed unless you're adding global logic or layout elements
</script>

<style>
/* Import Design System */
@import './assets/design-system.css';

/* Global Reset & Base Styles */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  box-sizing: border-box;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  overflow-y: auto; /* Allow vertical scrolling */
  font-family: var(--font-roboto);
  background-color: var(--background-50);
  color: var(--text-800);
  line-height: 1.6;
}

#app {
  height: 100%;
  min-height: 100vh;
  font-family: var(--font-roboto);
}

*, *::before, *::after {
  box-sizing: inherit;
  font-family: inherit;
}

/* Base Typography */
h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-family: var(--font-space-grotesk);
}

h1 {
  font-size: var(--font-size-28);
  font-weight: 400;
  line-height: 1.57;
  letter-spacing: -0.0025em;
}

h2 {
  font-size: var(--font-size-22);
  font-weight: 400;
  line-height: 1.64;
  letter-spacing: 0;
}

h3 {
  font-size: var(--font-size-20);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;
}

h4 {
  font-size: var(--font-size-17);
  font-weight: 500;
  line-height: 1.53;
  letter-spacing: 0;
}

p {
  margin: 0;
  font-family: var(--font-roboto);
  font-size: var(--font-size-15);
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0;
}

/* Mobile-First Responsive Breakpoints */
@media (max-width: 767px) {
  /* Mobile styles are default */
  .dashboard {
    flex-direction: column !important;
  }
  
  .sidebar {
    position: fixed !important;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}

/* Desktop Layout Fix */
@media (min-width: 768px) {
  .dashboard {
    flex-direction: row !important;
  }
  
  .sidebar {
    position: static !important;
    transform: none !important;
    transition: none !important;
  }
}

@media (min-width: 768px) {
  /* Tablet styles */
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  /* Desktop styles */
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  /* Large desktop styles */
  .container {
    max-width: 1280px;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles for accessibility */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--lavender-500);
  outline-offset: 2px;
}

/* Ensure touch targets are at least 44px for mobile */
@media (max-width: 767px) {
  button, 
  a, 
  input[type="button"], 
  input[type="submit"] {
    min-height: 44px;
    min-width: 44px;
  }
}
</style>
