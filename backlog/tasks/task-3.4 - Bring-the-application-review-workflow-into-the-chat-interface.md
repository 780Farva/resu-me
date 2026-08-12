---
id: TASK-3.4
title: Bring the application review workflow into the chat interface
status: To Do
assignee: []
created_date: '2026-08-12 21:45'
labels: []
dependencies:
  - TASK-3.1
parent_task_id: TASK-3
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The project already has a review workflow (the resume-review skill plus 'just review') that runs a screening-persona review of an application and then interviews the user through the findings. Once the resume CLI exists, port this workflow so it runs as a conversation inside 'resume' rather than requiring a separate coding-agent CLI. Preserve the existing behavior: research the employer, adopt a specific screener persona, produce ranked findings, then interview the user one finding at a time and write corrections back into the career-history and opportunity documents.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The review workflow is reachable from the resume CLI without invoking a separate tool
- [ ] #2 Behavior matches the existing skill: persona-based review, one-note-at-a-time interview, corrections written back to source documents before the resume is edited
<!-- AC:END -->
