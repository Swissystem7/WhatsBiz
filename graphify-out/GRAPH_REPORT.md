# Graph Report - .  (2026-07-20)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 208 nodes · 269 edges · 49 communities (44 shown, 5 thin omitted)
- Extraction: 74% EXTRACTED · 26% INFERRED · 0% AMBIGUOUS · INFERRED: 70 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7378ed8b`
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

## Communities (49 total, 5 thin omitted)

### Community 0 - "parseBookingRequest.test.js"
Cohesion: 0.08
Nodes (23): Booking Intent, index.html (main app), run (main handler), Language Detection, detectLanguage(), assert, { detectLanguage }, generateHybridReply() (+15 more)

### Community 1 - "chat.py"
Cohesion: 0.20
Nodes (19): Base, get_db(), AsyncSession, BotConfig, Business, Conversation, Message, chat() (+11 more)

### Community 2 - "schemas.py"
Cohesion: 0.26
Nodes (13): _get_business_and_config(), get_config(), AsyncSession, update_config(), BotConfigResponse, BotConfigUpdate, ChatRequest, ChatResponse (+5 more)

### Community 3 - "WhatsBiz Project"
Cohesion: 0.31
Nodes (10): aiosqlite, Anthropic, FastAPI, Pydantic, python-dotenv, python-multipart, SQLAlchemy, Uvicorn (+2 more)

### Community 4 - "scheduleReminders.test.js"
Cohesion: 0.25
Nodes (7): scheduleReminders(), assert, now, r, { scheduleReminders }, start, Reminder Scheduling

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

## Knowledge Gaps
- **51 isolated node(s):** `registeredNames`, `assert`, `{ assistBSPOnboarding }`, `result`, `assert` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `index.html (main app)` connect `parseBookingRequest.test.js` to `scheduleReminders.test.js`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `run (main handler)` connect `parseBookingRequest.test.js` to `scheduleReminders.test.js`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
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