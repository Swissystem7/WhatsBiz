# Graph Report - WhatsBiz  (2026-07-21)

## Corpus Check
- 64 files · ~23,174 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 216 nodes · 276 edges · 50 communities (46 shown, 4 thin omitted)
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 70 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d23bf6a3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- parseBookingRequest.test.js
- chat.py
- schemas.py
- WhatsBiz Project
- scheduleReminders.test.js
- main.py
- assistBSPOnboarding.test.js
- onboarding.html
- isBusinessOpen.test.js
- maskPhone.test.js
- requestHumanHandoff.js
- templateFill.test.js
- dashboard.html
- runConversationSimulator.js
- generateReferralCode.js
- getRotatedResponse.js
- templates/index.html (landing)
- WhatsBiz — גיליון אימות שוק (30 יום)

## God Nodes (most connected - your core abstractions)
1. `Business` - 11 edges
2. `BotConfig` - 11 edges
3. `chat()` - 10 edges
4. `WhatsBiz Project` - 9 edges
5. `Base` - 7 edges
6. `preview_prompt()` - 7 edges
7. `Conversation` - 6 edges
8. `Message` - 6 edges
9. `_get_business_and_config()` - 6 edges
10. `update_config()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `FastAPI` --references--> `WhatsBiz Project`  [INFERRED]
  requirements.txt → README.md
- `Uvicorn` --references--> `WhatsBiz Project`  [INFERRED]
  requirements.txt → README.md
- `Pydantic` --references--> `WhatsBiz Project`  [INFERRED]
  requirements.txt → README.md
- `SQLAlchemy` --references--> `WhatsBiz Project`  [INFERRED]
  requirements.txt → README.md
- `aiosqlite` --references--> `WhatsBiz Project`  [INFERRED]
  requirements.txt → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Core Bot Utilities** — lib_parsebookingrequest, lib_generatehybridreply, lib_schedulereminders, lib_detectlanguage [EXTRACTED 1.00]
- **Dashboard Workspace** — templates_dashboard, customer_management, dna_style, auction_system [EXTRACTED 1.00]
- **Technology Stack** — requirements_fastapi, requirements_uvicorn, requirements_pydantic, requirements_sqlalchemy, requirements_aiosqlite, requirements_anthropic, requirements_python_dotenv, requirements_python_multipart [EXTRACTED 1.00]

## Communities (50 total, 4 thin omitted)

### Community 0 - "parseBookingRequest.test.js"
Cohesion: 0.08
Nodes (23): Booking Intent, index.html (main app), run (main handler), Language Detection, detectLanguage(), assert, { detectLanguage }, generateHybridReply() (+15 more)

### Community 1 - "chat.py"
Cohesion: 0.19
Nodes (21): Base, get_db(), AsyncSession, BotConfig, Business, Conversation, Message, chat() (+13 more)

### Community 2 - "schemas.py"
Cohesion: 0.32
Nodes (10): create_business(), AsyncSession, BotConfigUpdate, ChatRequest, ChatResponse, ConversationOut, MessageOut, OnboardingRequest (+2 more)

### Community 3 - "WhatsBiz Project"
Cohesion: 0.31
Nodes (10): aiosqlite, Anthropic, FastAPI, Pydantic, python-dotenv, python-multipart, SQLAlchemy, Uvicorn (+2 more)

### Community 4 - "scheduleReminders.test.js"
Cohesion: 0.25
Nodes (7): scheduleReminders(), assert, now, r, { scheduleReminders }, start, Reminder Scheduling

### Community 5 - "main.py"
Cohesion: 0.32
Nodes (3): init_db(), lifespan(), FastAPI

### Community 6 - "assistBSPOnboarding.test.js"
Cohesion: 0.33
Nodes (5): assistBSPOnboarding(), registeredNames, assert, { assistBSPOnboarding }, result

### Community 7 - "onboarding.html"
Cohesion: 0.33
Nodes (5): /api/onboarding endpoint, goDashboard, goTo, Onboarding Process, submitOnboarding

### Community 8 - "isBusinessOpen.test.js"
Cohesion: 0.50
Nodes (3): isBusinessOpen(), assert, { isBusinessOpen }

### Community 9 - "maskPhone.test.js"
Cohesion: 0.50
Nodes (3): maskPhone(), a, {maskPhone}

### Community 10 - "requestHumanHandoff.js"
Cohesion: 0.40
Nodes (3): handoffQueue, { randomUUID }, recentRequests

### Community 11 - "templateFill.test.js"
Cohesion: 0.50
Nodes (3): templateFill(), assert, { templateFill }

### Community 12 - "dashboard.html"
Cohesion: 0.50
Nodes (3): Auction System, Customer Management, DNA Style

### Community 49 - "WhatsBiz — גיליון אימות שוק (30 יום)"
Cohesion: 0.25
Nodes (7): 1. ICP מדויק (הלקוח הראשון), 2. מחיר מוצע + מודל, 3. זווית מול המתחרה המרכזי (WATI / Zoko), 4. תוכנית 100 המשתמשים הראשונים (תקציב 0), 5. קריטריון המשך/פיבוט/הריגה (30 יום), WhatsBiz — Market Validation (auto, DeepSeek 2026-07-20), WhatsBiz — גיליון אימות שוק (30 יום)

## Knowledge Gaps
- **57 isolated node(s):** `registeredNames`, `assert`, `{ assistBSPOnboarding }`, `result`, `assert` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `index.html (main app)` connect `parseBookingRequest.test.js` to `scheduleReminders.test.js`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `run (main handler)` connect `parseBookingRequest.test.js` to `scheduleReminders.test.js`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `Business` connect `chat.py` to `schemas.py`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Business` (e.g. with `Base` and `chat()`) actually correct?**
  _`Business` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `BotConfig` (e.g. with `Base` and `chat()`) actually correct?**
  _`BotConfig` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `chat()` (e.g. with `BotConfig` and `Business`) actually correct?**
  _`chat()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `WhatsBiz Project` (e.g. with `aiosqlite` and `Anthropic`) actually correct?**
  _`WhatsBiz Project` has 9 INFERRED edges - model-reasoned connections that need verification._