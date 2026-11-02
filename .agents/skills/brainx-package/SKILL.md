---
name: brainx-package
description: Review a proposed brainX dependency before installation. Use when a package is requested; explain need, overlap, compatibility, changed files, and stop for approval.
---

Follow the package rules in `AGENTS.md`.

1. Locate the task that introduces the package in `docs/MODEL.md`, `docs/BACKEND.md`, or `docs/FRONTEND.md`.
2. Explain the concrete feature it supports and inspect existing dependencies for overlap.
3. Check compatibility using authoritative sources and the repository's pinned versions; distinguish checked facts from unknowns.
4. State the exact install command and which lock/config files it will change.
5. Ask exactly: “Should I install this package now?” Do not install it without a clear yes.
