---
id: TASK-3.2
title: Guided interview to seed the career-history document
status: To Do
assignee: []
created_date: '2026-08-12 21:45'
labels: []
dependencies:
  - TASK-1
  - TASK-3.1
parent_task_id: TASK-3
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build a chat-driven interview flow inside the resume CLI that walks a new user through populating the career-history document template (TASK-1) instead of leaving them to fill in a blank file: asking about roles held, accomplishments worth remembering across resumes, current focus, and known open questions (title conflicts, contact info, etc.), then writing the answers into the document in the expected structure. The interview should be resumable across sessions rather than requiring one long sitting.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Running the interview from a fresh clone produces a filled-in career-history document
- [ ] #2 The interview can be paused and resumed without losing prior answers
- [ ] #3 Answers are written into the document's existing section structure, not appended as an unstructured transcript
<!-- AC:END -->
