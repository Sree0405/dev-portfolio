import React, { useState } from 'react';
import { Home, Users, Database, Shield, Settings, Image, Code, Lock, Cloud, Layers, FileText, Zap, Bell, BarChart2, RefreshCw, PlusCircle } from 'lucide-react';

// Image Placeholder Component
const ImagePlaceholder = ({ label, img = "", onClick, css = "" }) => {
  const hasImage = Boolean(img);

  return (
    <div
      onClick={onClick}
      className={`w-full border-2 border-purple-500/30 rounded-lg cursor-pointer 
      hover:border-purple-400/50 transition-all bg-gradient-to-br from-purple-900/20 to-blue-900/20
      ${hasImage ? "p-3" : "h-64 flex items-center justify-center"}
      `}
    >
      {hasImage ? (
        <div className="flex flex-col gap-4">
          <div className={` ${css} w-full min-h-[350px] !max-h-[40px] rounded-md overflow-hidden`}>
            <img src={img} alt={label} className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-300">{label}</p>
            <p className="text-xs text-gray-500 mt-1">Click to view details</p>
          </div>
        </div>
      ) : (
        <div className="text-center group">
          <div className="text-purple-400 mb-2">
            <Image className="w-12 h-12 mx-auto opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-gray-400 group-hover:text-gray-300">{label}</p>
          <p className="text-xs text-gray-600 mt-1">Click to view details</p>
        </div>
      )}
    </div>
  );
};

// Modal Component
const DetailModal = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-purple-500/30 rounded-lg max-w-2xl w-full p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-purple-400 mb-4">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
        <button onClick={onClose} className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

// 1. Introduction / Overview Section
const IntroductionSection = () => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Home className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">What is Finance Tracker?</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 text-lg leading-relaxed mb-4">
        Personal Finance & Renewal Tracker is a mobile-first application designed to help users take full control of their financial
        obligations. Built with React Native and Expo, it provides a comprehensive solution for managing subscriptions, bills,
        insurance renewals, and recurring expenses — all in one place.
      </p>
      <p className="text-gray-300 text-lg leading-relaxed mb-4">
        Unlike generic budgeting apps, this tracker focuses specifically on renewal cycles and deadline awareness. It combines
        smart reminders, detailed analytics, secure local storage, and a guided multi-step entry flow to ensure users never miss
        a payment or renewal date again.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-purple-400 mb-2">Renewal-First</h4>
          <p className="text-sm text-gray-400">Built around recurring cycles — subscriptions, insurance, rent, and bills.</p>
        </div>
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-purple-400 mb-2">Smart Reminders</h4>
          <p className="text-sm text-gray-400">Automated alerts at 30, 7, 3, and 1 day before every due date.</p>
        </div>
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-purple-400 mb-2">Offline-First</h4>
          <p className="text-sm text-gray-400">Works entirely on-device with optional cloud sync. No internet required.</p>
        </div>
      </div>
    </div>
  </section>
);

// 2. Problem Statement / Vision Section
const ProblemSection = () => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Zap className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Problem Statement & Vision</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <h3 className="text-xl font-semibold text-purple-400 mb-4">The Financial Tracking Gap</h3>
      <p className="text-gray-300 leading-relaxed mb-6">
        Most people manage dozens of recurring financial obligations — monthly subscriptions, annual insurance renewals,
        quarterly bills, and rent cycles. Without a dedicated system, these deadlines live scattered across emails, paper
        documents, and memory. The result: missed renewals, unexpected charges, and unnecessary late fees.
      </p>

      <h3 className="text-xl font-semibold text-purple-400 mb-4">Core Problems Solved</h3>
      <ul className="space-y-3 text-gray-300">
        <li className="flex items-start gap-3">
          <span className="text-purple-400 mt-1">•</span>
          <span><strong>Missed Payments:</strong> No centralized system to track upcoming due dates leads to forgotten renewals and avoidable penalties.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-purple-400 mt-1">•</span>
          <span><strong>Manual Reminders:</strong> Calendar reminders are static and require manual setup for every renewal — unsustainable at scale.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-purple-400 mt-1">•</span>
          <span><strong>Scattered Records:</strong> Bills, receipts, and renewal documents exist in different apps, folders, and inboxes with no unified view.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-purple-400 mt-1">•</span>
          <span><strong>Lack of Insight:</strong> Without analytics, users cannot identify spending patterns or anticipate high-expense months in advance.</span>
        </li>
      </ul>
    </div>
  </section>
);

// 3. Core Features Section
const CoreFeaturesSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Layers className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Core Features</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        The app is built around a focused set of high-impact features that address every stage of personal financial management —
        from creating a record to exporting a monthly report.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ImagePlaceholder
          label="Renewal Management System"
          onClick={() => onImageClick('Renewal Management', 'Full lifecycle management for recurring payments. Users define a renewal record once — with category, amount, and cycle — and the system automatically calculates next due dates. Supports monthly, quarterly, semi-annual, and annual cycles. Visual status cards show urgency with color-coded indicators.')}
        />
        <ImagePlaceholder
          label="Expense & Payment Logging"
          onClick={() => onImageClick('Expense Tracking', 'Log actual payments against renewal records. Each expense entry captures: amount paid, payment method (Cash, GPay, UPI, Card), date, and an optional receipt attachment. Total monthly expenses are aggregated and displayed in both the Dashboard and Analytics sections.')}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Feature Summary</h4>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>✓ Renewal & subscription management with automatic cycle tracking</li>
          <li>✓ Smart reminders at configurable intervals (30, 7, 3, 1 day before)</li>
          <li>✓ Expense logging with payment method and receipt attachment</li>
          <li>✓ Analytics dashboard with monthly breakdowns and category insights</li>
          <li>✓ PDF export for structured financial reports</li>
          <li>✓ App lock with secure local storage encryption</li>
          <li>✓ Light, Dark, and System-default theme support</li>
        </ul>
      </div>
    </div>
  </section>
);

// 4. App Modules Section
const AppModulesSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Database className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">App Modules</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        The application is organized into eight primary modules, each accessible via the bottom navigation bar.
        Every module is purpose-built to handle a specific dimension of personal finance management.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ImagePlaceholder
          label="Dashboard – Overview Module"
          onClick={() => onImageClick('Dashboard', 'The home screen displays: (1) Current month total expenses card, (2) Upcoming renewals list sorted by urgency with color-coded due dates (red = overdue, orange = within 7 days, green = upcoming), (3) Quick action button to add a new record, (4) Summary of active vs archived records. "See All" links to the full Records view.')}
        />
        <ImagePlaceholder
          label="Records – Renewal Manager"
          onClick={() => onImageClick('Records', 'Paginated card-based list of all renewal records. Each card shows: Title, Category badge (Health, Vehicle, General, Utilities), Amount, Due Date, and Repeat cycle. Swipe left to delete, tap to view/edit full detail. Filter by category or status (active/archived). Search by title keyword.')}
        />
        <ImagePlaceholder
          label="Expenses – Payment Log"
          onClick={() => onImageClick('Expenses', 'Transaction history list with total monthly spend header. Each entry shows: Linked record title, amount paid, payment method icon, and date. Tap to expand for full details including attached receipt. Filter by month, category, or payment method. Delete individual entries or bulk clear.')}
        />
        <ImagePlaceholder
          label="Analytics – Insights Dashboard"
          onClick={() => onImageClick('Analytics', 'Visual breakdown of spending: (1) Monthly total with bar chart comparison across last 6 months, (2) Category distribution with progress bars (Health 35%, Vehicle 20%, etc.), (3) Upcoming vs paid amounts for the current month, (4) Historical data view with month selector. All data pulled from local storage in real time.')}
        />
        <ImagePlaceholder
          label="Settings – App Preferences"
          onClick={() => onImageClick('Settings', 'Grouped settings panel: Appearance (Light / Dark / System Default theme selector with live preview), Security (App Lock toggle — enables biometric or PIN authentication), Notifications (global reminder toggle, default reminder intervals), Data Management (Export to PDF, Clear all data with confirmation dialog).')}
        />
        <ImagePlaceholder
          label="Reminders & Notifications"
          onClick={() => onImageClick('Reminders', 'Notification center listing all scheduled reminders. Each item shows: Record title, reminder type (30-day, 7-day, 3-day, 1-day), and scheduled time. Toggle individual reminders on/off. Notifications use local push via Expo Notifications — no server required. Badge count reflects total pending reminders.')}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Module Navigation</h4>
        <p className="text-gray-300 text-sm mb-3">Bottom tab navigation provides access to all primary modules:</p>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li><span className="text-purple-400">•</span> <strong>Home:</strong> Dashboard overview with quick stats</li>
          <li><span className="text-purple-400">•</span> <strong>Records:</strong> Full renewal and subscription list</li>
          <li><span className="text-purple-400">•</span> <strong>Add:</strong> Centre tab — shortcut to multi-step record creation</li>
          <li><span className="text-purple-400">•</span> <strong>Expenses:</strong> Payment log and transaction history</li>
          <li><span className="text-purple-400">•</span> <strong>Settings:</strong> Theme, security, and data management</li>
        </ul>
      </div>
    </div>
  </section>
);

// 5. Add Record / User Flow Section
const UserFlowSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <PlusCircle className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">User Flow & Add Record</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        The Add Record screen uses a multi-step wizard to guide users through the complete record creation process.
        Each step is focused and validates input before proceeding, reducing errors and ensuring data completeness.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ImagePlaceholder
          label="Step 1 – Basic Info"
          onClick={() => onImageClick('Basic Info Step', 'First step collects: Title (required, e.g. "Netflix Subscription"), Category (Health, Vehicle, General, Utilities, Insurance, Rent — selectable chips), and Amount (numeric keyboard input with currency symbol). Step progress indicator at top shows "1 of 4". Continue button activates after required fields are filled.')}
        />
        <ImagePlaceholder
          label="Step 2 – Dates & Renewal"
          onClick={() => onImageClick('Dates & Renewal Step', 'Second step captures: Due Date (calendar date picker), Repeat Cycle (visual selection: No Repeat / Monthly / Every 3 Months / Every 6 Months / Yearly — displayed as tappable cards), and automatic next-due-date preview. System calculates and displays the next renewal date based on selected cycle.')}
        />
        <ImagePlaceholder
          label="Step 3 – Reminders & Notes"
          onClick={() => onImageClick('Reminders & Notes Step', 'Third step: Reminder toggles for 30-day, 7-day, 3-day, and 1-day notifications (each independently enabled or disabled). Optional Notes field for payment instructions, account numbers, or remarks. Final step shows live preview card of the complete record before saving. Confirm & Save triggers local storage write and notification scheduling.')}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Complete User Journey</h4>
        <ol className="space-y-2 text-gray-300 text-sm list-decimal list-inside">
          <li>User taps the central "+" tab in bottom navigation</li>
          <li>Fills in title, category, and amount in Step 1</li>
          <li>Sets due date and renewal frequency in Step 2</li>
          <li>Configures reminder intervals and adds optional notes in Step 3</li>
          <li>Reviews live preview and confirms save</li>
          <li>Record appears immediately in Dashboard and Records list</li>
          <li>Notifications scheduled automatically for selected reminder intervals</li>
          <li>When payment is made, user logs expense from the record detail view</li>
          <li>Analytics and totals update in real time</li>
          <li>At month-end, user exports PDF report from Settings</li>
        </ol>
      </div>
    </div>
  </section>
);

// 6. Technical Architecture Section
const ArchitectureSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Layers className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Technical Architecture</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        The application follows a lightweight client-centric architecture optimized for mobile. React Native with Expo
        handles the presentation layer, Context API manages global state, and AsyncStorage (with optional Firebase sync)
        provides persistent data storage — all without requiring a dedicated backend server.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ImagePlaceholder
          label="App Architecture Diagram"
          onClick={() => onImageClick('Architecture Overview', 'Three-layer architecture: (1) UI Layer — React Native screens and components styled with StyleSheet/NativeWind, organized by feature module. (2) State Layer — Context API providers (RecordsContext, ExpenseContext, ThemeContext, AuthContext) wrapping the app root. (3) Data Layer — AsyncStorage for local persistence, Expo SecureStore for sensitive data, and optional Firebase Firestore for cloud sync.')}
        />
        <ImagePlaceholder
          label="Data Flow Diagram"
          onClick={() => onImageClick('Data Flow', 'User interaction → Screen component → Context action dispatch → AsyncStorage read/write → State update → UI re-render. Notification flow: Record save → Expo Notifications schedule local push → Device notification at configured intervals. Export flow: Analytics context → PDF generation via react-native-html-to-pdf → Share sheet.')}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Technology Stack</h4>
        <div className="space-y-2 text-gray-300 text-sm">
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">Frontend</span>
            <span>React Native + Expo SDK — cross-platform iOS and Android from a single codebase</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">State</span>
            <span>Context API with useReducer — lightweight global state without Redux overhead</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">Storage</span>
            <span>AsyncStorage for records and expenses; Expo SecureStore for credentials and lock PIN</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">Notifications</span>
            <span>Expo Notifications — fully local, no server required for push scheduling</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">Cloud (optional)</span>
            <span>Firebase Firestore for multi-device sync; Firebase Auth for account management</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// 7. Security Section
const SecuritySection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Shield className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Security & Privacy</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        Financial data is sensitive. The app is designed with a privacy-first, offline-first approach — no user data
        is transmitted to third parties, and sensitive credentials are stored in encrypted device storage only.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ImagePlaceholder
          label="App Lock Screen"
          onClick={() => onImageClick('App Lock', 'When App Lock is enabled in Settings, the app presents a PIN entry or biometric authentication prompt (Face ID / Fingerprint) on every launch or after 5 minutes of inactivity. Powered by Expo LocalAuthentication. PIN is stored in Expo SecureStore — never in plain AsyncStorage. Three failed attempts triggers a 30-second lockout.')}
        />
        <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Privacy Guarantees</h4>
          <div className="grid grid-cols-1 gap-4 text-gray-300 text-sm">
            <div>
              <p className="font-medium text-purple-300 mb-2">Data Storage</p>
              <ul className="space-y-1">
                <li>• All records stored locally on device</li>
                <li>• Expo SecureStore for credentials</li>
                <li>• No analytics or telemetry collected</li>
                <li>• No third-party SDKs with tracking</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-purple-300 mb-2">Access Control</p>
              <ul className="space-y-1">
                <li>• Biometric + PIN authentication</li>
                <li>• Inactivity auto-lock (configurable)</li>
                <li>• Encrypted local storage</li>
                <li>• Optional cloud sync (user-controlled)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// 8. Design System Section
const DesignSystemSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Settings className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Design System</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        The app follows a consistent, card-based design system with a minimal UI philosophy. Every screen prioritizes
        readability and ease of use, with intuitive bottom navigation and a step-based form pattern for data entry.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ImagePlaceholder
          label="Light Mode UI"
          onClick={() => onImageClick('Light Theme', 'Clean white background (#FFFFFF) with soft gray surfaces (#F5F5F5). Purple accent (#7C3AED) for primary actions. Subtle card shadows for depth. Typography: SF Pro (iOS) / Roboto (Android). Status chips use green/orange/red color coding for urgency. All colors meet WCAG AA contrast standards.')}
        />
        <ImagePlaceholder
          label="Dark Mode UI"
          onClick={() => onImageClick('Dark Theme', 'Deep gray background (#121212) with elevated surfaces (#1E1E1E, #2C2C2C). Purple accent unchanged (#7C3AED) — consistent brand identity across themes. Text hierarchy: white (#FFFFFF), muted gray (#9CA3AF), disabled (#6B7280). Card borders use subtle opacity overlays instead of hard lines.')}
        />
        <ImagePlaceholder
          label="Component Library"
          onClick={() => onImageClick('UI Components', 'Reusable component set: RecordCard (title, category badge, amount, due date, repeat icon), ExpenseItem (method icon, amount, date), CategoryChip (colored pill for Health/Vehicle/General), StepIndicator (progress dots), ReminderToggle (labeled switch), AmountInput (currency-prefixed numeric field), StatusBadge (active/archived/overdue).')}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Design Principles</h4>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>✓ Card-based layout — every record and expense lives in a clean, tappable card</li>
          <li>✓ Bottom navigation — thumb-friendly access to all primary modules</li>
          <li>✓ Step-based forms — guided entry reduces cognitive load and input errors</li>
          <li>✓ Color-coded urgency — immediate visual understanding of payment status</li>
          <li>✓ System font usage — native feel on both iOS and Android</li>
          <li>✓ Responsive spacing — dynamic padding adapts to device size and safe areas</li>
        </ul>
      </div>
    </div>
  </section>
);

// 9. Analytics Section
const AnalyticsSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <BarChart2 className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Analytics & Insights</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        The Analytics module transforms stored records and expenses into actionable financial insights. Visual progress
        bars, monthly comparisons, and category breakdowns help users understand spending patterns and plan ahead.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ImagePlaceholder
          label="Monthly Expense Summary"
          onClick={() => onImageClick('Monthly Summary', 'Header card shows current month total spend vs last month with a percentage change indicator (↑12% or ↓8%). Below, a horizontal bar chart compares the last 6 months of total expense. Each bar is tappable — drilling down shows the breakdown of records paid in that month. Months with no activity show a zero bar.')}
        />
        <ImagePlaceholder
          label="Category Breakdown"
          onClick={() => onImageClick('Category Analytics', 'Horizontal progress bars show each category as a percentage of total monthly spending. Example: Health 35% (green bar), Vehicle 22% (blue bar), Utilities 18% (orange bar), General 15% (purple bar), Other 10% (gray bar). Exact amounts shown next to each bar. Filter toggle to switch between current month and all-time totals.')}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Analytics Data Points</h4>
        <div className="space-y-3 text-gray-300 text-sm">
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">Monthly Total</span>
            <span>Aggregate of all expense logs within the current calendar month</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">Category Split</span>
            <span>Per-category spend as percentage and absolute value for selected period</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">Upcoming Load</span>
            <span>Total amount due in the next 30 days across all active records</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">History View</span>
            <span>Month-by-month historical data with month selector for trend analysis</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// 10. Future Enhancements / Blueprint Section
const BlueprintSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Zap className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Future Enhancements</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        The current build establishes a solid offline-first foundation. The roadmap focuses on expanding intelligence,
        connectivity, and platform reach while preserving the app's core simplicity and privacy-first approach.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ImagePlaceholder
          label="Cloud Sync Architecture"
          onClick={() => onImageClick('Cloud Sync', 'Firebase Firestore integration for real-time multi-device sync. Records and expenses sync automatically when connected. Conflict resolution uses last-write-wins with timestamp comparison. Offline changes queued locally and pushed on reconnect. User controls whether sync is enabled — purely opt-in.')}
        />
        <ImagePlaceholder
          label="AI Insights Engine"
          onClick={() => onImageClick('AI Insights', 'Machine learning layer analyzing spending patterns. Features: (1) Anomaly detection — flags unusually high expense months, (2) Subscription audit — identifies inactive subscriptions still being paid, (3) Budget recommendations based on 3-month averages, (4) Renewal prediction — estimates next-year totals based on historical data.')}
        />
        <ImagePlaceholder
          label="Budget Planning Module"
          onClick={() => onImageClick('Budget Planner', 'Monthly budget creation flow: Set budget limit per category. Dashboard shows real-time progress bars (actual vs budget). Overspend alerts trigger notifications when a category exceeds its limit. Annual budget planning view projects full-year costs based on existing renewal cycles.')}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Roadmap</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
          <div>
            <p className="font-semibold text-purple-300 mb-2">Phase 2 (Q3 2025)</p>
            <ul className="space-y-1">
              <li>• Firebase cloud sync (opt-in)</li>
              <li>• Multi-device login support</li>
              <li>• Enhanced PDF reports with charts</li>
              <li>• Recurring expense templates</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-purple-300 mb-2">Phase 3 (Q1 2026)</p>
            <ul className="space-y-1">
              <li>• AI-powered spending insights</li>
              <li>• Monthly budget planning module</li>
              <li>• Web dashboard companion app</li>
              <li>• Multi-language and currency support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// API / Export Examples Section
const ExportExamplesSection = () => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Code className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Data Structures & Export</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-purple-400 mb-3">Record Data Structure</h4>
          <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// AsyncStorage Record Schema
{
  "id": "uuid-v4",
  "title": "Netflix Subscription",
  "category": "General",
  "amount": 649,
  "currency": "INR",
  "dueDate": "2025-08-15",
  "repeatCycle": "monthly",  // none | monthly | quarterly | semi-annual | yearly
  "nextDueDate": "2025-09-15",
  "reminders": {
    "30day": true,
    "7day": true,
    "3day": false,
    "1day": true
  },
  "notes": "Family plan — 4 screens",
  "status": "active",  // active | archived
  "createdAt": "2025-07-01T10:00:00Z",
  "updatedAt": "2025-07-01T10:00:00Z"
}`}
            </pre>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-purple-400 mb-3">Expense Log Structure</h4>
          <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// Expense Entry Schema
{
  "id": "expense-uuid",
  "recordId": "uuid-v4",  // linked renewal record
  "recordTitle": "Netflix Subscription",
  "amount": 649,
  "currency": "INR",
  "paymentMethod": "GPay",  // Cash | GPay | UPI | Card | Bank Transfer
  "paidOn": "2025-08-14T18:30:00Z",
  "receiptUri": "file:///local/path/receipt.jpg",  // optional
  "note": "Paid one day early",
  "createdAt": "2025-08-14T18:30:00Z"
}`}
            </pre>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-purple-400 mb-3">Notification Scheduling</h4>
          <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// Expo Notifications — Schedule local reminder
import * as Notifications from 'expo-notifications';

async function scheduleReminder(record, daysBefore) {
  const triggerDate = new Date(record.dueDate);
  triggerDate.setDate(triggerDate.getDate() - daysBefore);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: \`Upcoming: \${record.title}\`,
      body: \`Due in \${daysBefore} day(s) — ₹\${record.amount}\`,
      data: { recordId: record.id },
    },
    trigger: { date: triggerDate },
  });
}

// Called on record save for each enabled reminder interval
if (record.reminders['30day']) scheduleReminder(record, 30);
if (record.reminders['7day'])  scheduleReminder(record, 7);
if (record.reminders['3day'])  scheduleReminder(record, 3);
if (record.reminders['1day'])  scheduleReminder(record, 1);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Main Component
export default function FinanceTrackerDocumentation() {
  const [modalData, setModalData] = useState({ isOpen: false, title: '', description: '' });

  const handleImageClick = (title, description) => {
    setModalData({ isOpen: true, title, description });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, title: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Finance Tracker
          </h1>
          <p className="text-xl text-gray-400 mb-2">Personal Finance & Renewal Management App</p>
          <p className="text-gray-500">Complete A–Z Platform Documentation</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="px-3 py-1 bg-purple-900/40 border border-purple-500/30 rounded-full text-sm text-purple-300">
              React Native
            </span>
            <span className="px-3 py-1 bg-purple-900/40 border border-purple-500/30 rounded-full text-sm text-purple-300">
              Expo
            </span>
            <span className="px-3 py-1 bg-purple-900/40 border border-purple-500/30 rounded-full text-sm text-purple-300">
              In Development
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-900/50 border border-purple-500/20 rounded-2xl p-10 mb-16">
          <h3 className="text-2xl font-bold text-purple-400 mb-8 tracking-wide">
            Table of Contents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ["intro", "Project Overview"],
              ["problem", "Problem Statement"],
              ["features", "Core Features"],
              ["modules", "App Modules"],
              ["userflow", "User Flow & Add Record"],
              ["architecture", "Technical Architecture"],
              ["security", "Security & Privacy"],
              ["design", "Design System"],
              ["analytics", "Analytics & Insights"],
              ["data", "Data Structures & Export"],
              ["blueprint", "Future Enhancements"],
            ].map(([id, label], index) => (
              <a
                key={id}
                href={`#${id}`}
                className="group flex items-center gap-4 rounded-xl border border-purple-500/10 
                           bg-gray-950/40 px-5 py-4 transition-all
                           hover:border-purple-400/40 hover:bg-purple-900/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full 
                               bg-purple-500/10 text-sm font-semibold text-purple-400
                               group-hover:bg-purple-500/20">
                  {index + 1}
                </div>
                <div className="text-gray-300 group-hover:text-purple-300 transition-colors">
                  {label}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div id="intro"><IntroductionSection /></div>
        <div id="problem"><ProblemSection /></div>
        <div id="features"><CoreFeaturesSection onImageClick={handleImageClick} /></div>
        <div id="modules"><AppModulesSection onImageClick={handleImageClick} /></div>
        <div id="userflow"><UserFlowSection onImageClick={handleImageClick} /></div>
        <div id="architecture"><ArchitectureSection onImageClick={handleImageClick} /></div>
        <div id="security"><SecuritySection onImageClick={handleImageClick} /></div>
        <div id="design"><DesignSystemSection onImageClick={handleImageClick} /></div>
        <div id="analytics"><AnalyticsSection onImageClick={handleImageClick} /></div>
        <div id="data"><ExportExamplesSection /></div>
        <div id="blueprint"><BlueprintSection onImageClick={handleImageClick} /></div>

        {/* Footer */}
        <div className="text-center pt-16 pb-8 border-t border-purple-500/20">
          <p className="text-gray-400 mb-2">Finance Tracker Documentation</p>
          <p className="text-sm text-gray-600">
            Built with React Native, Expo, Context API, AsyncStorage • Version 1.0.0 • 2025 • In Development
          </p>
        </div>
      </div>

      {/* Modal */}
      <DetailModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        title={modalData.title}
        description={modalData.description}
      />
    </div>
  );
}