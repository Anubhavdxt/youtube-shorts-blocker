# Synaptimo Focus - Product Roadmap

> Building tools for mindful productivity, one feature at a time.

---

## Current Version: v2.0.1 (Free)

### ✅ Available Features
- Instant YouTube Shorts blocking
- Beautiful branded overlay
- Automatic redirect to homepage
- Privacy-first (zero tracking)
- Open source transparency

---

## Phase 1: Foundation (v2.1.0) - FREE UPDATE
**Timeline:** 2 weeks
**Goal:** Prepare infrastructure for Pro features

### Features
- [ ] **Local Analytics Collection**
  - Track Shorts blocked count
  - Store data in chrome.storage.local
  - Calculate time saved estimates
  - Track blocking streak

- [ ] **Settings Panel**
  - Extension popup with basic settings
  - Toggle extension on/off
  - View basic stats (for all users)
  - Link to upgrade

- [ ] **Enhanced Configuration**
  - Customizable countdown duration
  - Configurable redirect URL
  - Debug mode toggle

**Why Free?** Build trust, gather feedback, test infrastructure

---

## Phase 2: Pro MVP (v3.0.0) - PRO LAUNCH 🚀
**Timeline:** 3-4 weeks
**Goal:** Launch monetization with compelling Pro features

### Free Features (Always Free)
- ✅ Block YouTube Shorts
- ✅ Basic statistics (Shorts blocked today)
- ✅ Beautiful overlay
- ✅ Privacy-first

### Pro Features ($4.99/month or $29.99/year)

#### 1. **Personal Analytics Dashboard** 💎
- Detailed statistics:
  - Total Shorts blocked (all-time)
  - Time saved (estimated)
  - Daily/Weekly/Monthly trends
  - Longest streak
  - Peak distraction times
- Beautiful charts and visualizations
- Export data as CSV
- **All data stored locally - never leaves your device**

#### 2. **Advanced Blocking** 🛡️
- Remove YouTube Shorts shelf from homepage
- Hide Shorts section in subscriptions
- Remove Shorts from search results
- Block Shorts in recommendations
- Optional: Hide recommended videos sidebar
- Optional: Hide comments section

#### 3. **Custom Settings** ⚙️
- Custom redirect URLs
- Personalized overlay messages
- Countdown customization (0-10 seconds)
- Choose redirect destination (homepage, subscriptions, watch later)

### Payment Integration
- **Platform:** Lemon Squeezy (solo-friendly)
- **Pricing:**
  - Monthly: $4.99/month
  - Yearly: $29.99/year (save 50%)
- **Trial:** 7-day free trial
- **Refund:** 30-day money-back guarantee

---

## Phase 3: Premium Features (v3.1.0+) - PRO EXPANSION
**Timeline:** Ongoing after Pro launch
**Goal:** Add value for Pro subscribers

### Planned Pro Features

#### 1. **Focus Sessions** ⏱️ (v3.1.0)
- Pomodoro-style focus timers
- Set distraction-free work blocks
- Enhanced blocking during sessions
- Session history and analytics
- Break reminders

#### 2. **Whitelist System** ✅ (v3.2.0)
- Allow Shorts from specific channels
- Educational content exceptions
- Custom rules and filters
- Import/export whitelist

#### 3. **Cross-Platform Sync** ☁️ (v3.3.0)
- Sync settings across devices
- Cloud backup of analytics (optional, encrypted)
- Multi-browser support

#### 4. **Productivity Insights** 📊 (v3.4.0)
- AI-powered insights
- Habit analysis
- Personalized recommendations
- Weekly/monthly reports

#### 5. **Schedule-Based Blocking** 📅 (v3.5.0)
- Time-based rules
- Work hours vs. leisure hours
- Weekend exceptions
- Calendar integration

---

## Phase 4: Platform Expansion (v4.0.0+)
**Timeline:** 6+ months
**Goal:** Expand beyond YouTube Shorts

### Potential Features

#### Multi-Platform Support
- Instagram Reels blocker
- TikTok integration (if technically feasible)
- Twitter/X video feed blocker
- Facebook Reels blocker
- Unified dashboard for all platforms

#### Browser Expansion
- Firefox extension
- Safari extension
- Edge (Chromium - already compatible)
- Mobile browser support (limited)

---

## Technical Architecture for Pro Features

### Storage Strategy
```javascript
// Free tier
chrome.storage.local:
- shorts_blocked_today: number
- last_reset_date: timestamp
- extension_enabled: boolean

// Pro tier (all local)
chrome.storage.local:
- shorts_blocked_total: number
- shorts_blocked_by_date: { [date]: count }
- time_saved_minutes: number
- longest_streak: number
- pro_license_key: string
- pro_expiry_date: timestamp
- advanced_blocking_settings: object
- custom_redirect_url: string
- whitelist: string[]
```

### Payment Verification
```javascript
// Lemon Squeezy Integration
1. User purchases on Lemon Squeezy checkout
2. Webhook sends license key to extension
3. Extension validates license key with Lemon Squeezy API
4. Store encrypted license in chrome.storage.local
5. Periodic validation (daily) to prevent abuse
```

### Feature Gates
```javascript
// src/shared/pro.js
export class ProManager {
  static async isPro() {
    // Check license validity
  }

  static async showUpgradePrompt() {
    // Beautiful modal encouraging upgrade
  }

  static lockFeature(featureName) {
    // Blur + upgrade overlay
  }
}
```

---

## Pricing Strategy

### Free Tier
- **Price:** $0
- **Target:** Everyone, maximum reach
- **Features:** Core blocking functionality
- **Goal:** Build user base, establish trust

### Pro Tier
- **Price:** $4.99/month or $29.99/year
- **Target:** Power users, professionals, students
- **Features:** Analytics, advanced blocking, customization
- **Goal:** Sustainable revenue for development

### Why This Pricing?
- **Competitive:** Similar extensions charge $5-10/month
- **Affordable:** Accessible for students
- **Sustainable:** Covers hosting, development, support
- **Fair:** Free tier remains powerful

---

## Success Metrics

### Phase 2 (Pro Launch) Goals
- 1,000 free users in first month
- 5% conversion to Pro (50 paid users)
- 4.5+ star rating
- <2% refund rate

### Phase 3 (Expansion) Goals
- 10,000 free users
- 500 Pro subscribers
- $2,500 MRR
- Feature requests from community

---

## Open Source Strategy

### What Stays Open Source?
- ✅ Core blocking logic
- ✅ Free tier features
- ✅ UI components
- ✅ Architecture and patterns

### What's Closed Source?
- ❌ Payment integration code
- ❌ License validation logic
- ❌ Pro feature implementations
- ❌ API keys and secrets

**Why?** Prevent piracy while maintaining transparency

---

## Community & Feedback

### Feedback Channels
- GitHub Issues (feature requests)
- Discord community (planned)
- Email support
- In-app feedback form (Pro)

### Beta Testing
- Pro features beta for early adopters
- Feedback loop before public launch
- Iterative improvement based on usage data

---

## Legal & Compliance

### Privacy Policy Updates
- Update for Pro analytics collection
- Clarify local-only storage
- Payment processor privacy policy link

### Terms of Service
- Subscription terms
- Refund policy
- License restrictions
- Fair use policy

---

## Marketing & Launch Strategy

### Pre-Launch (2 weeks before Pro)
- Announce Pro features to existing users
- Blog post on Synaptimo.com
- Product Hunt preparation
- Early bird discount (50% off first month)

### Launch Day
- Product Hunt launch
- Reddit posts (r/productivity, r/chrome_extensions)
- HackerNews "Show HN"
- Twitter/X announcement
- Email to free users

### Post-Launch
- Monitor feedback closely
- Rapid iteration on reported issues
- Feature tutorials and documentation
- User testimonials and case studies

---

## Risk Mitigation

### Technical Risks
- **Payment integration complexity** → Use battle-tested Lemon Squeezy
- **License piracy** → Server-side validation, reasonable pricing
- **Performance issues** → Thorough testing, progressive enhancement

### Business Risks
- **Low conversion rate** → Strong free tier, compelling Pro features
- **Refund abuse** → Clear expectations, excellent support
- **Competition** → Focus on quality, design, privacy

---

## Long-Term Vision

### Year 1: Establish Product
- Launch Pro successfully
- Build sustainable revenue
- Grow to 50,000+ users
- Achieve profitability

### Year 2: Expand Suite
- Launch Synaptimo Focus Mobile (companion app)
- Add platform integrations
- Build Synaptimo brand portfolio
- Consider team expansion

### Year 3: Platform
- Synaptimo Suite (multiple focus tools)
- Enterprise/team plans
- API for third-party integrations
- Become go-to brand for digital wellness

---

**Last Updated:** October 6, 2025
**Maintained By:** Anubhav (@Anubhavdxt)

---

*This roadmap is subject to change based on user feedback and technical constraints.*
