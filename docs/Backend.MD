Backend CLAUDE.md
markdown# CLAUDE.md — NestBridge Backend

## Project overview
NestBridge is a culturally intelligent pairing platform connecting international
students, host families, local guides, and tourists. This is the Spring Boot
monolithic backend serving the React Native mobile frontend.

Group 21 — CodeQuest 2026.

## Architecture decision
This is a monolith structured as if it were microservices. Each domain has its
own package, service layer, and controller. The database uses a single
PostgreSQL instance with all tables in one schema. This is intentional for the
MVP sprint — do not refactor into actual microservices during this phase.

## Tech stack
- Java 17
- Spring Boot 3.x
- Spring Security + JWT (jjwt library)
- Spring Data JPA + Hibernate
- PostgreSQL 15
- Firebase Admin SDK (server-side: message persistence + conversation
  provisioning only)
- Redis (session blacklist + matching result cache)
- Lombok
- Maven

## Project structure
src/main/java/com/nestbridge/

auth/

AuthController.java

AuthService.java

JwtUtil.java

JwtFilter.java

SecurityConfig.java

user/

UserController.java

UserService.java

UserRepository.java

User.java              # Entity

UserDTO.java

matching/

MatchController.java

MatchService.java

MatchRepository.java

MatchingAlgorithm.java # Core scoring logic — see section below

Match.java

MatchResultDTO.java

booking/

BookingController.java

BookingService.java

BookingRepository.java

Booking.java

BookingDTO.java

host/

HostController.java

HostService.java

HostRepository.java

HostProfile.java

HostProfileDTO.java

guide/

GuideController.java

GuideService.java

GuideRepository.java

GuideProfile.java

GuideProfileDTO.java

welfare/

WelfareController.java

WelfareService.java

WelfareRepository.java

WelfareCheckIn.java

SOSEvent.java

SOSEventDTO.java

messaging/

MessagingController.java

MessagingService.java   # Firebase Admin SDK calls only

Message.java

ConversationDTO.java

common/

ApiResponse.java        # Unified response wrapper

GlobalExceptionHandler.java

Role.java               # Enum: STUDENT, HOST, GUIDE, TOURIST

enums/                  # BookingStatus, MatchStatus, TrustBadge, etc.

src/main/resources/

application.properties

application-dev.properties

db/migration/             # SQL seed files

V1__schema.sql

V2__seed_hosts.sql

V3__seed_guides.sql

## Environment configuration
`src/main/resources/application-dev.properties`:
spring.datasource.url=jdbc:postgresql://localhost:5432/nestbridge

spring.datasource.username=postgres

spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=validate

spring.jpa.show-sql=false
jwt.secret=your_secret_key_min_256_bits

jwt.access-expiry-ms=900000

jwt.refresh-expiry-ms=2592000000
firebase.credentials.path=src/main/resources/firebase-service-account.json
redis.host=localhost

redis.port=6379

Never commit real secrets. Use environment variables or a `.env` file in
production. For the dev sprint, `application-dev.properties` is acceptable
and is gitignored.

## Database schema — core tables
These are the tables you must have. Column names match the entity fields exactly.

```sql
-- Users
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,          -- STUDENT | HOST | GUIDE | TOURIST
  nationality VARCHAR(100),
  languages TEXT[],
  profile_photo_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  trust_score DECIMAL(3,2) DEFAULT 0,
  preferred_language VARCHAR(10) DEFAULT 'en',
  date_of_birth DATE,
  is_minor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Host profiles
CREATE TABLE host_profiles (
  host_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  room_type VARCHAR(50),
  max_guests INT,
  price_per_night DECIMAL(10,2),
  amenities TEXT[],
  house_rules TEXT,
  diet_offered TEXT[],
  religion_friendly TEXT[],
  cancellation_policy VARCHAR(20) DEFAULT 'FLEXIBLE',
  availability_calendar JSONB,
  photos TEXT[],
  accepts_minors BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT FALSE,    -- false until KYC verified
  created_at TIMESTAMP DEFAULT NOW()
);

-- Guide profiles
CREATE TABLE guide_profiles (
  guide_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  city VARCHAR(100),
  country VARCHAR(100),
  service_types TEXT[],
  languages_offered TEXT[],
  price_per_session DECIMAL(10,2),
  session_duration_hours DECIMAL(3,1),
  bio_extended TEXT,
  photos TEXT[],
  availability_schedule JSONB,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Matches
CREATE TABLE matches (
  match_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID REFERENCES users(user_id),
  target_id UUID REFERENCES users(user_id),
  target_type VARCHAR(10),            -- HOST | GUIDE
  compatibility_score DECIMAL(5,2),
  score_breakdown JSONB,
  status VARCHAR(20) DEFAULT 'PENDING',
  initiated_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP
);

-- Bookings
CREATE TABLE bookings (
  booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(match_id),
  guest_id UUID REFERENCES users(user_id),
  host_or_guide_id UUID REFERENCES users(user_id),
  booking_type VARCHAR(10),           -- HOST | GUIDE
  check_in DATE,
  check_out DATE,
  total_price DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  host_payout DECIMAL(10,2),
  payment_status VARCHAR(20) DEFAULT 'PENDING',
  escrow_release_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Welfare check-ins
CREATE TABLE welfare_check_ins (
  checkin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(booking_id),
  user_id UUID REFERENCES users(user_id),
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  responses JSONB,
  flagged BOOLEAN DEFAULT FALSE,
  escalated BOOLEAN DEFAULT FALSE,
  escalation_notes TEXT
);

-- SOS events
CREATE TABLE sos_events (
  sos_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  triggered_at TIMESTAMP DEFAULT NOW(),
  location_lat DECIMAL(9,6),
  location_lng DECIMAL(9,6),
  contacted_emergency BOOLEAN DEFAULT FALSE,
  contacted_support BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  resolution_notes TEXT
);
```

## API endpoints — full list

### Auth — `/api/auth`
POST /api/auth/register        — register new user, return JWT + role

POST /api/auth/login           — authenticate, return JWT + role

POST /api/auth/refresh-token   — exchange refresh token for new access token

POST /api/auth/logout          — blacklist refresh token in Redis

POST /api/auth/verify-identity — submit KYC flag (mock for MVP)

### Users — `/api/users`
GET  /api/users/:id            — get public profile

PUT  /api/users/:id            — update own profile (auth required)

POST /api/users/:id/photo      — upload profile photo URL

GET  /api/users/:id/reviews    — get verified reviews

GET  /api/users/:id/bookings   — get booking history (own only)

### Matching — `/api/matches`
POST /api/matches/find                   — run algorithm, return ranked list

GET  /api/matches/:matchId               — get match details

POST /api/matches/:matchId/accept        — host/guide accepts match

POST /api/matches/:matchId/decline       — host/guide declines match

### Booking — `/api/bookings`
POST /api/bookings                       — create booking request

GET  /api/bookings/:id                   — get booking details

PUT  /api/bookings/:id/confirm           — confirm + mock payment

PUT  /api/bookings/:id/cancel            — cancel (applies policy)

PUT  /api/bookings/:id/checkin-confirm   — host confirms student arrived

### Welfare — `/api/welfare`
POST /api/welfare/sos                              — log SOS event

GET  /api/welfare/checkins/:bookingId              — get check-ins for booking

POST /api/welfare/checkins/:checkInId/respond      — submit check-in responses

GET  /api/welfare/tickets                          — get support tickets

POST /api/welfare/tickets                          — submit support ticket

### Hosts — `/api/hosts`
POST /api/hosts/profile        — create host profile

PUT  /api/hosts/profile        — update host profile

GET  /api/hosts/:id            — get host public listing

### Guides — `/api/guides`
POST /api/guides/profile       — create guide profile

PUT  /api/guides/profile       — update guide profile

GET  /api/guides/:id           — get guide public profile

## Matching algorithm
This is the most important logic in the backend. It lives in
`MatchingAlgorithm.java` inside the matching package.

### Input
The seeker's preferences (from their user profile) and the search parameters
(city, dates, budget) submitted in the request body.

### Pipeline
1. Hard filter: exclude all hosts where
   - city does not match requested city
   - price_per_night > seeker's max budget
   - is_active = false
   - availability_calendar does not cover requested dates
   (For dietary hard filter: if seeker has a hard requirement — halal, kosher,
   allergy — exclude any host whose diet_offered does not include it.)

2. Scoring: for each remaining host, compute a weighted score 0–100:

```java
score = (languageScore   * 0.20)
      + (dietScore       * 0.20)
      + (lifestyleScore  * 0.15)
      + (budgetFitScore  * 0.15)
      + (proximityScore  * 0.15)
      + (culturalScore   * 0.10)
      + (trustScore      * 0.05);
```

Scoring logic per dimension:
- `languageScore`: 100 if host speaks seeker's preferred language natively,
  50 if as a second language, 0 if no overlap.
- `dietScore`: 100 if all seeker dietary requirements are in host's
  diet_offered. 0 if any hard requirement is missing (this should already be
  filtered, but double-check here). Partial for optional preferences.
- `lifestyleScore`: compare seeker's daily routine preference against host's
  house rules free text using keyword matching (quiet / social / flexible).
  Simple string match is acceptable for MVP.
- `budgetFitScore`: 100 if price <= 60% of seeker's max budget, 50 if 60–80%,
  20 if 80–100%.
- `proximityScore`: use the distance formula on lat/lng (Haversine or simple
  Euclidean for MVP). 100 if < 2km, 80 if 2–5km, 50 if 5–10km, 20 if > 10km.
  University coordinates are passed in the request or stored on the user
  profile.
- `culturalScore`: 100 if host's nationality matches seeker's preferred
  cultural background preference. 0 if not set or no match.
- `trustScore`: (averageRating / 5.0) * 100, weighted by number of reviews.
  New hosts with 0 reviews receive a score of 50 (neutral).

3. Generate plain-English match explanation for each result. Build this as a
   list of up to 3 reason strings:
   - Language: "Speaks [language] natively"
   - Diet: "Offers [halal/vegan/kosher] meals"
   - Proximity: "[X] min from your university by [transport]"
   - Budget: "Within your budget"
   - Trust: "[N] verified reviews, [X] star average"

   Return these as a `List<String> matchReasons` in the response DTO.

4. Sort descending by score. Cache in Redis with key
   `match:{userId}:{searchHash}` and TTL 15 minutes.

5. Return top 10 results.

### Response DTO
```java
public class MatchResultDTO {
  private UUID matchId;
  private UUID targetId;
  private String targetType;           // HOST or GUIDE
  private String targetName;
  private String targetPhotoUrl;
  private Double compatibilityScore;   // 0–100
  private Map<String, Double> scoreBreakdown;
  private List<String> matchReasons;
  private String trustBadge;           // VERIFIED | TRUSTED | PRO
  private Double pricePerNight;
  private Double distanceKm;
}
```

## JWT security
- Access token: 15-minute expiry, signed HS256 with secret from properties.
- Refresh token: 30-day expiry, stored in Redis on issue, deleted on logout.
- `JwtFilter` runs before every request, validates token, sets
  `SecurityContextHolder`.
- Protected endpoints require `ROLE_` prefix matching the user's role.
- Public endpoints (no auth required): `/api/auth/**`, `GET /api/hosts/:id`,
  `GET /api/guides/:id`.

## Unified API response format
All endpoints return this wrapper. Never return a raw entity or a plain string.

```java
public class ApiResponse<T> {
  private boolean success;
  private String message;
  private T data;
  private LocalDateTime timestamp;
}
```

Success: `ApiResponse.success("Match results retrieved", data)`
Error: `ApiResponse.error("Invalid credentials")`

`GlobalExceptionHandler.java` catches all unhandled exceptions and returns a
formatted `ApiResponse` with `success: false`. Never let a stack trace reach
the client.

## Firebase (messaging only)
The backend uses Firebase Admin SDK for two things only:
1. Provisioning a new conversation node when a match is accepted.
2. Persisting message records (for translation + audit) when a message is sent.

The frontend writes messages directly to Firebase. The backend does not relay
messages — it only listens via a Firebase listener to persist and translate.

Do not use Firebase for anything else. Auth, bookings, welfare, and all other
data live in PostgreSQL.

## Seed data (required before demo)
Run `V2__seed_hosts.sql` and `V3__seed_guides.sql` before the demo. The seed
must include:
- 8 host profiles across Accra and Kumasi with varied:
  - languages (English, French, Twi, Arabic, Hausa combinations)
  - dietary offerings (halal, vegan, standard, kosher)
  - price ranges (GHS 80–350/night)
  - trust scores and fake review counts
  - realistic Ghanaian names and addresses
  - lat/lng coordinates that map correctly
- 3 guide profiles with different service types
- 2 student user accounts for demo login
- All host profiles must have `is_active = true` and `is_verified = true`

## What is not built in this sprint
Do not implement these — mark with a TODO comment if referenced:
- Real Stripe / Paystack integration (mock: `payment_status = CONFIRMED` on
  confirm endpoint, no actual charge)
- Real KYC / Smile ID call (mock: set `is_verified = true` on the user)
- Email / SMS notifications (Welfare check-in scheduling is stubbed)
- Admin dashboard endpoints
- Review submission and moderation
- Community Hub, scholarship portal, video library
- Translation API calls (return original text with a `translationAvailable:
  true` flag)

## Running the project
```bash
# Start PostgreSQL and Redis locally first
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
# API available at http://localhost:8080
```

## Testing endpoints during development
Use Postman or HTTPie. Import the base URL as `http://localhost:8080`.
All protected endpoints need:
Authorization: Bearer <jwt_from_login_response>

Register a student first, then register a host, seed the host profile via SQL,
then test the matching endpoint with the student's JWT.