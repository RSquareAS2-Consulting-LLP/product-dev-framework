import { useState } from "react";

const CLAUDE_FILES = {
  "product.md": (content) => `# Product — ${content.project || "[PROJECT NAME]"}
## What this product is. Generated from Discovery + Concept stage artefacts.

---

## One-line definition
${content.definition || "[FILL IN from Concept Note tagline]"}

## The problem it solves
${content.problem || "[FILL IN from Problem Statement]"}

## Who it serves
${content.users || `| Role | Who | What they need | Access level |
|------|-----|----------------|-------------|
| [role] | [from Target Users YAML] | [need] | [scope] |`}

## What success looks like (the primary metric)
${content.nsm || "[FILL IN from North Star Metric]"}

## What this product is NOT
${content.notThis || "- NOT [from Competitive Analysis — what we deliberately exclude]\n- NOT [from MVP Scope — what is out of scope]"}

## Governing philosophy / north star
${content.philosophy || "[FILL IN from Value Proposition Canvas — the core belief driving design decisions]"}

---

## Phasing
${content.phases || `| Phase | Scope | Target |
|-------|-------|--------|
| MVP | [from MVP Scope Definition] | [date] |
| v1.1 | [post-MVP roadmap] | [date] |`}

---

## Source documents
- Concept Note (Stage 1 output)
- BRD (Stage 2 output)
- Lean Canvas, Value Proposition Canvas (Stage 0 output)

_When this file and a source document conflict, this distilled file wins for day-to-day AI sessions._`,

  "architecture.md": (content) => `# Architecture — ${content.project || "[PROJECT NAME]"}
## Technical architecture. Generated from Tech Stack + Data stage artefacts.

---

## Architectural overview
${content.overview || "[FILL IN from Infrastructure Diagram description — components, data flows, deployment topology]"}

---

## Components
${content.components || `### API Service
- **Function:** [from Sequence Diagrams]
- **Technology:** [from Tech Stack Decision — backend]
- **Depends on:** Database, Cache, Queue
- **Current status:** Not built

### Frontend App
- **Function:** [from Screen Map]
- **Technology:** [from Tech Stack Decision — frontend]
- **Depends on:** API Service
- **Current status:** Not built

### Database
- **Function:** [from ER Diagram description]
- **Technology:** [from Tech Stack Decision — database.primary]
- **Depends on:** —
- **Current status:** Not built`}

---

## Technology stack
${content.stack || `| Layer | Choice | Status |
|-------|--------|--------|
| Frontend | [from Tech Stack Decision] | Confirmed |
| Backend | [from Tech Stack Decision] | Confirmed |
| Database | [from Tech Stack Decision] | Confirmed |
| Auth | [from Tech Stack Decision] | Confirmed |
| Cache | [from Tech Stack Decision] | Confirmed |
| Infra / Hosting | [from Tech Stack Decision] | Confirmed |
| CI/CD | [from CI/CD Pipeline spec] | Confirmed |
| Monitoring | [from Observability Plan] | Confirmed |`}

---

## Data model (high level)
${content.dataModel || "[FILL IN from ER Diagram — list entities and key relationships in plain English]"}

---

## Key architectural decisions
${content.adrs || "See decisions/adr/ — generated from Architecture Decision Records (Stage 4 output)"}

## Current phase
See state/current.md.
As of [date]: [FILL IN after first sprint]`,

  "glossary.md": (content) => `# Glossary — ${content.project || "[PROJECT NAME]"}
## The canonical vocabulary. Generated from Data Dictionary + Concept Note.
## These names are fixed. Never invent alternatives.

---

## Why this file exists
When an AI session uses a different word for an existing concept, the next session
can't tell they're the same thing. This file is the single source of truth for naming.

**Rule:** If a concept doesn't have an entry here, add it here FIRST, then use it everywhere.

---

## Core terms
${content.terms || `| Term | Definition |
|------|-----------|
| [from Data Dictionary — entity names] | [from Data Dictionary — descriptions] |
| [from BRD Glossary section] | [definition] |`}

---

## Identifiers and naming conventions
${content.ids || `| ID scheme | Meaning | Example |
|-----------|---------|---------|
| EP-### | Epic identifier | EP-001 = User Authentication |
| US-### | User Story identifier | US-001 |
| FT-### | Feature identifier | FT-001 |
| TK-### | Task identifier | TK-001 |
| FR-### | Functional Requirement | FR-001 |
| NFR-### | Non-Functional Requirement | NFR-001 |
| BR-### | Business Rule | BR-001 |
| ADR-### | Architecture Decision Record | ADR-001 |
| TD-### | Tech Debt item | TD-001 |`}

---

## System invariants (things that must NEVER happen)
${content.invariants || "[FILL IN from Business Rules (type: constraint) and Threat Model mitigations]"}`,

  "engineering.md": (content) => `# Engineering Rules — ${content.project || "[PROJECT NAME]"}
## Enforced constraints. Generated from NFRs, Tech Stack ADRs, and Build stage.
## Deviations must be logged in decisions/deviations.md.

---

## Rule E-01: Cost constraint
${content.costRule || "The MVP infrastructure runs within the budget defined in the Cost Estimate (Stage 6 output). Before adding any dependency, verify: cost at 0 users, cost at target load (from NFRs), free-tier limits, and monthly minimums. Any dependency introducing a monthly minimum before product-market fit requires owner sign-off."}

## Rule E-02: Unlocked decisions block dependent work
If a task touches a PENDING item in decisions/open-decisions.md:
1. Build behind an abstraction layer (interface/adapter), OR
2. Log in state/open-questions.md and halt that component.
Never hard-commit to an unvalidated choice in production code.

## Rule E-03: Change scope
Prefer the smallest change that satisfies the spec. One concern per commit.
Do not refactor unrelated code in the same change.

## Rule E-04: Dependencies
No new dependency without:
(a) Checking Rule E-01 (cost)
(b) Confirming active maintainer and acceptable license
(c) A one-line note in the relevant ADR or journal

## Rule E-05: Secrets and configuration
${content.secretsRule || "API keys and secrets are never hard-coded or committed. All secrets are environment variables (see Environment Setup, Stage 6 output). Config that differs by environment is externalised, not branched in code."}

## Rule E-06: Performance targets (from NFRs)
${content.perfRule || "[FILL IN from NFR section of BRD — e.g. p95 latency < 200ms, uptime > 99.9%]"}

## Rule E-07: API contract
${content.apiRule || "All API changes must update the OpenAPI spec (Stage 4 output) before or alongside implementation. Breaking changes require a version bump per the Deprecation & Versioning Policy (Stage 7 output)."}

## Rule E-08: Database migrations
${content.dbRule || "All schema changes go through versioned migration scripts (Stage 3 SQL Scripts output). Direct DDL on production is prohibited. Every migration must have a rollback (DOWN) script."}`,

  "testing.md": (content) => `# Testing Rules — ${content.project || "[PROJECT NAME]"}
## Generated from Test Strategy (Stage 6) and Acceptance Criteria (Stage 2).
## What must pass before any merge. Enforced via CI.

---

## Rule T-01: No merge without passing CI
All tests run automatically on every push and pull request.
Merges to main are blocked unless all tests pass. No manual override.
CI pipeline defined in: Stage 6 CI/CD Pipeline output.

---

## Rule T-02: Test tiers
${content.testTiers || `| Tier | Framework | Coverage Target | Environment |
|------|-----------|----------------|-------------|
| Unit | [from Test Strategy] | ≥ 80% | Local + CI |
| Integration | [from Test Strategy] | Critical paths | CI |
| E2E | [from Test Strategy] | All user journeys | Staging |
| Load | [from Test Strategy] | NFR thresholds | Staging |
| Security | OWASP ZAP | OWASP Top 10 | Staging |`}

---

## Rule T-03: Security isolation tests are mandatory before production
Before any data endpoint ships, a cross-user access test must exist:
log in as User A, attempt to fetch User B's data, assert denial.
Source: Threat Model (Stage 4 output), Rule S-02.

---

## Rule T-04: Acceptance criteria are the test specification
Every User Story has Gherkin acceptance criteria (Stage 2 output).
Each scenario must have a corresponding automated test before the story is closed.
The RTM (Stage 2 output) tracks story → test case coverage.

---

## Rule T-05: Regression cases never regress
Any bug found in production gets a test added that reproduces it.
That test runs on every CI pass.
A previously-fixed bug recurring is a P1 incident.

---

## Rule T-06: Performance benchmarks
${content.perfBenchmarks || "[FILL IN from NFRs — e.g. load test must pass at X concurrent users with p95 < Y ms]"}`,

  "security.md": (content) => `# Security Rules — ${content.project || "[PROJECT NAME]"}
## Generated from Threat Model (Stage 4) and Data Governance (Stage 3).
## Non-negotiable. Deviations require owner sign-off and must be logged.

---

## Rule S-01: Access control is server-side
Role-based access control is enforced at the API/service layer, not just the UI.
A user who bypasses the UI must still be denied at the endpoint.
Source: Threat Model — Elevation of Privilege threats.

## Rule S-02: Data isolation
Each user sees only their own data. Every query returning user-specific data
filters by authenticated identity. Cross-user access test must exist and pass
before any data endpoint ships.
Source: Threat Model + Data Governance (Stage 3 output).

## Rule S-03: PII handling
${content.piiRule || "[FILL IN from Data Governance — PII inventory, legal basis, what is/isn't logged or sent to third parties]"}

## Rule S-04: Credentials and sensitive data
${content.credRule || "The application never stores raw passwords or payment credentials in plaintext. Passwords: hashed with bcrypt/argon2. Payment: delegated to provider; store only references. Source: Data Classification (Stage 3 output)."}

## Rule S-05: Transport and storage
TLS 1.3 minimum in transit. Encryption at rest for data classified as
Confidential or Restricted (see Data Governance classification tiers).
No plaintext API calls to providers handling user data.

## Rule S-06: Data retention and deletion
${content.retentionRule || "[FILL IN from Data Governance — retention periods per entity, deletion SLA, anonymisation policy]"}

## Rule S-07: Audit logging
${content.auditRule || "[FILL IN from Data Governance — which entities require audit trail, audit log schema from SQL Scripts]"}

## Rule S-08: Threat mitigations in force
The following mitigations from the Threat Model (Stage 4) are enforced in code:
${content.threatMitigations || "- Rate limiting on all public endpoints\n- CSRF protection on state-changing requests\n- Content Security Policy headers\n- Input validation at API boundary\n- Secrets in environment variables only (see Rule E-05)"}`,

  "CLAUDE.md": (content) => `# CLAUDE.md — ${content.project || "[PROJECT NAME]"}
## Entry point for every AI session. Read this file first, every time. No exceptions.
## Generated from framework Stage 0–2 artefacts. Update as product evolves.

---

## What this project is
${content.what || "[FILL IN from Concept Note — one paragraph: what is this, who does it serve, what is the single most important thing it does]"}

Owner(s): ${content.owners || "[FILL IN]"}
Current status: See state/current.md

---

## Mandatory read order (every session, no skipping)
1. **This file (CLAUDE.md)** — orientation and obligations
2. **state/current.md** — active phase, what's in flight, what's blocked RIGHT NOW
3. **The relevant spec** in specs/ for the task at hand
4. **The relevant rules** in rules/ for the domain being touched (engineering.md, testing.md, security.md)
5. **decisions/open-decisions.md** — check whether your task depends on an unlocked decision

---

## Document precedence (when two documents conflict)
\`\`\`
rules/  >  decisions/  >  specs/  >  context/  >  anything said in chat
\`\`\`
If two documents contradict: log in state/open-questions.md, surface to human. Do not proceed.

---

## Mandatory write-back obligations (before ending ANY session)
| File | What to write |
|------|--------------|
| state/current.md | Update phase, what changed, what's next |
| state/journal/YYYY-MM-DD.md | Task, decisions, files changed, open items |
| decisions/deviations.md | Any deviation from spec or rule, with rationale |
| decisions/adr/ADR-NNN.md | Any new architectural decision made this session |
| state/open-questions.md | Any new question needing human decision |

---

## Non-negotiable constraints
${content.constraints || "- [FILL IN from NFRs — performance, uptime, latency targets]\n- [FILL IN from Engineering Rules — cost ceiling, secret handling]\n- [FILL IN from Security Rules — access control, data isolation]\n- [FILL IN from Business Rules — critical domain invariants]"}

---

## How to behave
- **Read before write.** Complete the read order before any task.
- **Stop on conflict.** Contradictions → open-questions.md, never silent resolution.
- **Smallest change that satisfies the spec.** Don't expand scope unasked.
- **Build behind abstractions** when a decision is still PENDING.
- **Log decisions as you make them**, not at the end.
- **Keep state/current.md honest.**

---

## Canonical vocabulary
Single source of truth: context/glossary.md (generated from Data Dictionary + BRD Glossary).
Never invent a new name for an existing concept.

---

## Repository map
\`\`\`
context/      product.md · glossary.md · architecture.md · source-docs/
rules/        engineering.md · testing.md · security.md · product.md
decisions/    adr/ · deviations.md · open-decisions.md
specs/        one file per Feature (from FT-### artefacts, Stage 2 output)
state/        current.md · open-questions.md · journal/
playbooks/    add-feature.md · end-session.md · incident-response.md
\`\`\`

---

## Artefact index (where to find source documents)
| Artefact | Location |
|----------|----------|
| BRD | context/source-docs/brd.md |
| Epics & User Stories | context/source-docs/epics.yaml |
| API Specification | context/source-docs/openapi.yaml |
| ER Diagram + Schema | context/source-docs/schema.sql |
| Data Dictionary | context/source-docs/data-dictionary.md |
| Test Strategy | context/source-docs/test-strategy.md |
| Observability Plan | context/source-docs/observability.md |
| Threat Model | context/source-docs/threat-model.md |

_This file is version-controlled. Changes to constraints require owner sign-off._`,

  "current.md": () => `# Current State — [PROJECT NAME]
## Generated stub. Update at the start of every session.

---

## Active phase
[ ] Stage 0 — Discovery
[ ] Stage 1 — Concept
[ ] Stage 2 — Functionality
[ ] Stage 3 — Data
[ ] Stage 4 — Tech Stack
[ ] Stage 5 — Design
[ ] Stage 6 — Build
[ ] Stage 7 — Operate

**Current:** [MARK ACTIVE STAGE]

---

## What's in flight right now
[FILL IN: The 1-3 things actively being built or decided this week]

## What's blocked
[FILL IN: Anything waiting on a decision, a person, or an external dependency]

## What's next
[FILL IN: The next task after current work completes]

## Last session summary
Date: [YYYY-MM-DD]
Did: [what was completed]
Decided: [any decisions made]
Left open: [what carries forward]`,

  "open-decisions.md": () => `# Open Decisions — [PROJECT NAME]
## Decisions that are PENDING. Any code touching these must build behind an abstraction.
## Generated stub — populate from Tech Stack Decision and ADR artefacts.

---

## Format
| ID | Decision | Options | Blocking | Owner | Due |
|----|----------|---------|----------|-------|-----|

---

## PENDING decisions
| ID | Decision | Options | Blocking | Owner | Due |
|----|----------|---------|----------|-------|-----|
| OD-001 | [e.g. Email provider] | [SendGrid vs Postmark] | [User notification feature] | [name] | [date] |

---

## LOCKED decisions
_Move here from PENDING once decided. Reference ADR number._
| ID | Decision | Choice | ADR | Date |
|----|----------|--------|-----|------|`,

  "spec-template.md": () => `# Spec: [FEATURE NAME] (FT-###)
## Generated from Feature artefact (Stage 2 output). One file per feature.

---

## Status
[ ] Draft → [ ] Ready for implementation → [ ] In progress → [ ] Implemented → [ ] Verified

---

## Source
- Feature ID: FT-###
- Parent Epic: EP-###
- User Stories: US-###, US-###
- Functional Requirements: FR-###, FR-###
- RTM row(s): [link]

---

## What this feature does
[FILL IN from Feature description field]

## What it does NOT do (scope boundary)
[FILL IN — prevents scope creep during implementation]

---

## Acceptance criteria
[PASTE Gherkin scenarios from Acceptance Criteria artefact for linked User Stories]

\`\`\`gherkin
Feature: [Feature Name]

  Scenario: [Happy path]
    Given [context]
    When [action]
    Then [outcome]

  Scenario: [Error case]
    Given [context]
    When [invalid action]
    Then [error outcome]
\`\`\`

---

## API endpoints involved
[PASTE relevant paths from OpenAPI spec]

## Data entities touched
[PASTE relevant tables/entities from Data Dictionary]

## UI components required
[PASTE from Feature YAML — ui_components field]

## Business rules enforced
[PASTE relevant BR-### entries]

---

## Rules this feature must comply with
- engineering.md: [list relevant rule numbers]
- testing.md: [list relevant rule numbers]
- security.md: [list relevant rule numbers]

---

## Test requirements
- [ ] Unit tests for service logic
- [ ] Integration test for API endpoint(s)
- [ ] E2E test for user journey
- [ ] Cross-user isolation test (if data endpoint)
- [ ] Acceptance criteria scenarios automated

---

## Open questions
[FILL IN — any ambiguity to resolve before implementation]`
};

const stages = [
  {
    id: "discovery", label: "0. Discovery", color: "#534AB7", light: "#EEEDFE", border: "#3C3489", icon: "🔭",
    tagline: "Validate the opportunity",
    description: "Market validation, competitive analysis, and north star definition. Produces the strategic foundation for everything downstream.",
    artifacts: [
      { name: "Lean Canvas", desc: "One-page business model", format: "Markdown",
        prompt: `You are a product strategist. From the raw idea below, populate a Lean Canvas in Markdown table format.\n\nIdea: [PASTE IDEA]\n\n| Block | Content |\n|---|---|\n| Problem | |\n| Customer Segments | |\n| Unique Value Proposition | |\n| Solution | |\n| Channels | |\n| Revenue Streams | |\n| Cost Structure | |\n| Key Metrics | |\n| Unfair Advantage | |\n\nAdd a 2-sentence rationale below each block.` },
      { name: "Market Analysis", desc: "TAM/SAM/SOM and trends", format: "Markdown",
        prompt: `From the Lean Canvas, produce a Market Analysis.\n\nLean Canvas: [PASTE]\n\n## TAM / SAM / SOM (with sizing methodology)\n## Market Segmentation\n## Key Trends (3-5 driving demand)\n## Regulatory Landscape\n## Market Risks` },
      { name: "Competitive Analysis", desc: "Feature and positioning vs alternatives", format: "Markdown table",
        prompt: `From the Lean Canvas and Market Analysis, produce a Competitive Analysis.\n\nInputs: [PASTE]\n\n1. Competitor comparison table\n2. Positioning map\n3. Our differentiation narrative\n4. Feature gap opportunities` },
      { name: "Value Proposition Canvas", desc: "Customer jobs/pains/gains vs product fit", format: "Markdown",
        prompt: `From the Lean Canvas, produce a Value Proposition Canvas.\n\nLean Canvas: [PASTE]\n\n## Customer Profile\n### Jobs-to-be-done\n### Pains (ranked: extreme/moderate/mild)\n### Gains (ranked: essential/nice-to-have/unexpected)\n\n## Value Map\n### Pain Relievers\n### Gain Creators\n\n## Fit Narrative` },
      { name: "Assumptions Log", desc: "Tracked hypotheses with validation status", format: "Markdown table",
        prompt: `From all Discovery artefacts, extract all assumptions.\n\nInputs: [PASTE]\n\n| ID | Assumption | Category | Risk | Validation Method | Status | Evidence |\n|---|---|---|---|---|---|---|\n\nList ≥ 10 covering: market, user, technical, business, regulatory.` },
      { name: "North Star Metric", desc: "Primary success metric and input tree", format: "Markdown",
        prompt: `From the Lean Canvas and Value Proposition Canvas, define the North Star Metric.\n\nInputs: [PASTE]\n\n## North Star Metric\nName: \nFormula: \nRationale: \n\n## Metric Tree (input metrics that drive NSM)\n## Counter Metrics\n## Baseline and Target\n## Instrumentation Plan` }
    ],
    claudeFiles: ["product.md", "CLAUDE.md"],
    claudePrompt: `You are generating AI session files for a software project.\n\nFrom the Discovery artefacts below, fill in the following files. Output each file separately, clearly labelled with its filename.\n\nDiscovery Artefacts:\n- Lean Canvas: [PASTE]\n- Market Analysis: [PASTE]\n- Competitive Analysis: [PASTE]\n- Value Proposition Canvas: [PASTE]\n- North Star Metric: [PASTE]\n- Assumptions Log: [PASTE]\n\nProject name: [PROJECT NAME]\nOwner(s): [NAMES]\n\nGenerate:\n\n### FILE: context/product.md\n[Fill: one-line definition from tagline, problem from Lean Canvas problem block, user roles from customer segments, NSM as primary metric, "what this is NOT" from competitive analysis exclusions, governing philosophy from VPC]\n\n### FILE: CLAUDE.md (partial — constraints and what-is sections only)\n[Fill: project description paragraph, non-negotiable constraints from Assumptions Log high-risk items and VPC]`,
    outputArtifacts: ["Lean Canvas","Market Analysis","Competitive Analysis","Value Proposition Canvas","Assumptions Log","North Star Metric"],
    transitionPrompt: `You are a senior product manager. Using the Discovery artefacts below, produce a Concept Note.\n\nLean Canvas: [PASTE]\nMarket Analysis: [PASTE]\nCompetitive Analysis: [PASTE]\nValue Proposition Canvas: [PASTE]\nNorth Star Metric: [PASTE]\n\n## Product Name & Tagline\n## Problem Statement\n## Proposed Solution\n## Target Users (2-3 personas: name, role, top pain, top gain)\n## Key Differentiators\n## Success Metrics (linked to NSM)\n## Assumptions & Risks (top 5)\n\nEach section ≤ 150 words.`
  },
  {
    id: "concept", label: "1. Concept", color: "#7F77DD", light: "#EEEDFE", border: "#534AB7", icon: "💡",
    tagline: "Define the why and what",
    description: "Synthesise discovery into a product vision with problem statement, personas, governance, and stakeholder alignment.",
    artifacts: [
      { name: "Concept Note", desc: "One-page product vision", format: "Markdown",
        prompt: `From the Discovery artefacts, generate a Concept Note.\n\nInputs: [PASTE DISCOVERY ARTEFACTS]\n\n## 1. Product Name & Tagline\n## 2. Problem Statement\n## 3. Proposed Solution\n## 4. Target Users\n## 5. Key Differentiators\n## 6. Success Metrics\n## 7. Assumptions & Risks\n## 8. Sign-off section` },
      { name: "Problem Statement", desc: "Structured core problem definition", format: "Markdown",
        prompt: `From the Concept Note, sharpen the Problem Statement:\n\n[CURRENT STATE] causes [PAIN] for [WHO], [FREQUENCY]. Results in [QUANTIFIED IMPACT]. We will address by [DIRECTION], measured by [OUTCOME METRIC].\n\nExpand each clause into a paragraph with evidence.\n\nConcept Note: [PASTE]` },
      { name: "Target Users", desc: "Detailed persona profiles", format: "YAML",
        prompt: `From the Concept Note and Value Proposition Canvas, generate personas as YAML.\n\nInputs: [PASTE]\n\npersonas:\n  - name: \"\"\n    archetype: \"\"\n    role: \"\"\n    demographics: {}\n    goals: []\n    pain_points: []\n    current_workarounds: []\n    tech_comfort: low|medium|high\n    usage_context: \"\"\n    decision_influence: buyer|user|influencer|champion\n    voice_of_customer_quote: \"\"` },
      { name: "RACI Matrix", desc: "Responsibility across the lifecycle", format: "Markdown table",
        prompt: `From the Concept Note, produce a RACI Matrix for all 8 lifecycle stages.\n\nConcept Note: [PASTE]\nTeam roles: [PASTE]\n\nFor each key activity, assign R/A/C/I to: Product Manager, Tech Lead, Designer, QA Lead, DevOps, Data, Sponsor. Group by stage.` },
      { name: "Change Request Process", desc: "Governance for scope and artefact changes", format: "Markdown",
        prompt: `Define a Change Request process.\n\nConcept Note: [PASTE]\nRACI: [PASTE]\n\n## Trigger Conditions\n## CR Template\n## Approval Matrix (by impact level)\n## Artefact Versioning Convention\n## CR Log format\n## Escalation protocol` }
    ],
    claudeFiles: ["CLAUDE.md", "product.md", "glossary.md", "current.md"],
    claudePrompt: `From the Concept stage artefacts below, generate the following AI session files. Output each separately, clearly labelled.\n\nConcept Note: [PASTE]\nProblem Statement: [PASTE]\nTarget Users YAML: [PASTE]\nRACI Matrix: [PASTE]\nChange Request Process: [PASTE]\n\nProject name: [PROJECT NAME]\nOwner(s): [NAMES]\n\n### FILE: CLAUDE.md\n[Fill ALL sections: project description from Concept Note, non-negotiable constraints from Problem Statement + CR process, artefact index with actual filenames]\n\n### FILE: context/product.md\n[Fill: one-line definition, problem, user roles table from personas, NSM, what-is-NOT, phases]\n\n### FILE: context/glossary.md\n[Seed core terms table from Concept Note vocabulary and persona names. Add identifier scheme table with EP/US/FT/TK/FR/NFR/BR/ADR/TD prefixes]\n\n### FILE: state/current.md\n[Fill: active phase = Stage 1 Concept, what's in flight = BRD drafting, what's next = Stage 2 Functionality]`,
    outputArtifacts: ["Concept Note","Problem Statement","Target Users","RACI Matrix","Change Request Process"],
    transitionPrompt: `You are a business analyst. From the Concept artefacts, generate a full BRD.\n\nConcept Note: [PASTE]\nProblem Statement: [PASTE]\nTarget Users: [PASTE]\nRACI: [PASTE]\n\n## 1. Executive Summary\n## 2. Business Objectives (SMART)\n## 3. Stakeholder Register\n## 4. AS-IS Process\n## 5. TO-BE Process\n## 6. Functional Requirements (FR-### with MoSCoW)\n## 7. Non-Functional Requirements (NFR-### grouped by category)\n## 8. Constraints & Assumptions\n## 9. Out of Scope\n## 10. Glossary`
  },
  {
    id: "functionality", label: "2. Functionality", color: "#1D9E75", light: "#E1F5EE", border: "#0F6E56", icon: "⚙️",
    tagline: "Define what the product does",
    description: "Decompose requirements into epics, stories, features, tasks, acceptance criteria, and a full traceability matrix.",
    artifacts: [
      { name: "BRD", desc: "Complete requirements specification", format: "Markdown",
        prompt: `Generate a full BRD from Concept artefacts.\n\nInputs: [PASTE]\n\n## 1. Executive Summary\n## 2. Business Objectives (SMART)\n## 3. Stakeholder Register\n## 4. AS-IS Process\n## 5. TO-BE Process\n## 6. Functional Requirements (FR-### with MoSCoW)\n## 7. Non-Functional Requirements (NFR-### by category)\n## 8. Constraints & Assumptions\n## 9. Out of Scope\n## 10. Glossary` },
      { name: "AS-IS / TO-BE Flows", desc: "Process flows before and after product", format: "Mermaid",
        prompt: `From BRD, generate AS-IS and TO-BE process flows in Mermaid.\n\nBRD: [PASTE]\n\nFor each major user journey:\n### AS-IS\n\`\`\`mermaid\nflowchart TD\n  A[Start] --> B[Step] --> C{Decision}\n\`\`\`\n### TO-BE (annotate automated steps 🤖, eliminated steps struck)` },
      { name: "Epics", desc: "Large capability groupings", format: "YAML",
        prompt: `From BRD, define Epics as YAML.\n\nepics:\n  - id: EP-001\n    title: \"\"\n    objective: \"Linked to Business Objective #\"\n    linked_requirements: [FR-001]\n    user_value: \"\"\n    priority: Must Have|Should Have|Could Have|Won't Have\n    size: XS|S|M|L|XL\n    release: MVP|v1.1|v2.0\n    dependencies: []` },
      { name: "User Stories", desc: "As a [user], I want [goal], so that [benefit]", format: "YAML",
        prompt: `For each Epic, generate 3-5 User Stories.\n\nEpics: [PASTE]\nPersonas: [PASTE]\n\nuser_stories:\n  - id: US-001\n    epic: EP-001\n    persona: \"\"\n    story: \"As a [persona], I want [goal] so that [benefit]\"\n    acceptance_criteria:\n      - \"Given [context] When [action] Then [outcome]\"\n    story_points: 1|2|3|5|8\n    priority: High|Medium|Low\n    dependencies: []` },
      { name: "Features", desc: "Discrete shippable capabilities", format: "YAML",
        prompt: `Group User Stories into Features.\n\nfeatures:\n  - id: FT-001\n    name: \"\"\n    description: \"\"\n    user_stories: [US-001]\n    ui_components: []\n    api_endpoints: []\n    business_rules: [BR-001]\n    entities: []\n    status: Planned\n    mvp: true|false` },
      { name: "Tasks", desc: "Developer work items ≤ 8 hours", format: "YAML",
        prompt: `Break Features into Tasks (≤ 8 hours each).\n\ntasks:\n  - id: TK-001\n    feature: FT-001\n    title: \"\"\n    type: frontend|backend|database|infra|testing|devops\n    description: \"\"\n    estimate_hours: 1-8\n    dependencies: []\n    definition_of_done:\n      - Code reviewed\n      - Tests written\n      - Deployed to staging` },
      { name: "Acceptance Criteria", desc: "Gherkin testable conditions per story", format: "Gherkin",
        prompt: `For each User Story, write Acceptance Criteria in Gherkin.\n\nUser Stories: [PASTE]\n\nFeature: [Name]\n  @smoke @US-001\n  Scenario: [Happy path]\n    Given [precondition]\n    When [action]\n    Then [outcome]\n  @regression\n  Scenario: [Edge case]\n    Given ...\n\nCover: happy path, edge cases, invalid inputs, auth, empty states.` },
      { name: "Requirements Traceability Matrix", desc: "FR → Epic → Story → Feature → Task → Test", format: "Markdown table",
        prompt: `Generate a full RTM from all Functionality artefacts.\n\nInputs: [PASTE ALL]\n\n| FR ID | Objective | Epic | Story | Feature | Tasks | Test Scenarios | Status |\n|---|---|---|---|---|---|---|---|\n\nFlag orphaned requirements and stories without FRs.` },
      { name: "MVP Scope Definition", desc: "MVP boundary with rationale", format: "Markdown",
        prompt: `From Epics, Features, and NSM, define MVP scope.\n\nInputs: [PASTE]\n\n## MVP Statement\n## Included (with rationale)\n## Excluded (with reason, risk, when to revisit)\n## MVP Success Criteria\n## Launch Criteria Checklist\n## Post-MVP Roadmap` }
    ],
    claudeFiles: ["glossary.md", "spec-template.md", "open-decisions.md"],
    claudePrompt: `From the Functionality stage artefacts below, generate the following AI session files. Output each separately.\n\nBRD: [PASTE]\nEpics YAML: [PASTE]\nUser Stories YAML: [PASTE]\nFeatures YAML: [PASTE]\nAcceptance Criteria (Gherkin): [PASTE]\nRTM: [PASTE]\nMVP Scope: [PASTE]\n\n### FILE: context/glossary.md\n[Update: add all entity names, feature names, business terms from BRD Glossary section. Add all identifier schemes to the ID table.]\n\n### FILE: specs/FT-001.md (generate one per feature — repeat this template for each FT-###)\n[Fill the spec template: source IDs, what it does, what it does NOT, paste Gherkin ACs, list API endpoints, data entities, UI components, business rules from the relevant Feature YAML row]\n\n### FILE: decisions/open-decisions.md\n[Seed with any decisions flagged as PENDING in the BRD constraints section or Epics dependencies. Format: OD-001, decision, options, blocking feature, owner, due date]`,
    outputArtifacts: ["BRD","AS-IS/TO-BE Flows","Epics","User Stories","Features","Tasks","Acceptance Criteria","RTM","MVP Scope"],
    transitionPrompt: `You are a data architect. From BRD, User Stories, and Features, identify all data entities, attributes, relationships, and business rules.\n\nInputs: [PASTE]\n\n## Entities (name, type, description)\n## Attributes per entity (name, type, nullable, unique, PII flag)\n## Relationships (entity_a, cardinality, entity_b, FK, on_delete)\n## Business Rules (BR-### plain English + entities + type)\n## Data Classification (PII, sensitive, public)\n## Audit Requirements`
  },
  {
    id: "data", label: "3. Data", color: "#D85A30", light: "#FAECE7", border: "#993C1D", icon: "🗄️",
    tagline: "Model the information",
    description: "Design the complete data layer with entities, relationships, governance, ER diagrams, schema, and SQL scripts.",
    artifacts: [
      { name: "Entities & Attributes", desc: "Data objects with PII classification", format: "YAML",
        prompt: `Extract all Entities and Attributes from BRD and User Stories.\n\nentities:\n  - name: \"\"\n    type: core|reference|transactional|audit\n    primary_key: {column: id, type: UUID, strategy: gen_random_uuid()}\n    attributes:\n      - {name: \"\", type: \"\", nullable: false, unique: false, pii: false, description: \"\"}\n    indexes: []\n    audit: {created_at: true, updated_at: true, deleted_at: true}\n    soft_delete: true` },
      { name: "Relationships", desc: "Entity associations with referential integrity", format: "YAML",
        prompt: `From Entities, define all Relationships.\n\nrelationships:\n  - name: \"\"\n    entity_a: \"\"\n    entity_b: \"\"\n    cardinality: \"1:N\"\n    fk_column: \"\"\n    on_delete: CASCADE|SET NULL|RESTRICT\n    business_rule: BR-###` },
      { name: "Business Rules", desc: "Domain constraints and integrity rules", format: "Markdown table",
        prompt: `From BRD and Entities, define all Business Rules.\n\n| ID | Name | Description | Entities | Type | Implementation | FR Link |\n|---|---|---|---|---|---|---|\n\nCover: uniqueness, referential integrity, state machines, computed fields, access rules.` },
      { name: "Data Dictionary", desc: "Human-readable reference for every field", format: "Markdown table",
        prompt: `From all Entities & Attributes, generate a Data Dictionary.\n\n| Entity | Column | Type | Nullable | Unique | Default | PII | Description | Allowed Values | Example |\n|---|---|---|---|---|---|---|---|---|---|\n\nOne row per attribute. Add PII handling policy legend.` },
      { name: "Data Flow Diagram", desc: "How data moves through the system", format: "Mermaid",
        prompt: `From Features and Entities, generate DFDs.\n\nLevel 0 (context):\n\`\`\`mermaid\nflowchart LR\n  User([User]) --> System[[Product]]\n  System --> DB[(Database)]\n\`\`\`\n\nLevel 1 (per major process): one flowchart per feature area. Label every arrow with data type.` },
      { name: "Data Governance & Compliance", desc: "GDPR, retention, classification, audit policy", format: "Markdown",
        prompt: `From Data Dictionary and Business Rules, produce Data Governance doc.\n\nTarget Regions: [PASTE]\n\n## Data Classification Tiers\n## PII Inventory (entity, column, legal basis, retention)\n## Retention Policy\n## Anonymisation Strategy\n## Consent Management\n## Data Subject Rights\n## Audit Log Requirements\n## Breach Response` },
      { name: "ER Diagram", desc: "Visual entity-relationship diagram", format: "Mermaid erDiagram",
        prompt: `From Entities and Relationships, generate Mermaid erDiagram.\n\nerDiagram\n  USERS {\n    uuid id PK\n    varchar email\n    timestamp created_at\n    timestamp deleted_at\n  }\n  ORDERS {\n    uuid id PK\n    uuid user_id FK\n  }\n  USERS ||--o{ ORDERS : \"places\"` },
      { name: "Schema (DDL)", desc: "Production-ready PostgreSQL DDL", format: "SQL",
        prompt: `From ER Diagram and Business Rules, generate PostgreSQL DDL.\n\nCREATE TABLE table_name (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  CONSTRAINT fk_name FOREIGN KEY (col) REFERENCES table(id) ON DELETE CASCADE,\n  CONSTRAINT chk_name CHECK (condition)\n);\nCREATE INDEX idx_name ON table(col);\nCOMMENT ON TABLE table_name IS '...';\n\nEnd with: audit trigger + soft-delete view.` },
      { name: "SQL Scripts", desc: "Migrations, seeds, and operational queries", format: "SQL",
        prompt: `From Schema DDL, generate SQL scripts.\n\n1. Migration (V001__init.sql with UP and DOWN)\n2. Reference data seeds\n3. Audit trigger (auto-update updated_at)\n4. Soft-delete trigger + view\n5. 5 critical query patterns\n6. Stored procedure for most complex BR\n7. Rollback script` }
    ],
    claudeFiles: ["glossary.md", "security.md"],
    claudePrompt: `From the Data stage artefacts below, generate the following AI session files. Output each separately.\n\nEntities YAML: [PASTE]\nRelationships YAML: [PASTE]\nBusiness Rules: [PASTE]\nData Dictionary: [PASTE]\nData Governance: [PASTE]\nSchema DDL: [PASTE]\n\n### FILE: context/glossary.md\n[Update: add every entity name, attribute name, and business term from Data Dictionary to the core terms table. Add data classification tiers as defined terms.]\n\n### FILE: rules/security.md\n[Fill S-03 (PII handling) from Data Governance PII Inventory. Fill S-06 (retention) from Retention Policy. Fill S-07 (audit logging) from Audit Log Requirements. Fill S-08 threat mitigations from Data Governance breach response section. Keep all other rules as stubs to be filled in Stage 4.]`,
    outputArtifacts: ["Entities & Attributes","Relationships","Business Rules","Data Dictionary","Data Flow Diagram","Data Governance","ER Diagram","Schema","SQL Scripts"],
    transitionPrompt: `You are a solutions architect. From BRD NFRs, Features, Data Model, and Compliance requirements, recommend a complete tech stack.\n\nInputs: [PASTE ALL DATA ARTEFACTS + NFRs]\n\nFor each layer:\n## Frontend: framework, language, UI library, state management, testing\n## Backend: language, framework, API style, auth strategy, background jobs\n## Database: primary DB, cache, search, file storage, message queue\n## Infrastructure: cloud, containers, orchestration, CDN, monitoring, secrets\n\nFor each choice:\n- selected, alternatives_considered, justification (reference NFRs), trade_offs, version_and_license`
  },
  {
    id: "techstack", label: "4. Tech Stack", color: "#D4537E", light: "#FBEAF0", border: "#993556", icon: "🛠️",
    tagline: "Choose and document the right tools",
    description: "Select stack with full justification, produce ADRs, infrastructure diagram, threat model, and all design-time technical diagrams.",
    artifacts: [
      { name: "Tech Stack Decision", desc: "Layer-by-layer selection with NFR justification", format: "YAML",
        prompt: `From NFRs, Features, and Data Model, produce Tech Stack Decision.\n\ntech_stack:\n  frontend: {selected: \"\", alternatives: [], justification: \"\", trade_offs: \"\", license: \"\"}\n  backend: {}\n  database: {primary: {}, cache: {}, search: {}, file_storage: {}}\n  infrastructure: {cloud: {}, containerisation: {}, orchestration: {}, monitoring: {}}` },
      { name: "ADRs", desc: "One Architecture Decision Record per key decision", format: "Markdown (MADR)",
        prompt: `From Tech Stack Decision, generate one ADR per major choice.\n\n# ADR-001: [Title]\n## Status: Accepted\n## Date: YYYY-MM-DD\n## Context\n## Decision\n## Consequences\n### Positive\n### Negative\n### Risks\n## Alternatives Considered\n## Links\n\nGenerate ADRs for: frontend, backend, database, auth, API style, deployment, observability.` },
      { name: "Infrastructure Diagram", desc: "Network topology, VPC, and data flows", format: "Mermaid",
        prompt: `From Tech Stack, generate Infrastructure Diagram in Mermaid.\n\n\`\`\`mermaid\nflowchart TB\n  subgraph VPC\n    LB[Load Balancer]\n    API[API Service]\n    DB[(Database)]\n    Cache[(Cache)]\n  end\n  User --> LB --> API --> DB\n\`\`\`\n\nAnnotate: instance types, replication, security boundaries, data flow labels.` },
      { name: "Threat Model", desc: "STRIDE-based security risk assessment", format: "Markdown table",
        prompt: `From Infrastructure Diagram and Data Classification, produce STRIDE Threat Model.\n\n| Asset | Threat | Category | Vector | Likelihood | Impact | Risk | Mitigation | Owner |\n|---|---|---|---|---|---|---|---|---|\n\nIdentify ≥ 10 threats. End with Security Controls Checklist.` },
      { name: "Integration Map", desc: "All internal and external integrations", format: "YAML",
        prompt: `From Tech Stack and Features, map all integrations.\n\nintegrations:\n  - name: \"\"\n    type: internal|external|third_party\n    direction: inbound|outbound|bidirectional\n    protocol: REST|gRPC|Webhook|Event\n    auth: API_KEY|OAuth2|JWT\n    rate_limit: \"\"\n    failure_strategy: retry|fallback|circuit_breaker|dead_letter` },
      { name: "Use Case Diagrams", desc: "Actor-system interactions per module", format: "PlantUML",
        prompt: `From User Stories and Features, generate PlantUML Use Case diagrams (one per module).\n\n@startuml [Module]\nleft to right direction\nactor \"[Persona]\" as user\nrectangle \"[Module]\" {\n  usecase \"[name]\" as UC1\n}\nuser --> UC1\n@enduml` },
      { name: "Class Diagrams", desc: "Domain model and service layer design", format: "Mermaid classDiagram",
        prompt: `From Entities and Features, generate Mermaid class diagrams.\n\nclassDiagram\n  class User {\n    +UUID id\n    +String email\n    +create() User\n  }\n  class UserService {\n    -UserRepository repo\n    +register(dto) User\n  }\n  UserService --> UserRepository\n\nInclude: model, service, repository, controller layers.` },
      { name: "Sequence Diagrams", desc: "Interaction flows for key scenarios", format: "Mermaid sequenceDiagram",
        prompt: `For each critical User Story, generate a Mermaid sequence diagram.\n\nsequenceDiagram\n  participant Client\n  participant API\n  participant DB\n  Client->>API: POST /endpoint\n  API->>DB: INSERT\n  DB-->>API: result\n  API-->>Client: 201 Created\n  alt Error\n    API-->>Client: 422\n  end\n\nGenerate: happy path, error path, auth flow, async event flow.` },
      { name: "API Specifications (OpenAPI 3.1)", desc: "Complete machine-readable API contract", format: "OpenAPI YAML",
        prompt: `From Features, Sequence Diagrams, and Entities, generate OpenAPI 3.1 YAML.\n\nopenapi: 3.1.0\ninfo: {title: \"\", version: 1.0.0}\npaths:\n  /resources:\n    get:\n      summary: \"\"\n      parameters: [{name: page, in: query}]\n      responses:\n        \"200\":\n          content:\n            application/json:\n              schema: {$ref: \"#/components/schemas/PaginatedResource\"}\ncomponents:\n  schemas:\n    Error: {type: object, properties: {code: {type: string}, message: {type: string}}}\n  securitySchemes:\n    bearerAuth: {type: http, scheme: bearer, bearerFormat: JWT}\n\nCover all CRUD + domain actions. Include pagination, filtering, error schemas.` }
    ],
    claudeFiles: ["architecture.md", "engineering.md", "security.md", "open-decisions.md"],
    claudePrompt: `From the Tech Stack stage artefacts below, generate the following AI session files. Output each separately.\n\nTech Stack Decision YAML: [PASTE]\nADRs: [PASTE ALL]\nInfrastructure Diagram: [PASTE]\nThreat Model: [PASTE]\nIntegration Map YAML: [PASTE]\nOpenAPI Spec: [PASTE]\n\n### FILE: context/architecture.md\n[Fill ALL sections: overview from Infrastructure Diagram description, one component entry per service in Tech Stack, technology stack table from Tech Stack Decision, data model section referencing Stage 3 ER Diagram, ADR list with links]\n\n### FILE: rules/engineering.md\n[Fill E-01 (cost) from Tech Stack Decision cost notes, E-05 (secrets) from ADR on secrets management, E-06 (performance) from NFRs, E-07 (API contract) referencing OpenAPI spec filename, E-08 (DB migrations) referencing SQL Scripts]\n\n### FILE: rules/security.md\n[Complete S-01 through S-08: S-01 from RBAC ADR, S-02 from Threat Model data isolation threat, S-03 from Data Governance PII, S-04 from auth ADR, S-05 from Threat Model transport threats, S-06 from retention policy, S-07 from audit schema, S-08 paste mitigations from Threat Model]\n\n### FILE: decisions/open-decisions.md\n[Move any decisions now LOCKED by ADRs from PENDING to LOCKED section. Add any new PENDING decisions surfaced during Tech Stack selection.]`,
    outputArtifacts: ["Tech Stack Decision","ADRs","Infrastructure Diagram","Threat Model","Integration Map","Use Case Diagrams","Class Diagrams","Sequence Diagrams","API Specifications"],
    transitionPrompt: `You are a UX lead. From User Stories, Features, API Spec, Tech Stack, and Personas, define the complete design specification.\n\nInputs: [PASTE]\n\n## Design Tokens\n## Component Inventory (name, props, states, accessibility)\n## Screen / Page Map (route → screen → features → components)\n## User Journey Maps (per persona: steps + emotion)\n## Interaction Patterns\n## Accessibility Requirements (WCAG 2.2 AA)\n## Content Strategy`
  },
  {
    id: "design", label: "5. Design", color: "#BA7517", light: "#FAEEDA", border: "#854F0B", icon: "🎨",
    tagline: "Shape the user experience",
    description: "Translate features into design system, journey maps, wireframes, accessibility checklist, and content strategy.",
    artifacts: [
      { name: "Design System", desc: "Tokens, components, and patterns", format: "Markdown",
        prompt: `From User Stories and frontend Tech Stack, define the Design System.\n\n## Colour Tokens (token name, value, usage)\n## Typography Scale\n## Spacing (4px base)\n## Component Inventory (name, props, states, a11y)\n## Motion Guidelines\n## Iconography\n## Storybook documentation approach` },
      { name: "User Journey Maps", desc: "End-to-end experience per persona with emotional arc", format: "Markdown table",
        prompt: `From Target Users and User Stories, generate User Journey Maps.\n\nFor each persona:\n## Journey: [Goal] — [Persona]\n| Phase | Step | Action | Touchpoint | Emotion | Pain | Opportunity |\n|---|---|---|---|---|---|---|\n\nEmotions: 😊 😐 😟. Cover: awareness → onboarding → core task → success → return.` },
      { name: "Screen / Page Map", desc: "Route → screen → component hierarchy", format: "YAML",
        prompt: `From User Stories, Features, and API Spec, generate Screen Map.\n\nscreens:\n  - route: /dashboard\n    name: Dashboard\n    roles: [authenticated_user]\n    features: [FT-001]\n    components: [Header, StatsCard]\n    api_calls: [GET /metrics]\n    auth_required: true\n    states: {loading: SkeletonLoader, empty: EmptyState, error: ErrorBanner}\n    analytics_events: [page_view]` },
      { name: "Wireframe Specifications", desc: "Layout and content spec per screen", format: "Markdown",
        prompt: `For each screen in the Screen Map, write a Wireframe Spec.\n\n## [Screen Name] — /route\n### Layout\n### Zones (component, data source, behaviour)\n### Interactions\n### Responsive (mobile < 768px, tablet 768–1024px)\n### Edge States (loading, empty, error)\n### Handoff Notes` },
      { name: "Accessibility Checklist", desc: "WCAG 2.2 AA compliance per screen", format: "Markdown checklist",
        prompt: `From Screen Map and Design System, generate WCAG 2.2 AA Accessibility Checklist.\n\nFor each screen:\n## Perceivable\n- [ ] All images have alt text\n- [ ] Colour contrast ≥ 4.5:1\n## Operable\n- [ ] Keyboard navigable\n- [ ] Focus indicator visible\n## Understandable\n- [ ] Error messages describe fix\n## Robust\n- [ ] Valid semantic HTML\n- [ ] ARIA roles used correctly` },
      { name: "Content Strategy", desc: "Tone, copy patterns, and error library", format: "Markdown",
        prompt: `From Concept Note and Target Users, produce a Content Strategy.\n\n## Brand Voice (3-4 attributes with do/don't)\n## Writing Principles\n## UI Copy Patterns\n| Element | Pattern | Example |\n## Error Message Library\n| Error type | Message | Recovery action |\n## Empty State Copy\n## Success Messages\n## i18n Considerations` }
    ],
    claudeFiles: ["engineering.md", "current.md"],
    claudePrompt: `From the Design stage artefacts below, generate the following AI session files. Output each separately.\n\nDesign System: [PASTE]\nScreen Map YAML: [PASTE]\nAccessibility Checklist: [PASTE]\nContent Strategy: [PASTE]\nUser Journey Maps: [PASTE]\n\n### FILE: rules/engineering.md\n[Update Rule E-06: add UI performance targets from Design System (animation budgets, interaction response times). Add Rule E-09: Design system compliance — all UI must use tokens from Design System, no one-off styles.]\n\n### FILE: rules/product.md (create if not exists)\n[Fill: P-01 from Design System consistency rule, P-02 from Content Strategy voice attributes and do/don't examples, P-03 simplicity rule from User Journey Map pain points, P-04 from Accessibility Checklist WCAG level.]\n\n### FILE: state/current.md\n[Update: active phase = Stage 5 Design complete / Stage 6 Build starting. List screens and components ready for development. List any open design questions.]`,
    outputArtifacts: ["Design System","User Journey Maps","Screen Map","Wireframe Specs","Accessibility Checklist","Content Strategy"],
    transitionPrompt: `You are a senior engineering lead. From all prior artefacts, produce a comprehensive Build Plan.\n\nInputs: Tasks, Tech Stack, API Spec, Schema, Screen Map, Infrastructure Diagram, Threat Model, NFRs [PASTE ALL]\n\n## Test Strategy\n## Observability Plan (SLI/SLO, RED metrics, alerting)\n## Sprint Plan (2-week sprints)\n## Definition of Done\n## Environment Setup\n## CI/CD Pipeline stages\n## Cost Estimate\n## Launch Checklist`
  },
  {
    id: "build", label: "6. Build", color: "#378ADD", light: "#E6F1FB", border: "#185FA5", icon: "🚀",
    tagline: "Construct, test, and ship",
    description: "Execute the build with test strategy, observability, CI/CD, cost estimation, and a production launch checklist.",
    artifacts: [
      { name: "Test Strategy", desc: "Full testing approach across all layers", format: "Markdown",
        prompt: `From NFRs, Tech Stack, and Acceptance Criteria, generate Test Strategy.\n\n## Test Pyramid\n| Level | Tool | Coverage Target | Environment | Owner |\n|---|---|---|---|---|\n\n## Test Data Strategy\n## Performance Benchmarks\n## Security Testing (OWASP)\n## Accessibility Testing\n## UAT Process and Sign-off` },
      { name: "Observability Plan", desc: "Logs, metrics, traces, and alerting", format: "Markdown / YAML",
        prompt: `From Tech Stack, NFRs, and Infrastructure Diagram, produce Observability Plan.\n\n## SLI / SLO Definitions\n| Service | SLI | SLO | Error Budget |\n\n## Logging (structured JSON fields)\n## Metrics (RED method per service)\n| Metric | Type | Labels | Alert Threshold |\n\n## Distributed Tracing (spans, sampling)\n## Alerting Rules\n## Dashboard Spec` },
      { name: "Sprint Plan", desc: "Iterative delivery roadmap", format: "YAML",
        prompt: `From Tasks and MVP Scope, create Sprint Plan.\n\nsprints:\n  - sprint: 1\n    goal: \"\"\n    dates: \"YYYY-MM-DD to YYYY-MM-DD\"\n    tasks: [TK-001]\n    story_points: 0\n    risks: \"\"\n    definition_of_done:\n      - All tests passing\n      - PR reviewed\n      - Deployed to staging\n      - Demo recorded` },
      { name: "Environment Setup", desc: "Local, staging, production configuration", format: "Markdown",
        prompt: `From Tech Stack and Schema, generate Environment Setup guide.\n\n## Prerequisites (tools + exact versions)\n## Repository & Branch Strategy\n## Environment Variables (.env.example)\n## Local Dev (docker compose up commands)\n## Staging Setup\n## Production Setup\n## Secrets Management\n## Common Issues Runbook` },
      { name: "CI/CD Pipeline", desc: "Automated build, test, scan, deploy workflow", format: "GitHub Actions YAML",
        prompt: `From Tech Stack, generate GitHub Actions CI/CD pipeline.\n\nStages: lint → unit tests → integration tests → build image → security scan (Trivy) → deploy staging → E2E smoke tests → manual approval → deploy production → health check → Slack notify\n\nInclude: dependency caching, matrix testing, rollback job.` },
      { name: "Cost Estimate", desc: "Cloud resource sizing and monthly spend model", format: "Markdown table",
        prompt: `From Infrastructure Diagram and Tech Stack, generate Cloud Cost Estimate.\n\n| Resource | Service | Size | Qty | Unit Cost | Monthly |\n|---|---|---|---|---|---|\n\n## MVP Total\n## Scaled (10x) Total\n## Cost Optimisation Recommendations` },
      { name: "Launch Checklist", desc: "T-7 to post-launch 30 day milestones", format: "Markdown checklist",
        prompt: `From all artefacts, generate Launch Checklist.\n\n## T-7 Days\n- [ ] Infrastructure provisioned\n- [ ] Security controls implemented\n- [ ] Load test results meet NFRs\n## T-1 Day\n- [ ] Rollback plan tested\n- [ ] Monitoring live\n- [ ] Stakeholder sign-off\n## Launch Day\n- [ ] Canary rollout (10%→50%→100%)\n## Post-Launch (24h / 72h / 7d / 30d)` }
    ],
    claudeFiles: ["testing.md", "current.md", "open-decisions.md"],
    claudePrompt: `From the Build stage artefacts below, generate the following AI session files. Output each separately.\n\nTest Strategy: [PASTE]\nObservability Plan: [PASTE]\nSprint Plan YAML: [PASTE]\nEnvironment Setup: [PASTE]\nCI/CD Pipeline YAML: [PASTE]\nCost Estimate: [PASTE]\n\n### FILE: rules/testing.md\n[Fill ALL sections: T-02 test tiers table from Test Strategy pyramid, T-04 coverage requirements from Test Strategy UAT section and Acceptance Criteria list, T-06 performance benchmarks from NFRs and Test Strategy load test thresholds]\n\n### FILE: state/current.md\n[Update: active phase = Stage 6 Build / Sprint 1. List first sprint tasks by ID. List environment setup status. List any blocked items from open-decisions.md]\n\n### FILE: decisions/open-decisions.md\n[Lock any remaining PENDING decisions that were resolved during Build planning. Add any new PENDING items from Cost Estimate or Environment Setup that need owner sign-off]`,
    outputArtifacts: ["Test Strategy","Observability Plan","Sprint Plan","Environment Setup","CI/CD Pipeline","Cost Estimate","Launch Checklist"],
    transitionPrompt: `You are the PM and engineering lead for post-launch ops. From Observability Plan, NSM, and Launch Checklist outcomes, set up the Operate stage.\n\nInputs: [PASTE]\n\n## Monitoring Dashboard Spec\n## Incident Response Runbook\n## Feedback Loop Process\n## Iteration Backlog Process\n## Tech Debt Register\n## Deprecation & Versioning Policy`
  },
  {
    id: "operate", label: "7. Operate", color: "#3B6D11", light: "#EAF3DE", border: "#27500A", icon: "📡",
    tagline: "Monitor, learn, and iterate",
    description: "Production health, incident management, feedback loops, and long-term technical sustainability.",
    artifacts: [
      { name: "Monitoring Dashboard Spec", desc: "Key panels, thresholds, and owners", format: "YAML",
        prompt: `From Observability Plan and SLI/SLO, specify Monitoring Dashboards.\n\ndashboards:\n  - name: API Service\n    panels:\n      - title: Request Rate\n        metric: http_requests_total\n        visualization: timeseries\n        alert_threshold: \"0 rps = critical\"\n        severity: P1\n        owner: backend-team\n        runbook: /runbooks/api-down\n\nCover: request rate, error rate, latency p50/p95/p99, DB query time, cache hit rate, queue depth, NSM.` },
      { name: "Incident Response Runbook", desc: "Severity, escalation, comms, and post-mortem", format: "Markdown",
        prompt: `From Observability Plan and Tech Stack, produce Incident Response Runbook.\n\n## Severity Definitions (P1-P4 with response SLAs)\n## Detection & Alert Sources\n## Initial Response Checklist (first 15 min)\n## Escalation Matrix\n## Customer Comms Templates\n## Resolution Verification\n## Post-Mortem Template\n## On-Call Schedule Format` },
      { name: "Feedback Loop Process", desc: "Capturing and acting on user feedback", format: "Markdown",
        prompt: `From NSM, Target Users, and Screen Map, define Feedback Loop Process.\n\n## Feedback Channels\n| Channel | Tool | Cadence | Owner |\n\n## Tagging Taxonomy\n## Prioritisation (RICE/ICE)\n## Feedback → Backlog Pipeline\n## Interview Schedule\n## Analytics Review Cadence\n## NSM Review and OKR Alignment` },
      { name: "Iteration Backlog Process", desc: "How post-launch learning re-enters development", format: "Markdown",
        prompt: `From Change Request Process and RTM, define Iteration Backlog Process.\n\n## Triggers for New Iteration\n## Artefact Update Map\n| Change Type | Artefacts to Update | CR Required? |\n\n## Mini Discovery for New Features\n## Regression Scope per Change Type\n## Version Bump Criteria\n## Release Notes Template` },
      { name: "Tech Debt Register", desc: "Tracked debt with prioritisation and payoff plan", format: "Markdown table",
        prompt: `From ADRs and Sprint retrospectives, initialise Tech Debt Register.\n\n| ID | Title | Area | Discovered | Severity | Effort | Impact | Target Sprint | Owner |\n|---|---|---|---|---|---|---|---|---|\n\nSeed ≥ 5 items from ADR trade-offs. Add: priority score = Severity × Impact / Effort.` },
      { name: "Deprecation & Versioning Policy", desc: "API versioning and end-of-life process", format: "Markdown",
        prompt: `From API Spec and Tech Stack, define Deprecation Policy.\n\n## API Versioning Strategy\n## Semantic Versioning Rules (MAJOR/MINOR/PATCH)\n## Deprecation Timeline (announce → deprecate header → sunset)\n## Sunset Communication\n## Migration Guide Template\n## DB Schema Breaking Change Policy` }
    ],
    claudeFiles: ["current.md", "open-decisions.md"],
    claudePrompt: `From the Operate stage artefacts below, generate the following AI session files. Output each separately.\n\nMonitoring Dashboard Spec: [PASTE]\nIncident Response Runbook: [PASTE]\nFeedback Loop Process: [PASTE]\nIteration Backlog Process: [PASTE]\nTech Debt Register: [PASTE]\nDeprecation Policy: [PASTE]\n\n### FILE: state/current.md\n[Update: active phase = Stage 7 Operate. List current sprint or maintenance window. List top 3 tech debt items by priority score. List top 3 feedback items in backlog. List any P1/P2 incidents open.]\n\n### FILE: decisions/open-decisions.md\n[Add any new PENDING decisions surfaced from feedback or tech debt — e.g. library upgrades, infrastructure changes, deprecation timelines. Lock any resolved items.]\n\n### FILE: playbooks/incident-response.md\n[Paste the Incident Response Runbook directly — this is the AI-readable version used during live incidents. Ensure severity definitions and escalation matrix are at the top.]`,
    outputArtifacts: ["Monitoring Dashboard Spec","Incident Response Runbook","Feedback Loop Process","Iteration Backlog Process","Tech Debt Register","Deprecation & Versioning Policy"]
  }
];

const FILE_COLORS = {
  "CLAUDE.md": "#534AB7", "product.md": "#1D9E75", "architecture.md": "#D85A30",
  "glossary.md": "#D4537E", "engineering.md": "#BA7517", "testing.md": "#378ADD",
  "security.md": "#3B6D11", "current.md": "#888780", "open-decisions.md": "#E85D24",
  "spec-template.md": "#1D9E75"
};

export default function App() {
  const [activeStage, setActiveStage] = useState(0);
  const [activeTab, setActiveTab] = useState("artefacts");
  const [activeArtifact, setActiveArtifact] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showAllArtifacts, setShowAllArtifacts] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  const stage = stages[activeStage];

  function copy(text, id) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    });
  }

  function download(filename, content) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  const totalArtifacts = stages.reduce((a, s) => a + s.artifacts.length, 0);

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", paddingBottom: "2rem" }}>
      {/* Header */}
      <div style={{ padding: "1.25rem 1.5rem 1rem", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Product Development Framework v3</div>
        <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>Dual output — artefacts + AI session files</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["8 stages", "#534AB7"], [`${totalArtifacts} artefacts`, "#1D9E75"], ["10 CLAUDE files", "#D85A30"], ["Download ready", "#D4537E"]].map(([l, c]) => (
            <span key={l} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, border: `0.5px solid ${c}`, color: c, background: "transparent" }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Stage tabs */}
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "0.5px solid var(--color-border-tertiary)", scrollbarWidth: "none" }}>
        {stages.map((s, i) => (
          <button key={s.id} onClick={() => { setActiveStage(i); setActiveArtifact(null); setActiveFile(null); setActiveTab("artefacts"); setShowTransition(false); }}
            style={{ flex: "0 0 auto", padding: "9px 14px", border: "none", borderBottom: i === activeStage ? `2px solid ${s.color}` : "2px solid transparent", background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: i === activeStage ? 500 : 400, color: i === activeStage ? s.color : "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Stage header */}
      <div style={{ padding: "1rem 1.5rem", background: stage.light, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: stage.border, marginBottom: 3 }}>{stage.tagline}</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 10 }}>{stage.description}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 11, color: stage.border }}>{stage.artifacts.length} artefacts</span>
          <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>·</span>
          <span style={{ fontSize: 11, color: stage.border }}>{stage.claudeFiles.length} AI session files</span>
        </div>
      </div>

      {/* Output type tabs */}
      <div style={{ display: "flex", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "0 1.5rem" }}>
        {[["artefacts", "📄 Artefacts"], ["aifiles", "🤖 AI Session Files"]].map(([tab, label]) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setActiveArtifact(null); setActiveFile(null); }}
            style={{ padding: "10px 16px", border: "none", borderBottom: tab === activeTab ? `2px solid ${stage.color}` : "2px solid transparent", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: tab === activeTab ? 500 : 400, color: tab === activeTab ? stage.color : "var(--color-text-secondary)" }}>
            {label}
          </button>
        ))}
      </div>

      {/* ARTEFACTS TAB */}
      {activeTab === "artefacts" && (
        <div style={{ padding: "1rem 1.5rem 0" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Generation prompts — {stage.artifacts.length} artefacts
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {stage.artifacts.map((art, ai) => (
              <div key={ai}>
                <div onClick={() => setActiveArtifact(activeArtifact === ai ? null : ai)}
                  style={{ background: "var(--color-background-primary)", border: `0.5px solid ${activeArtifact === ai ? stage.color : "var(--color-border-tertiary)"}`, borderRadius: 9, padding: "9px 13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: stage.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{art.name}</div>
                      <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{art.desc} · <span style={{ color: "var(--color-text-tertiary)" }}>{art.format}</span></div>
                    </div>
                  </div>
                  <span style={{ fontSize: 14, color: "var(--color-text-secondary)", transform: activeArtifact === ai ? "rotate(180deg)" : "none", transition: "transform .2s", display: "inline-block" }}>⌄</span>
                </div>
                {activeArtifact === ai && (
                  <div style={{ border: `0.5px solid ${stage.color}`, borderTop: "none", borderRadius: "0 0 9px 9px", padding: "12px", background: "var(--color-background-secondary)" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
                      <button onClick={() => copy(art.prompt, `art-${ai}`)}
                        style={{ fontSize: 11, padding: "3px 9px", border: `0.5px solid ${stage.color}`, borderRadius: 5, background: "transparent", color: stage.color, cursor: "pointer" }}>
                        {copiedId === `art-${ai}` ? "✓ Copied" : "Copy prompt"}
                      </button>
                    </div>
                    <pre style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 7, padding: 10, fontSize: 10, lineHeight: 1.6, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", color: "var(--color-text-secondary)", margin: 0, fontFamily: "var(--font-mono)" }}>
                      {art.prompt}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Transition prompt */}
          {stage.transitionPrompt && (
            <div style={{ marginTop: 12 }}>
              <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: 9, overflow: "hidden" }}>
                <div onClick={() => setShowTransition(!showTransition)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 13px", cursor: "pointer", background: showTransition ? stage.light : "var(--color-background-primary)", userSelect: "none" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: stage.color }}>Stage transition → {activeStage < stages.length - 1 ? stages[activeStage + 1].label : "complete"}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Converts this stage's artefacts into next stage inputs</div>
                  </div>
                  <span style={{ fontSize: 14, color: "var(--color-text-secondary)", transform: showTransition ? "rotate(180deg)" : "none", transition: "transform .2s", display: "inline-block" }}>⌄</span>
                </div>
                {showTransition && (
                  <div style={{ padding: 12, borderTop: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
                      <button onClick={() => copy(stage.transitionPrompt, "transition")}
                        style={{ fontSize: 11, padding: "3px 9px", border: `0.5px solid ${stage.color}`, borderRadius: 5, background: "transparent", color: stage.color, cursor: "pointer" }}>
                        {copiedId === "transition" ? "✓ Copied" : "Copy prompt"}
                      </button>
                    </div>
                    <pre style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 7, padding: 10, fontSize: 10, lineHeight: 1.6, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", color: "var(--color-text-secondary)", margin: 0, fontFamily: "var(--font-mono)" }}>
                      {stage.transitionPrompt}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI SESSION FILES TAB */}
      {activeTab === "aifiles" && (
        <div style={{ padding: "1rem 1.5rem 0" }}>
          <div style={{ background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 9, padding: "10px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>How this works</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              At the end of each stage, run the AI Session File prompt with your completed artefacts. It generates pre-filled versions of the files below, ready to drop into your repo. Download each file and place it at the shown path.
            </div>
          </div>

          {/* AI file generation prompt */}
          <div style={{ border: `0.5px solid ${stage.color}`, borderRadius: 9, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ padding: "9px 13px", background: stage.light, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: stage.border }}>AI session file generation prompt</div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Run this after completing all {stage.label} artefacts</div>
              </div>
              <button onClick={() => copy(stage.claudePrompt, "claude-prompt")}
                style={{ fontSize: 11, padding: "3px 9px", border: `0.5px solid ${stage.border}`, borderRadius: 5, background: "transparent", color: stage.border, cursor: "pointer" }}>
                {copiedId === "claude-prompt" ? "✓ Copied" : "Copy prompt"}
              </button>
            </div>
            <div style={{ padding: 12, background: "var(--color-background-secondary)" }}>
              <pre style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 7, padding: 10, fontSize: 10, lineHeight: 1.6, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", color: "var(--color-text-secondary)", margin: 0, fontFamily: "var(--font-mono)" }}>
                {stage.claudePrompt}
              </pre>
            </div>
          </div>

          {/* Files produced */}
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Files produced at this stage — {stage.claudeFiles.length} files
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {stage.claudeFiles.map((fname, fi) => {
              const fileColor = FILE_COLORS[fname] || "#888780";
              const content = CLAUDE_FILES[fname] ? CLAUDE_FILES[fname]({ project: "YOUR PROJECT" }) : "";
              const path = fname === "CLAUDE.md" ? "CLAUDE.md" :
                fname === "current.md" ? "state/current.md" :
                fname === "open-decisions.md" ? "decisions/open-decisions.md" :
                fname === "spec-template.md" ? "specs/SPEC-TEMPLATE.md" :
                ["product.md", "architecture.md", "glossary.md"].includes(fname) ? `context/${fname}` : `rules/${fname}`;
              return (
                <div key={fi}>
                  <div onClick={() => setActiveFile(activeFile === fi ? null : fi)}
                    style={{ background: "var(--color-background-primary)", border: `0.5px solid ${activeFile === fi ? fileColor : "var(--color-border-tertiary)"}`, borderRadius: 9, padding: "9px 13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ fontSize: 14 }}>📄</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: fileColor }}>{fname}</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>{path}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={(e) => { e.stopPropagation(); download(fname, content); }}
                        style={{ fontSize: 11, padding: "3px 9px", border: `0.5px solid ${fileColor}`, borderRadius: 5, background: "transparent", color: fileColor, cursor: "pointer" }}>
                        ↓ Download
                      </button>
                      <span style={{ fontSize: 14, color: "var(--color-text-secondary)", transform: activeFile === fi ? "rotate(180deg)" : "none", transition: "transform .2s", display: "inline-block" }}>⌄</span>
                    </div>
                  </div>
                  {activeFile === fi && (
                    <div style={{ border: `0.5px solid ${fileColor}`, borderTop: "none", borderRadius: "0 0 9px 9px", padding: "12px", background: "var(--color-background-secondary)" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 6 }}>
                        <button onClick={() => copy(content, `file-${fi}`)}
                          style={{ fontSize: 11, padding: "3px 9px", border: `0.5px solid ${fileColor}`, borderRadius: 5, background: "transparent", color: fileColor, cursor: "pointer" }}>
                          {copiedId === `file-${fi}` ? "✓ Copied" : "Copy"}
                        </button>
                        <button onClick={() => download(fname, content)}
                          style={{ fontSize: 11, padding: "3px 9px", border: `0.5px solid ${fileColor}`, borderRadius: 5, background: fileColor, color: "white", cursor: "pointer" }}>
                          ↓ Download
                        </button>
                      </div>
                      <pre style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 7, padding: 10, fontSize: 10, lineHeight: 1.6, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", color: "var(--color-text-secondary)", margin: 0, fontFamily: "var(--font-mono)", maxHeight: 320 }}>
                        {content}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Repo structure */}
          <div style={{ marginTop: 12, background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 9, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Target repo structure</div>
            <pre style={{ fontSize: 10, lineHeight: 1.8, color: "var(--color-text-secondary)", margin: 0, fontFamily: "var(--font-mono)" }}>
{`your-project/
├── CLAUDE.md                    ← Stage 0–1
├── context/
│   ├── product.md               ← Stage 0–1
│   ├── architecture.md          ← Stage 4
│   ├── glossary.md              ← Stage 1–3
│   └── source-docs/             ← paste artefacts here
├── rules/
│   ├── engineering.md           ← Stage 4–5
│   ├── testing.md               ← Stage 6
│   ├── security.md              ← Stage 3–4
│   └── product.md               ← Stage 5
├── decisions/
│   ├── open-decisions.md        ← Stage 2+
│   ├── deviations.md            ← ongoing
│   └── adr/                     ← Stage 4 ADRs
├── specs/
│   ├── SPEC-TEMPLATE.md         ← Stage 2
│   └── FT-001.md … FT-NNN.md   ← Stage 2 (one per feature)
├── state/
│   ├── current.md               ← Stage 1+
│   ├── open-questions.md        ← ongoing
│   └── journal/                 ← per session
└── playbooks/
    ├── add-feature.md
    ├── end-session.md
    └── incident-response.md     ← Stage 7`}
            </pre>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 1.5rem 0", gap: 10 }}>
        <button onClick={() => { setActiveStage(Math.max(0, activeStage - 1)); setActiveArtifact(null); setActiveFile(null); setShowTransition(false); }}
          disabled={activeStage === 0}
          style={{ flex: 1, padding: "9px 0", border: "0.5px solid var(--color-border-secondary)", borderRadius: 7, background: "transparent", cursor: activeStage === 0 ? "not-allowed" : "pointer", color: activeStage === 0 ? "var(--color-text-tertiary)" : "var(--color-text-primary)", fontSize: 12 }}>
          ← Previous
        </button>
        <button onClick={() => { setActiveStage(Math.min(stages.length - 1, activeStage + 1)); setActiveArtifact(null); setActiveFile(null); setShowTransition(false); }}
          disabled={activeStage === stages.length - 1}
          style={{ flex: 1, padding: "9px 0", border: `0.5px solid ${stage.color}`, borderRadius: 7, background: activeStage === stages.length - 1 ? "transparent" : stage.color, cursor: activeStage === stages.length - 1 ? "not-allowed" : "pointer", color: activeStage === stages.length - 1 ? "var(--color-text-tertiary)" : "white", fontSize: 12, fontWeight: 500 }}>
          Next →
        </button>
      </div>

      {/* All artefacts */}
      <div style={{ padding: "1.25rem 1.5rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>
            All {totalArtifacts} artefacts · 10 AI session files
          </div>
          <button onClick={() => setShowAllArtifacts(!showAllArtifacts)}
            style={{ fontSize: 11, border: "0.5px solid var(--color-border-secondary)", borderRadius: 5, padding: "2px 8px", background: "transparent", cursor: "pointer", color: "var(--color-text-secondary)" }}>
            {showAllArtifacts ? "Hide" : "Show all"}
          </button>
        </div>
        {showAllArtifacts && (
          <div>
            {stages.map(s => (
              <div key={s.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: s.border, marginBottom: 4 }}>{s.icon} {s.label}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
                  {s.outputArtifacts?.map(a => (
                    <span key={a} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: s.id === stage.id ? s.light : "var(--color-background-secondary)", border: `0.5px solid ${s.id === stage.id ? s.color : "var(--color-border-tertiary)"}`, color: s.id === stage.id ? s.border : "var(--color-text-secondary)" }}>{a}</span>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {s.claudeFiles.map(f => (
                    <span key={f} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "transparent", border: `0.5px solid ${FILE_COLORS[f] || "#888"}`, color: FILE_COLORS[f] || "#888" }}>🤖 {f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
