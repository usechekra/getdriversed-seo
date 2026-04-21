# Brief — California Traffic School Online

## Inputs

| Field | Value |
|---|---|
| **URL** | https://getdriversed.com/courses-details/california-traffic-school |
| **Page type** | State Course Page |
| **State** | California |
| **State agency** | DMV (California Department of Motor Vehicles) |
| **Date** | 2026-04-18 |
| **Primary KW** | California Traffic School Online |
| **Intent** | Transactional (user has a ticket, needs to complete traffic school) |
| **Skill used** | optimize-page |
| **Source docs** | np-accel-system.md, sop-playbook.md, header-skeleton.md, keyword-formulas.md, scoring-rubric.md, schema-reference.md, competitors.md |

## Critical Finding

> ⚠️ The live page meta description says **"Texas Online Driver Education"** on a California page. This is a template copy error and is actively hurting the page in Google — it signals wrong intent, wrong state, wrong audience. **This is Priority 1 to fix.**

## Page Context

- Canonical: https://getdriversed.com/courses-details/california-traffic-school (note: /en suffix variant also indexed — see sitewide backlog #3)
- Current title: "Get Drivers Ed - California Traffic School" (42 chars — too short, wrong separator)
- Current word count: ~77 words — page is essentially empty/template-only
- No H1 present
- No schema of any kind
- 2 images — alt text says "representing undefined" (broken template variable)
- Only nav/footer internal links — zero course-specific links

## California Traffic School Key Facts

- Official CA name: **Traffic Violator School (TVS)**
- Duration: **8 hours** (California statutory requirement)
- Agency: **California DMV**
- Certificate: **DL 400 C** (Certificate of Completion — per keyword-formulas.md credential reference)
- DMV license number: [VALIDATE — GDE must display their CA TVS license number on page, critical for E-E-A-T]
- Ticket masking: One per 18 months, moving violations only (infractions not misdemeanors)
- Certificate delivery: Electronic submission to court and DMV
- Court: Must elect traffic school at court, pay court fee separately

## Cannibalization Check

`site:getdriversed.com "california traffic school"` found:
- `/courses-details/california-traffic-school` ← **our target** 
- `/courses-details/california-traffic-school/en` ← same page, /en variant — canonical consolidation needed (sitewide backlog #3)
- `/course/defensive/california` ← potential cannibalization risk for "defensive driving" angle — monitor but distinct enough topic
- `/course/online-drivers-ed/california` ← drivers ed, different product — no cannibalization

**Verdict:** /en variant is the main canonical issue. Monitor /course/defensive/california for KW overlap.
