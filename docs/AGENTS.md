# CLAUDE.md — NestBridge Frontend

## Project overview
NestBridge is a culturally intelligent pairing platform connecting international
students, host families, local guides, and tourists. This is the React Native /
Expo mobile frontend (iOS + Android).

Group 21 — CodeQuest 2026.

## Tech stack
- React Native + Expo (SDK 51+)
- JavaScript (not TypeScript)
- React Navigation v6 (stack + bottom tabs)
- Firebase Realtime Database (chat/messaging only)
- Expo SecureStore (JWT storage)
- Axios (HTTP client)
- React Native Async Storage (offline content caching)

## Project structure
src/

screens/          # One file per screen

auth/           # Splash, Welcome, RoleSelect, Register, Login

onboarding/     # Destination, Quiz, ProfileSetup, Ready

student/        # MatchSearch, MatchResults, HostProfile, Booking, BookingConfirmed

host/           # HostWelcome, PropertyDetails, Amenities, PhotoUpload,

# AvailabilityCalendar, KYCPrompt, ListingLive, HostDashboard,

# MatchRequestReview, CheckInConfirm

guide/          # GuideWelcome, ServicesProfile, GuideBio, WeeklySchedule,

# SocialVerify, KYCPrompt, GuideDashboard, SessionReview

tourist/        # TripSetup, TouristProfile, ExploreHome, GuideProfileDetail,

# SessionBooking, TouristSiteDetail

shared/         # Chat, SOS, WelfareCheckIn, ReviewPrompt

components/       # Reusable UI components

MatchCard.js

TrustBadge.js

CompatibilityBar.js

SOSButton.js

StarRating.js

ProfileAvatar.js

navigation/

AppNavigator.js       # Root navigator

AuthNavigator.js      # Pre-auth stack

StudentNavigator.js

HostNavigator.js

GuideNavigator.js

TouristNavigator.js

SharedTabNavigator.js # Bottom tab bar (shared across roles)

services/

api.js          # Axios instance + all API call functions

auth.js         # Login, register, token management

firebase.js     # Firebase init + chat helpers

storage.js      # SecureStore wrappers

context/

AuthContext.js  # Current user, role, JWT

BookingContext.js

constants/

colors.js       # Brand palette

api.js          # BASE_URL and endpoint paths

utils/

formatting.js   # Currency, date, distance formatting

## Environment setup
Create a `.env` file in the project root:
API_BASE_URL=http://localhost:8080

FIREBASE_API_KEY=

FIREBASE_AUTH_DOMAIN=

FIREBASE_DATABASE_URL=

FIREBASE_PROJECT_ID=
Use `expo-constants` or `react-native-dotenv` to access these. Never hardcode
URLs or keys inline.

## API communication
All backend calls go through `src/services/api.js`. This file exports an Axios
instance with:
- `baseURL` from env
- Request interceptor that attaches the JWT from SecureStore as
  `Authorization: Bearer <token>`
- Response interceptor that catches 401 and clears auth state

Never call `fetch()` or create a second Axios instance elsewhere. All API
functions live in `api.js` and are imported by screens.

## Authentication flow
1. On app launch, check SecureStore for a JWT.
2. If present and valid, navigate to the role-appropriate home screen.
3. If absent or expired, navigate to Welcome screen.
4. After login/register, store JWT in SecureStore (never AsyncStorage).
5. Role is stored alongside the JWT and used to determine which navigator to
   mount.

## Navigation structure
- Unauthenticated: AuthNavigator (Splash → Welcome → RoleSelect → Register/Login)
- Authenticated, role = STUDENT: StudentNavigator inside SharedTabNavigator
- Authenticated, role = HOST: HostNavigator inside SharedTabNavigator
- Authenticated, role = GUIDE: GuideNavigator inside SharedTabNavigator
- Authenticated, role = TOURIST: TouristNavigator inside SharedTabNavigator

SharedTabNavigator tab bar items (all roles):
- Home (role-specific dashboard)
- Discover / Find
- Messages (Chat list)
- Welfare (check-ins + SOS shortcut)
- Profile

SOS button: floating shield icon visible on every screen via a wrapper
component in AppNavigator. Navigates to shared SOS screen. Never hidden.

## Role-specific onboarding
After RoleSelect + Register, route to the correct onboarding flow:
- STUDENT: Destination → Quiz (5 screens, one question each) → ProfileSetup → Ready
- HOST: HostWelcome → PropertyDetails → Amenities → PhotoUpload →
  AvailabilityCalendar → KYCPrompt
- GUIDE: GuideWelcome → ServicesProfile → GuideBio → WeeklySchedule →
  SocialVerify (optional) → KYCPrompt
- TOURIST: TripSetup → TouristProfile → ExploreHome

Onboarding state is held in component state or context and submitted as a
single API call at the end of each flow. Do not call the API after each
individual step.

## Firebase chat
- Firebase is used exclusively for real-time messaging. Nothing else.
- On match acceptance, the backend provisions a conversation node and returns
  the conversation ID.
- The frontend opens a Firebase listener on
  `/conversations/{conversationId}/messages`.
- Messages are written directly to Firebase by the sender.
- The backend also persists messages for audit and translation — do not
  replicate this logic in the frontend.
- Auto-translate: show a globe icon on messages where detected language differs
  from the user's preferred language. On tap, call the backend translation
  endpoint and replace the message text in local state.

## Screens — key UX rules
These rules apply across all screens and must not be overridden:

- **One action per screen during onboarding.** Never put two decisions on one
  onboarding screen.
- **Pre-fill from context.** If the user already gave us destination and dates
  during onboarding, those fields arrive pre-filled on the search screen.
- **Never block progress with a hard gate during demo flows.** KYC screens
  always have a "Verify later" option. Photo upload always has a "Skip for now"
  option with a nudge message.
- **SOS is always accessible.** The SOS floating button must never be hidden,
  covered, or removed by any screen.
- **Sealed reviews.** On the review prompt screen, show a brief explanation of
  the sealed mechanism before the user writes their review.
- **Match results must show:** compatibility percentage, trust badge, and at
  least 2 plain-English match reasons. These are not optional UI elements.
- **Booking screen must show:** full price breakdown (nightly rate + platform
  fee + total) and cancellation policy before the pay CTA.

## Seed / demo data
For the demo, the backend will be seeded with 8 host profiles and 3 guide
profiles. Do not mock API calls in the frontend — always hit the real backend.
If the backend is unreachable, show a clear error state, not placeholder data.

## Styling
- No third-party UI library. Use StyleSheet.create() for all styles.
- Brand colours are defined in `src/constants/colors.js`. Import from there.
- Do not hardcode hex values inline in component files.
- Font: System default (San Francisco on iOS, Roboto on Android). Do not load
  custom fonts for the MVP.
- All touchable elements must have a minimum touch target of 44×44pt.

## Error handling
- All API calls must have try/catch.
- Network errors show a user-facing message ("Something went wrong. Please
  check your connection."), never a raw error object.
- Form validation happens inline (on blur or on submit), never via alert().
- Loading states: every screen that fetches data must show an ActivityIndicator
  while loading. Never show an empty screen.

## What is not built in this sprint
Do not build or stub these — they are out of scope:
- Email/SMS notifications (backend handles scheduling; frontend just receives
  push via Expo Notifications)
- Admin dashboard (separate web app, not this project)
- Full KYC document upload flow (show the UI, submit a mock flag to backend)
- Video library playback
- Community Hub
- Scholarship portal

## Running the project
```bash
npx expo start
# Scan QR with Expo Go on physical device
# Press 'i' for iOS simulator, 'a' for Android emulator
```

## Key commands
```bash
npx expo install           # Install Expo-compatible package versions
npx expo doctor            # Check for dependency issues
```
