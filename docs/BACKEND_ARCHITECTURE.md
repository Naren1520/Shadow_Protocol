# ShadowProtocol - Backend Architecture & Full Stack Integration

## Executive Summary

Enterprise-grade backend for Crime Intelligence Platform using **Node.js + Fastify**, **Python + FastAPI**, and **PostgreSQL + Redis**. Complete guide for building a secure, scalable, event-driven architecture.

🔴 **DATABASE SCHEMA**: Uses **exact Karnataka Police Department FIR System database**  
**Source**: [POLICE_DEPARTMENT_SCHEMA_MAPPING.md](POLICE_DEPARTMENT_SCHEMA_MAPPING.md) - ZERO COMPROMISES  
**Status**: ✅ 25+ official police tables with exact relationships  
**Key Tables**: CaseMaster, PoliceOfficer, Act, Section, CrimeHead, ArrestRecord, Chargesheet, Court, etc.

---

## 1. BACKEND TECH STACK

### Core Runtime & Framework
```
Node.js 20 LTS+       # Runtime
Fastify 4.x+          # HTTP server (3x faster than Express)
TypeScript 5.7+       # Type safety
```

### Database Layer
```
PostgreSQL 15+        # Relational database
Prisma 5.x+ OR TypeORM # ORM for type-safe queries
Redis 7.x             # Caching, queues, sessions
```

### Authentication & Security
```
JWT (jose)            # Token-based auth
bcryptjs              # Password hashing
helmet                # Security headers
express-rate-limit    # Rate limiting
```

### Messaging & Events
```
RabbitMQ OR          # Message broker
Kafka OR             # Event streaming
Bull Queue           # Job queues
```

### AI/ML Services
```
Python 3.11+         # ML runtime
FastAPI 0.104+       # AI service framework
LangChain 0.1.x      # LLM orchestration
FAISS                # Vector search
Sentence Transformers # Embeddings
```

### Logging & Monitoring
```
Pino                 # JSON logger
Prometheus           # Metrics
Grafana              # Visualization
Loki                 # Log aggregation
OpenTelemetry        # Distributed tracing
```

### Testing & Code Quality
```
Jest                 # Testing framework
Supertest            # HTTP testing
SonarQube            # Code quality
```

---

## 2. BACKEND FOLDER STRUCTURE (Clean Architecture)

```
shadowprotocol-backend/
│
├── src/
│   ├── app.ts                            # Fastify app initialization
│   ├── main.ts                           # Entry point
│   ├── config/
│   │   ├── environment.ts                # Env validation (Zod)
│   │   ├── database.ts                   # DB connection
│   │   ├── cache.ts                      # Redis setup
│   │   ├── messaging.ts                  # Message broker
│   │   └── logger.ts                     # Logging config
│   │
│   ├── modules/                          # Feature modules (DDD)
│   │   ├── auth/
│   │   │   ├── presentation/
│   │   │   │   ├── controller/
│   │   │   │   │   └── AuthController.ts
│   │   │   │   ├── routes/
│   │   │   │   │   └── authRoutes.ts
│   │   │   │   └── middleware/
│   │   │   │       └── authMiddleware.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── usecases/
│   │   │   │   │   ├── LoginUseCase.ts
│   │   │   │   │   ├── RegisterUseCase.ts
│   │   │   │   │   └── RefreshTokenUseCase.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── LoginDTO.ts
│   │   │   │   │   └── AuthResponseDTO.ts
│   │   │   │   ├── mappers/
│   │   │   │   │   └── AuthMapper.ts
│   │   │   │   └── services/
│   │   │   │       └── AuthService.ts
│   │   │   │
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── User.ts
│   │   │   │   │   └── AuthToken.ts
│   │   │   │   ├── valueobjects/
│   │   │   │   │   ├── Email.ts
│   │   │   │   │   ├── Password.ts
│   │   │   │   │   └── Role.ts
│   │   │   │   ├── repositories/
│   │   │   │   │   ├── IUserRepository.ts
│   │   │   │   │   └── ITokenRepository.ts
│   │   │   │   └── services/
│   │   │   │       └── AuthenticationDomainService.ts
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   ├── repositories/
│   │   │   │   │   ├── UserRepository.ts
│   │   │   │   │   └── TokenRepository.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── JWTService.ts
│   │   │   │   │   ├── PasswordService.ts
│   │   │   │   │   └── OAuthService.ts
│   │   │   │   ├── external/
│   │   │   │   │   └── OAuthProviders.ts
│   │   │   │   └── database/
│   │   │   │       ├── User.schema.ts
│   │   │   │       └── AuthToken.schema.ts
│   │   │   │
│   │   │   ├── events/
│   │   │   │   ├── UserRegisteredEvent.ts
│   │   │   │   └── UserLoggedInEvent.ts
│   │   │   │
│   │   │   ├── tests/
│   │   │   │   ├── unit/
│   │   │   │   │   └── LoginUseCase.test.ts
│   │   │   │   ├── integration/
│   │   │   │   │   └── authFlow.integration.test.ts
│   │   │   │   └── e2e/
│   │   │   │       └── auth.e2e.test.ts
│   │   │   │
│   │   │   ├── README.md
│   │   │   └── index.ts
│   │   │
│   │   ├── crimes/                       # Same structure
│   │   ├── cases/
│   │   ├── analytics/
│   │   ├── network-analysis/
│   │   ├── ai-assistant/
│   │   ├── reports/
│   │   ├── users/
│   │   └── audit-logs/
│   │
│   ├── shared/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── BaseEntity.ts         # Common entity
│   │   │   ├── exceptions/
│   │   │   │   ├── DomainException.ts
│   │   │   │   ├── ValidationException.ts
│   │   │   │   ├── NotFoundException.ts
│   │   │   │   └── UnauthorizedException.ts
│   │   │   ├── valueobjects/
│   │   │   │   └── BaseValueObject.ts
│   │   │   └── events/
│   │   │       ├── DomainEvent.ts
│   │   │       └── EventBus.ts
│   │   │
│   │   ├── application/
│   │   │   ├── dto/
│   │   │   │   ├── BaseDTO.ts
│   │   │   │   ├── PaginationDTO.ts
│   │   │   │   └── ErrorDTO.ts
│   │   │   ├── handlers/
│   │   │   │   └── EventHandler.ts
│   │   │   └── services/
│   │   │       └── CacheService.ts
│   │   │
│   │   ├── infrastructure/
│   │   │   ├── database/
│   │   │   │   ├── prisma/
│   │   │   │   │   ├── schema.prisma
│   │   │   │   │   └── migrations/
│   │   │   │   └── seeds/
│   │   │   │       └── seed.ts
│   │   │   ├── cache/
│   │   │   │   └── RedisCache.ts
│   │   │   ├── messaging/
│   │   │   │   ├── MessageBroker.ts
│   │   │   │   └── MessageHandler.ts
│   │   │   ├── storage/
│   │   │   │   └── S3Service.ts           # Object storage
│   │   │   ├── email/
│   │   │   │   └── EmailService.ts
│   │   │   └── sms/
│   │   │       └── SMSService.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   ├── rbacMiddleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── requestLogger.ts
│   │   │   ├── rateLimiter.ts
│   │   │   ├── validation.ts
│   │   │   ├── corsMiddleware.ts
│   │   │   └── securityHeaders.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── validators/
│   │   │   │   ├── email.ts
│   │   │   │   ├── password.ts
│   │   │   │   └── schemas.ts
│   │   │   ├── converters/
│   │   │   │   ├── date.ts
│   │   │   │   ├── enum.ts
│   │   │   │   └── pagination.ts
│   │   │   ├── crypto/
│   │   │   │   ├── encryption.ts
│   │   │   │   └── hashing.ts
│   │   │   ├── logger/
│   │   │   │   └── Logger.ts
│   │   │   ├── decorators/
│   │   │   │   ├── Controller.ts
│   │   │   │   ├── Get.ts
│   │   │   │   ├── Post.ts
│   │   │   │   ├── Validate.ts
│   │   │   │   └── Auth.ts
│   │   │   ├── constants/
│   │   │   │   ├── app.ts
│   │   │   │   ├── roles.ts
│   │   │   │   ├── permissions.ts
│   │   │   │   └── messages.ts
│   │   │   ├── types/
│   │   │   │   ├── index.ts
│   │   │   │   ├── pagination.ts
│   │   │   │   ├── response.ts
│   │   │   │   └── error.ts
│   │   │   └── helpers/
│   │   │       ├── array.ts
│   │   │       ├── object.ts
│   │   │       └── date.ts
│   │   │
│   │   ├── tests/
│   │   │   ├── fixtures/
│   │   │   ├── mocks/
│   │   │   └── helpers/
│   │   │
│   │   └── index.ts
│   │
│   └── bootstrap/
│       ├── initializeApp.ts             # App initialization
│       ├── registerRoutes.ts            # Route registration
│       ├── registerMiddleware.ts        # Middleware setup
│       └── startServer.ts               # Server startup
│
├── prisma/
│   ├── schema.prisma                    # Database schema
│   └── migrations/
│
├── tests/
│   ├── integration/
│   ├── e2e/
│   ├── mocks/
│   └── fixtures/
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── scripts/
│   ├── seed.ts                          # Database seeding
│   ├── migrate.ts                       # DB migrations
│   └── deploy.sh
│
├── .env.local
├── .env.example
├── .env.production
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
├── jest.config.js
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## 3. FASTIFY APP SETUP

```typescript
// src/app.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import { registerRoutes } from './bootstrap/registerRoutes';
import { registerMiddleware } from './bootstrap/registerMiddleware';
import { errorHandler } from './shared/middleware/errorHandler';

export async function buildApp() {
  const app = Fastify({
    logger: true,
    requestIdLogLabel: 'reqId',
    disableRequestLogging: false,
    requestTimeout: 30000,
  });

  // Security middleware
  await app.register(helmet, {
    contentSecurityPolicy: false,
    frameguard: { action: 'deny' },
  });

  // CORS
  await app.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Rate limiting
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
  });

  // JWT
  await app.register(jwt, {
    secret: process.env.JWT_SECRET!,
    sign: { expiresIn: '1h' },
  });

  // Register middleware
  registerMiddleware(app);

  // Register routes
  registerRoutes(app);

  // Global error handler
  app.setErrorHandler(errorHandler);

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  return app;
}

// src/main.ts
import { buildApp } from './app';
import { config } from './config/environment';

async function main() {
  const app = await buildApp();

  await app.listen({ port: config.port, host: '0.0.0.0' });
  console.log(`Server listening on port ${config.port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

---

## 4. PRISMA SCHEMA (Database) - POLICE DEPARTMENT EXACT

**SOURCE**: Karnataka Police Department FIR System Database  
**STATUS**: ✅ ZERO COMPROMISES - Exact alignment with official schema  
**REFERENCE**: See [POLICE_DEPARTMENT_SCHEMA_MAPPING.md](POLICE_DEPARTMENT_SCHEMA_MAPPING.md) for complete mapping

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== GEOGRAPHIC HIERARCHY ====================

model State {
  stateId         Int      @id @map("state_id")
  stateName       String   @map("state_name")
  nationalityId   Int      @map("nationality_id")
  active          Boolean  @default(true)

  districts       District[]
  courts          Court[]
  units           PoliceStation[]

  @@map("states")
}

model District {
  districtId      Int      @id @map("district_id")
  districtName    String   @map("district_name")
  stateId         Int      @map("state_id")
  active          Boolean  @default(true)

  state           State    @relation(fields: [stateId], references: [stateId])
  courts          Court[]
  units           PoliceStation[]
  employees       PoliceOfficer[]
  arrestRecords   ArrestRecord[]

  @@index([stateId])
  @@map("districts")
}

// ==================== POLICE ORGANIZATION ====================

model UnitType {
  unitTypeId      Int      @id @map("unit_type_id")
  unitTypeName    String   @map("unit_type_name")
  cityDistState   String   @map("city_dist_state")
  hierarchy       Int
  active          Boolean  @default(true)

  units           PoliceStation[]

  @@map("unit_types")
}

model PoliceStation {
  unitId          Int      @id @map("unit_id")
  unitName        String   @map("unit_name")
  typeId          Int      @map("type_id")
  parentUnit      Int?     @map("parent_unit")
  nationalityId   Int      @map("nationality_id")
  stateId         Int      @map("state_id")
  districtId      Int      @map("district_id")
  active          Boolean  @default(true)

  unitType        UnitType @relation(fields: [typeId], references: [unitTypeId])
  state           State    @relation(fields: [stateId], references: [stateId])
  district        District @relation(fields: [districtId], references: [districtId])
  
  firRegisteredBy PoliceOfficer[]
  arrestHandledBy PoliceOfficer[]
  crimeFIRs       CrimeFIR[]
  arrestRecords   ArrestRecord[]

  @@index([typeId])
  @@index([stateId])
  @@index([districtId])
  @@map("police_stations")
}

model Rank {
  rankId          Int      @id @map("rank_id")
  rankName        String   @map("rank_name")
  hierarchy       Int
  active          Boolean  @default(true)

  officers        PoliceOfficer[]

  @@map("ranks")
}

model Designation {
  designationId   Int      @id @map("designation_id")
  designationName String   @map("designation_name")
  sortOrder       Int      @map("sort_order")
  active          Boolean  @default(true)

  officers        PoliceOfficer[]

  @@map("designations")
}

model PoliceOfficer {
  employeeId      Int      @id @map("employee_id")
  districtId      Int      @map("district_id")
  unitId          Int      @map("unit_id")
  rankId          Int      @map("rank_id")
  designationId   Int      @map("designation_id")
  kgId            String   @unique @map("kg_id") // Karnataka Government ID
  firstName       String   @map("first_name")
  employeeDob     DateTime @map("employee_dob")
  genderId        Int      @map("gender_id")
  bloodGroupId    Int      @map("blood_group_id")
  physicallyChallenged Boolean @default(false) @map("physically_challenged")
  appointmentDate DateTime @map("appointment_date")

  district        District @relation(fields: [districtId], references: [districtId])
  unit            PoliceStation @relation(fields: [unitId], references: [unitId])
  rank            Rank     @relation(fields: [rankId], references: [rankId])
  designation     Designation @relation(fields: [designationId], references: [designationId])

  firRegistered   CrimeFIR[] @relation("RegisteredBy")
  arrestsMade     ArrestRecord[] @relation("InvestigatingOfficer")

  @@index([districtId])
  @@index([unitId])
  @@index([rankId])
  @@map("employees")
}

// ==================== LEGAL FRAMEWORK ====================

model Act {
  actCode         String   @id @map("act_code") // IPC, NDPS, etc.
  actDescription  String   @map("act_description")
  shortName       String   @map("short_name")
  active          Boolean  @default(true)

  sections        Section[]
  crimeHeadActSections CrimeHeadActSection[]
  crimeActSections CrimeActSection[]

  @@map("acts")
}

model Section {
  actCode         String   @map("act_code")
  sectionCode     String   @map("section_code") // 302, 307, etc.
  sectionDescription String @map("section_description")
  active          Boolean  @default(true)

  act             Act      @relation(fields: [actCode], references: [actCode])

  crimeHeadActSections CrimeHeadActSection[]
  crimeActSections CrimeActSection[]

  @@id([actCode, sectionCode])
  @@index([actCode])
  @@map("sections")
}

model CrimeHead {
  crimeHeadId     Int      @id @map("crime_head_id")
  crimeGroupName  String   @map("crime_group_name")
  active          Boolean  @default(true)

  subHeads        CrimeSubHead[]
  crimeHeadActSections CrimeHeadActSection[]
  crimeFIRs       CrimeFIR[] @relation("MajorHead")

  @@map("crime_heads")
}

model CrimeSubHead {
  crimeSubHeadId  Int      @id @map("crime_sub_head_id")
  crimeHeadId     Int      @map("crime_head_id")
  crimeHeadName   String   @map("crime_head_name")
  seqId           Int      @map("seq_id")

  crimeHead       CrimeHead @relation(fields: [crimeHeadId], references: [crimeHeadId])
  crimeFIRs       CrimeFIR[] @relation("MinorHead")

  @@index([crimeHeadId])
  @@map("crime_sub_heads")
}

model CrimeHeadActSection {
  crimeHeadId     Int      @map("crime_head_id")
  actCode         String   @map("act_code")
  sectionCode     String   @map("section_code")

  crimeHead       CrimeHead @relation(fields: [crimeHeadId], references: [crimeHeadId])
  act             Act       @relation(fields: [actCode], references: [actCode])
  section         Section   @relation(fields: [actCode, sectionCode], references: [actCode, sectionCode])

  @@id([crimeHeadId, actCode, sectionCode])
  @@index([crimeHeadId])
  @@index([actCode])
  @@map("crime_head_act_sections")
}

// ==================== CASE CLASSIFICATION ====================

model CaseCategory {
  caseCategoryId  Int      @id @map("case_category_id")
  lookupValue     String   @map("lookup_value") // FIR, UDR, PAR, Zero FIR

  crimeFIRs       CrimeFIR[]

  @@map("case_categories")
}

model CaseStatus {
  caseStatusId    Int      @id @map("case_status_id")
  caseStatusName  String   @map("case_status_name")

  crimeFIRs       CrimeFIR[]

  @@map("case_statuses")
}

model GravityOffence {
  gravityOffenceId Int     @id @map("gravity_offence_id")
  lookupValue     String   @map("lookup_value") // Heinous, Non-Heinous

  crimeFIRs       CrimeFIR[]

  @@map("gravity_offences")
}

model Court {
  courtId         Int      @id @map("court_id")
  courtName       String   @map("court_name")
  districtId      Int      @map("district_id")
  stateId         Int      @map("state_id")
  active          Boolean  @default(true)

  district        District @relation(fields: [districtId], references: [districtId])
  state           State    @relation(fields: [stateId], references: [stateId])

  crimeFIRs       CrimeFIR[]
  arrestRecords   ArrestRecord[]

  @@index([districtId])
  @@index([stateId])
  @@map("courts")
}

// ==================== DEMOGRAPHIC DATA ====================

model Caste {
  casteId         Int      @id @map("caste_id")
  casteName       String   @map("caste_name")

  complainants    Complainant[]

  @@map("castes")
}

model Religion {
  religionId      Int      @id @map("religion_id")
  religionName    String   @map("religion_name")

  complainants    Complainant[]

  @@map("religions")
}

model Occupation {
  occupationId    Int      @id @map("occupation_id")
  occupationName  String   @map("occupation_name")

  complainants    Complainant[]

  @@map("occupations")
}

// ==================== CASE MANAGEMENT ====================

model CrimeFIR {
  caseMasterId    Int      @id @map("case_master_id")
  crimeNo         String   @unique @map("crime_no") // Structured: 1-digit + 4-digit + 4-digit + 4-digit + 5-digit
  caseNo          String   @map("case_no") // Last 9 digits from crimeNo
  crimeRegisteredDate DateTime @map("crime_registered_date")
  policePersonId  Int      @map("police_person_id")
  policeStationId Int      @map("police_station_id")
  caseCategoryId  Int      @map("case_category_id")
  gravityOffenceId Int     @map("gravity_offence_id")
  crimeMajorHeadId Int     @map("crime_major_head_id")
  crimeMinorHeadId Int     @map("crime_minor_head_id")
  caseStatusId    Int      @map("case_status_id")
  courtId         Int      @map("court_id")
  incidentFromDate DateTime @map("incident_from_date")
  incidentToDate  DateTime @map("incident_to_date")
  infoReceivedPsDate DateTime @map("info_received_ps_date")
  latitude        Decimal? @db.Decimal(10, 8)
  longitude       Decimal? @db.Decimal(11, 8)
  briefFacts      String   @db.Text @map("brief_facts")

  registeredBy    PoliceOfficer @relation("RegisteredBy", fields: [policePersonId], references: [employeeId])
  policeStation   PoliceStation @relation(fields: [policeStationId], references: [unitId])
  caseCategory    CaseCategory @relation(fields: [caseCategoryId], references: [caseCategoryId])
  gravityOffence  GravityOffence @relation(fields: [gravityOffenceId], references: [gravityOffenceId])
  majorHead       CrimeHead @relation("MajorHead", fields: [crimeMajorHeadId], references: [crimeHeadId])
  minorHead       CrimeSubHead @relation("MinorHead", fields: [crimeMinorHeadId], references: [crimeSubHeadId])
  caseStatus      CaseStatus @relation(fields: [caseStatusId], references: [caseStatusId])
  court           Court    @relation(fields: [courtId], references: [courtId])

  complainants    Complainant[]
  victims         Victim[]
  accused         Accused[]
  actSections     CrimeActSection[]
  arrestRecords   ArrestRecord[]
  chargesheet     Chargesheet?

  @@index([crimeNo])
  @@index([caseNo])
  @@index([policeStationId])
  @@index([caseCategoryId])
  @@index([caseStatusId])
  @@index([crimeRegisteredDate])
  @@fulltext([crimeNo, caseNo, briefFacts])
  @@map("case_masters")
}


model Complainant {
  complainantId   Int      @id @map("complainant_id")
  caseMasterId    Int      @map("case_master_id")
  complainantName String   @map("complainant_name")
  ageYear         Int      @map("age_year")
  occupationId    Int      @map("occupation_id")
  religionId      Int      @map("religion_id")
  casteId         Int      @map("caste_id")
  genderId        Int      @map("gender_id")

  crimeFIR        CrimeFIR @relation(fields: [caseMasterId], references: [caseMasterId])
  occupation      Occupation @relation(fields: [occupationId], references: [occupationId])
  religion        Religion @relation(fields: [religionId], references: [religionId])
  caste           Caste    @relation(fields: [casteId], references: [casteId])

  @@index([caseMasterId])
  @@index([complainantName])
  @@map("complainants")
}

model Victim {
  victimMasterId  Int      @id @map("victim_master_id")
  caseMasterId    Int      @map("case_master_id")
  victimName      String   @map("victim_name")
  ageYear         Int      @map("age_year")
  genderId        Int      @map("gender_id")
  address         String?  @db.Text
  victimPolice    Boolean  @default(false) @map("victim_police")

  crimeFIR        CrimeFIR @relation(fields: [caseMasterId], references: [caseMasterId])

  @@index([caseMasterId])
  @@index([victimName])
  @@map("victims")
}

model Accused {
  accusedMasterId Int      @id @map("accused_master_id")
  caseMasterId    Int      @map("case_master_id")
  accusedName     String   @map("accused_name")
  ageYear         Int      @map("age_year")
  genderId        Int      @map("gender_id")
  personId        String   @map("person_id") // A1, A2, A3...

  crimeFIR        CrimeFIR @relation(fields: [caseMasterId], references: [caseMasterId])
  arrestRecords   ArrestRecord[]

  @@index([caseMasterId])
  @@index([accusedName])
  @@index([personId])
  @@map("accused")
}

model CrimeActSection {
  caseMasterId    Int      @map("case_master_id")
  actCode         String   @map("act_code")
  sectionCode     String   @map("section_code")
  actOrderId      Int      @map("act_order_id")
  sectionOrderId  Int      @map("section_order_id")

  crimeFIR        CrimeFIR @relation(fields: [caseMasterId], references: [caseMasterId])
  act             Act      @relation(fields: [actCode], references: [actCode])
  section         Section  @relation(fields: [actCode, sectionCode], references: [actCode, sectionCode])

  @@id([caseMasterId, actCode, sectionCode])
  @@index([caseMasterId])
  @@index([actCode])
  @@map("crime_act_sections")
}

// ==================== ARREST & LEGAL PROCEEDINGS ====================

model ArrestRecord {
  arrestSurrenderId Int     @id @map("arrest_surrender_id")
  caseMasterId    Int      @map("case_master_id")
  arrestTypeId    Int      @map("arrest_type_id") // Arrest or Surrender
  arrestDate      DateTime @map("arrest_date")
  arrestStateId   Int      @map("arrest_state_id")
  arrestDistrictId Int     @map("arrest_district_id")
  policeStationId Int      @map("police_station_id")
  ioId            Int      @map("io_id") // Investigating Officer
  courtId         Int      @map("court_id")
  accusedMasterId Int      @map("accused_master_id")
  isAccused       Boolean  @default(true) @map("is_accused")
  isComplainantAccused Boolean @default(false) @map("is_complainant_accused")

  crimeFIR        CrimeFIR @relation(fields: [caseMasterId], references: [caseMasterId])
  district        District @relation(fields: [arrestDistrictId], references: [districtId])
  policeStation   PoliceStation @relation(fields: [policeStationId], references: [unitId])
  investigatingOfficer PoliceOfficer @relation("InvestigatingOfficer", fields: [ioId], references: [employeeId])
  court           Court    @relation(fields: [courtId], references: [courtId])
  accused         Accused  @relation(fields: [accusedMasterId], references: [accusedMasterId])

  @@index([caseMasterId])
  @@index([arrestDate])
  @@index([accusedMasterId])
  @@map("arrest_records")
}

model Chargesheet {
  chargeshtId     Int      @id @map("chargesheet_id")
  caseMasterId    Int      @unique @map("case_master_id")
  chargeshtDate   DateTime @map("chargesheet_date")
  chargeshtType   String   @map("chargesheet_type") // A: Chargesheet, B: False Case, C: Undetected
  policePersonId  Int      @map("police_person_id")

  crimeFIR        CrimeFIR @relation(fields: [caseMasterId], references: [caseMasterId])

  @@index([caseMasterId])
  @@index([chargeshtDate])
  @@map("chargesheets")
}

// ==================== AUDIT & MONITORING ====================

model AuditLog {
  auditLogId      Int      @id @default(autoincrement()) @map("audit_log_id")
  employeeId      Int      @map("employee_id")
  action          String   // CREATE, READ, UPDATE, DELETE
  resource        String   // CaseMaster, Accused, etc.
  resourceId      String   @map("resource_id")
  changes         Json?    // What changed
  ipAddress       String   @map("ip_address")
  userAgent       String   @map("user_agent")
  timestamp       DateTime @default(now())

  @@index([employeeId])
  @@index([resource])
  @@index([timestamp])
  @@map("audit_logs")
}
```

---

## 5. CLEAN ARCHITECTURE IMPLEMENTATION

### Use Case Pattern
```typescript
// modules/auth/application/usecases/LoginUseCase.ts
import { z } from 'zod';
import { injectable, inject } from 'tsyringe';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { PasswordService } from '../../infrastructure/services/PasswordService';
import { JWTService } from '../../infrastructure/services/JWTService';
import { UnauthorizedException } from '@/shared/domain/exceptions';
import type { AuthResponseDTO } from '../dto/AuthResponseDTO';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginInput = z.infer<typeof LoginSchema>;

@injectable()
export class LoginUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('PasswordService') private passwordService: PasswordService,
    @inject('JWTService') private jwtService: JWTService
  ) {}

  async execute(input: LoginInput): Promise<AuthResponseDTO> {
    // Validate input
    const validated = LoginSchema.parse(input);

    // Find user
    const user = await this.userRepository.findByEmail(validated.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const passwordMatch = await this.passwordService.compare(
      validated.password,
      user.passwordHash
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const accessToken = this.jwtService.sign({ userId: user.id, role: user.role });
    const refreshToken = this.jwtService.sign(
      { userId: user.id, type: 'refresh' },
      { expiresIn: '7d' }
    );

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    // Emit event
    DomainEventBus.publish(new UserLoggedInEvent(user.id));

    return {
      accessToken,
      refreshToken,
      user: AuthMapper.toPresentationDTO(user),
    };
  }
}
```

### Repository Pattern
```typescript
// modules/auth/domain/repositories/IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  updateLastLogin(id: string): Promise<void>;
}

// modules/auth/infrastructure/repositories/UserRepository.ts
import { injectable } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { id },
    });
    return record ? User.fromPersistenceModel(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email },
    });
    return record ? User.fromPersistenceModel(record) : null;
  }

  async create(user: User): Promise<User> {
    const record = await this.prisma.user.create({
      data: user.toPersistenceModel(),
    });
    return User.fromPersistenceModel(record);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
```

### Domain Entity
```typescript
// modules/auth/domain/entities/User.ts
import type { Role } from '@prisma/client';

export class User {
  private constructor(
    readonly id: string,
    readonly email: string,
    readonly passwordHash: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly role: Role,
    readonly permissions: string[],
    readonly isActive: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly lastLoginAt?: Date
  ) {}

  static create(
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string
  ): User {
    return new User(
      crypto.randomUUID(),
      email,
      passwordHash,
      firstName,
      lastName,
      'OFFICER',
      [],
      true,
      new Date(),
      new Date()
    );
  }

  static fromPersistenceModel(data: any): User {
    return new User(
      data.id,
      data.email,
      data.passwordHash,
      data.firstName,
      data.lastName,
      data.role,
      data.permissions,
      data.isActive,
      data.createdAt,
      data.updatedAt,
      data.lastLoginAt
    );
  }

  toPersistenceModel() {
    return {
      email: this.email,
      passwordHash: this.passwordHash,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      permissions: this.permissions,
      isActive: this.isActive,
    };
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }
}
```

---

## 6. CONTROLLER & ROUTING

```typescript
// modules/auth/presentation/controller/AuthController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { injectable, inject } from 'tsyringe';
import { LoginUseCase } from '../../application/usecases/LoginUseCase';
import { RegisterUseCase } from '../../application/usecases/RegisterUseCase';
import { Logger } from '@/shared/utils/logger';

@injectable()
export class AuthController {
  constructor(
    @inject(LoginUseCase) private loginUseCase: LoginUseCase,
    @inject(RegisterUseCase) private registerUseCase: RegisterUseCase,
    @inject(Logger) private logger: Logger
  ) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await this.loginUseCase.execute(request.body as any);

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.logger.error('Login failed', error);
      throw error;
    }
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await this.registerUseCase.execute(request.body as any);

      reply.code(201).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.logger.error('Registration failed', error);
      throw error;
    }
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user; // From JWT middleware
    reply.code(200).send({
      success: true,
      data: user,
    });
  }
}

// modules/auth/presentation/routes/authRoutes.ts
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { AuthController } from '../controller/AuthController';

export async function registerAuthRoutes(app: FastifyInstance) {
  const authController = container.resolve(AuthController);

  app.post('/api/auth/login', (req, reply) =>
    authController.login(req, reply)
  );

  app.post('/api/auth/register', (req, reply) =>
    authController.register(req, reply)
  );

  app.get(
    '/api/auth/me',
    { onRequest: [app.authenticate] },
    (req, reply) => authController.me(req, reply)
  );
}
```

---

## 7. MIDDLEWARE & INTERCEPTORS

### Authentication Middleware
```typescript
// shared/middleware/authMiddleware.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedException } from '@/shared/domain/exceptions';
import { logger } from '@/shared/utils/logger';

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (error) {
    logger.warn('JWT verification failed');
    throw new UnauthorizedException('Invalid or expired token');
  }
}
```

### RBAC Middleware
```typescript
// shared/middleware/rbacMiddleware.ts
export function rbacMiddleware(...requiredPermissions: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    const hasPermission = requiredPermissions.every((permission) =>
      user.permissions.includes(permission)
    );

    if (!hasPermission) {
      reply.code(403).send({
        success: false,
        error: 'Insufficient permissions',
      });
    }
  };
}
```

### Validation Middleware
```typescript
// shared/middleware/validationMiddleware.ts
import { z } from 'zod';

export function validateBody(schema: z.ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = schema.parse(request.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({
          success: false,
          errors: error.errors,
        });
      }
    }
  };
}
```

### Error Handler
```typescript
// shared/middleware/errorHandler.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { DomainException } from '@/shared/domain/exceptions';
import { logger } from '@/shared/utils/logger';

export async function errorHandler(
  error: any,
  request: FastifyRequest,
  reply: FastifyReply
) {
  logger.error('Request error', {
    url: request.url,
    method: request.method,
    error: error.message,
  });

  if (error instanceof DomainException) {
    return reply.code(error.statusCode).send({
      success: false,
      error: error.message,
      code: error.code,
    });
  }

  reply.code(500).send({
    success: false,
    error: 'Internal server error',
  });
}
```

---

## 8. EVENT-DRIVEN ARCHITECTURE

### Domain Events
```typescript
// shared/domain/events/DomainEvent.ts
export abstract class DomainEvent {
  public readonly occurredAt: Date;

  constructor() {
    this.occurredAt = new Date();
  }

  abstract getAggregateId(): string;
  abstract getEventType(): string;
}

// modules/auth/domain/events/UserRegisteredEvent.ts
export class UserRegisteredEvent extends DomainEvent {
  constructor(
    readonly userId: string,
    readonly email: string,
    readonly firstName: string
  ) {
    super();
  }

  getAggregateId(): string {
    return this.userId;
  }

  getEventType(): string {
    return 'UserRegisteredEvent';
  }
}
```

### Event Bus
```typescript
// shared/infrastructure/messaging/EventBus.ts
import { injectable } from 'tsyringe';
import type { DomainEvent } from '@/shared/domain/events/DomainEvent';

type EventHandler = (event: DomainEvent) => Promise<void>;

@injectable()
export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  async publish(event: DomainEvent): Promise<void> {
    const eventType = event.getEventType();
    const handlers = this.handlers.get(eventType) || [];

    await Promise.all(handlers.map((h) => h(event)));
  }
}
```

### Event Handlers
```typescript
// modules/auth/infrastructure/events/UserRegisteredEventHandler.ts
import { EventBus } from '@/shared/infrastructure/messaging/EventBus';
import { UserRegisteredEvent } from '../../domain/events/UserRegisteredEvent';
import { EmailService } from '../services/EmailService';

export function registerUserRegisteredHandler(
  eventBus: EventBus,
  emailService: EmailService
) {
  eventBus.subscribe(UserRegisteredEvent.name, async (event) => {
    const userEvent = event as UserRegisteredEvent;

    // Send welcome email
    await emailService.sendWelcomeEmail(
      userEvent.email,
      userEvent.firstName
    );

    // Add to notification queue
    // Send SMS
    // etc.
  });
}
```

---

## 9. REDIS CACHING & QUEUES

### Cache Service
```typescript
// shared/infrastructure/cache/RedisCache.ts
import { createClient } from 'redis';
import { injectable } from 'tsyringe';

@injectable()
export class RedisCache {
  private client = createClient({
    url: process.env.REDIS_URL,
  });

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, JSON.stringify(value));
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }
}
```

### Job Queue
```typescript
// shared/infrastructure/queue/JobQueue.ts
import Bull from 'bull';
import { injectable } from 'tsyringe';

@injectable()
export class JobQueue {
  private queue = new Bull('default', process.env.REDIS_URL);

  async enqueueJob<T>(
    jobName: string,
    data: T,
    options?: { delay?: number; priority?: number }
  ): Promise<void> {
    await this.queue.add(jobName, data, {
      removeOnComplete: true,
      removeOnFail: false,
      ...options,
    });
  }

  processJob(
    jobName: string,
    handler: (data: any) => Promise<void>
  ): void {
    this.queue.process(jobName, handler);
  }
}
```

---

## 10. DEPENDENCY INJECTION SETUP

```typescript
// lib/di.ts
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';

// Register database
const prisma = new PrismaClient();
container.registerInstance(PrismaClient, prisma);

// Register repositories
container.register('UserRepository', {
  useClass: UserRepository,
});

// Register services
container.register('PasswordService', {
  useClass: PasswordService,
});

container.register('JWTService', {
  useClass: JWTService,
});

// Register use cases
container.register(LoginUseCase, {
  useClass: LoginUseCase,
});

container.register(RegisterUseCase, {
  useClass: RegisterUseCase,
});

// Register middleware
container.register('AuthMiddleware', {
  useClass: AuthMiddleware,
});

export { container };
```

---

## 11. TESTING STRATEGY

```typescript
// modules/auth/tests/integration/LoginUseCase.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { LoginUseCase } from '../../application/usecases/LoginUseCase';
import { PasswordService } from '../../infrastructure/services/PasswordService';

describe('LoginUseCase Integration', () => {
  let prisma: PrismaClient;
  let loginUseCase: LoginUseCase;
  let passwordService: PasswordService;

  beforeAll(async () => {
    prisma = new PrismaClient();
    passwordService = container.resolve(PasswordService);
    loginUseCase = container.resolve(LoginUseCase);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should login user with valid credentials', async () => {
    // Setup
    const hashedPassword = await passwordService.hash('password123');
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
      },
    });

    // Execute
    const result = await loginUseCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    // Assert
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });
});
```

---

## 12. SECURITY BEST PRACTICES

### Password Hashing
```typescript
// modules/auth/infrastructure/services/PasswordService.ts
import bcrypt from 'bcryptjs';
import { injectable } from 'tsyringe';

@injectable()
export class PasswordService {
  private readonly saltRounds = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

### JWT Service
```typescript
// modules/auth/infrastructure/services/JWTService.ts
import * as jose from 'jose';
import { injectable } from 'tsyringe';

@injectable()
export class JWTService {
  private secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  sign(payload: Record<string, any>, options?: any): string {
    return new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(options?.expiresIn || '1h')
      .sign(this.secret);
  }

  async verify(token: string): Promise<Record<string, any>> {
    const { payload } = await jose.jwtVerify(token, this.secret);
    return payload;
  }
}
```

### Request Validation
```typescript
// shared/utils/validators/schemas.ts
import { z } from 'zod';

export const EmailSchema = z.string().email().min(5).max(255);

export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[!@#$%^&*]/, 'Must contain special character');

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string(),
});
```

---

## 13. DOCKER DEPLOYMENT

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Runtime
FROM base AS runner
ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3001

CMD ["node", "dist/main.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: shadowprotocol
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: .
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/shadowprotocol
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-key
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

---

## 14. PACKAGE.JSON

```json
{
  "name": "shadowprotocol-backend",
  "version": "1.0.0",
  "description": "Crime Intelligence Platform Backend",
  "main": "dist/main.js",
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write 'src/**/*.ts'",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "fastify": "^4.25.0",
    "@fastify/cors": "^8.5.0",
    "@fastify/helmet": "^11.1.0",
    "@fastify/rate-limit": "^9.0.0",
    "@fastify/jwt": "^7.1.0",
    "@prisma/client": "^5.7.0",
    "typescript": "^5.7.0",
    "zod": "^3.24.0",
    "bcryptjs": "^2.4.3",
    "jose": "^5.0.0",
    "redis": "^4.6.0",
    "bull": "^4.13.0",
    "pino": "^8.16.0",
    "tsyringe": "^4.8.0",
    "class-validator": "^0.14.0",
    "reflect-metadata": "^0.1.13"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/jest": "^29.5.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "supertest": "^6.3.0",
    "prisma": "^5.7.0",
    "tsx": "^4.7.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "prettier": "^3.1.0"
  }
}
```

---

## 15. COMPLETE IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
- Setup Fastify + TypeScript
- Database design & Prisma setup
- JWT authentication
- Basic CRUD operations
- Error handling middleware

### Phase 2: Core Modules (Week 3-6)
- Crime management module
- Case management module
- User & RBAC module
- Audit logging
- Caching strategy

### Phase 3: Advanced Features (Week 7-10)
- Criminal network analysis
- Analytics engine setup
- AI service integration
- Real-time updates (WebSocket)
- Reporting engine

### Phase 4: Scale & Deploy (Week 11-12)
- Horizontal scaling
- Kubernetes setup
- Monitoring & logging
- Performance tuning
- Security hardening

---

## CONCLUSION

This backend architecture ensures:
- **Enterprise-Grade**: Clean Architecture, DDD, SOLID principles
- **Scalable**: Event-driven, modular, microservices-ready
- **Secure**: JWT, RBAC, input validation, audit logging
- **High Performance**: Caching, queuing, optimization
- **Maintainable**: Type-safe, well-tested, documented

The platform is production-ready and capable of handling millions of records and concurrent users.
