---
id: TASK-19
title: Scan pushes to a public remote for configured private strings
status: Done
assignee:
  - '@claude'
created_date: '2026-08-14 21:43'
updated_date: '2026-08-14 21:46'
labels: []
dependencies: []
ordinal: 27000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
TASK-18's branch lock stops the personal branch reaching the public template remote, but it can't catch the other direction: a private detail (a remote nickname, a private host, a personal branch name) leaking into main's own content and going public with an ordinary 'git push origin main'. This happened during TASK-18 itself, where the personal branch name and remote appeared as example text in hooks/pre-push and in a Backlog task file, and was only caught by a manual grep before pushing. Worse, 'rg <term>' in the working tree searches whichever branch is checked out, so in a repo whose two branches deliberately hold different content, the obvious check reports the wrong answer and reads as reassuring. Extend hooks/pre-push to scan what a push to a configured public remote would actually publish -- both the tree at the pushed tip and the diffs and commit messages of the new commits -- and refuse on a match. Same config-driven, fork-inert pattern as TASK-18: the private strings live in local git config, never in a tracked file, since writing them into the repo is the exact thing being prevented.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Scanning is inert unless both resume.publicRemote and resume.privateString are configured; with either unset the hook behaves exactly as it does today
- [x] #2 A push to a configured public remote is refused when a private string appears in the tree at the pushed tip, and the message names the string, the file, and the line
- [x] #3 A push is also refused when the string appears only in the diffs or commit messages of the newly pushed commits, not in the tip tree, since published history is public too
- [x] #4 A push of the same commits to a remote that is not configured public is allowed, so the private remote is unaffected
- [x] #5 Paths listed in resume.privateStringExempt are excluded from the scan, so a legitimate occurrence such as a name in LICENSE does not block every push forever
- [x] #6 Matching is case-insensitive and literal, not regex, and binary files are skipped
- [x] #7 Branch deletions are not scanned, and --no-verify still overrides
- [x] #8 The new config keys are documented in the resu-me-developer skill alongside resume.lockedBranch
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Refactor hooks/pre-push to buffer stdin refs into an array first, since the existing lock loop consumes stdin and the scan needs a second pass over the same refs. 2. Generalize the remote-matching helper (name, remote.<n>.url, remote.<n>.pushurl) so both the lock check and the public-remote check use it. 3. Add the scan: for each non-deletion ref pushed to a configured public remote, git grep -I -i -F the pushed tip tree for each resume.privateString, honouring resume.privateStringExempt pathspecs; then best-effort scan the new commits' diffs and messages via git log -p over remote_sha..local_sha (falling back to --not --remotes for a brand-new branch). 4. Report file:line for tree hits and commit subjects for history hits, then refuse. 5. Document the three new config keys in the resu-me-developer skill next to resume.lockedBranch, including that the tree scan is the primary guarantee and the history scan is best-effort on a new branch. 6. Test in the throwaway two-remote repo: inert without config, tree hit refused, history-only hit refused, private remote unaffected, exempt path honoured, case-insensitivity, binary skipped, deletion skipped, --no-verify override. 7. Configure the real strings in this checkout's local config only.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified in a throwaway repo with a public and a private bare remote (scratchpad, not a real checkout), twelve cases:

- inert with no config: push allowed even with the string present
- string in the tip tree: refused, reporting file:line for each hit
- same commits pushed to the non-public remote: allowed
- exempt pathspec: LICENSE alone blocked the push without it and the push succeeded with it
- case-insensitive both directions (lowercase config value matched 'SECRETCO' and 'Secretco')
- history-only hit: string added then scrubbed, tree clean, refused on the introducing diff
- commit-message-only hit: tree clean, refused, reporting the offending commit subject
- binary file containing the string: skipped, push allowed (git grep -I)
- --no-verify overrode a real violation
- branch deletion to the public remote: not scanned, allowed
- new branch with an all-zero remote sha and the string in its tree: refused
- clean new branch to the public remote: allowed
- TASK-18 regression with both guards configured at once: the locked branch was still refused to the wrong remote and accepted by its own

Two testing notes worth keeping. First, an early exemption test was void: after 'git reset --hard HEAD~1' the branch matched the remote, so there were no refs to push and the hook never ran. Re-ran it with a real new commit. A push test that shows 'Everything up-to-date' has proved nothing. Second, stdin had to be buffered into an array before the guards run: the existing lock loop consumed it, and the scan needs a second pass over the same refs.

Known limit, documented in the skill: the history scan for a brand-new branch falls back to '--not --remotes' because there is no remote_sha..local_sha range, so it can under-report if those commits already sit on another remote. The tree scan at the pushed tip has no such gap and is the actual guarantee.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Extended hooks/pre-push to scan what a push to a remote marked public would publish, refusing on any string marked private. This closes the direction TASK-18's branch lock cannot see: a private host, remote nickname, or personal branch name that leaks into otherwise-public content and ships with a routine 'git push origin main'. It is the mistake that actually happened during TASK-18, where the personal branch name and remote reached main as example text in the hook itself and in a Backlog task file, caught only by a manual grep before pushing.

Config is multi-valued and local-only, matching TASK-18's fork-inert pattern: resume.publicRemote, resume.privateString, and resume.privateStringExempt for occurrences that are legitimate and permanent, such as a name in LICENSE. Scanning is inert unless the first two are set. Matching is literal and case-insensitive, binary files are skipped, deletions are not scanned, and --no-verify still overrides. Two scans run per ref: the tip tree, which is the guarantee, and the new commits' diffs and messages, which is best-effort since a brand-new branch has no range to subtract. Also refactored the hook to buffer stdin refs, since both guards now walk them. Verified across twelve cases including a TASK-18 regression check with both guards active.
<!-- SECTION:FINAL_SUMMARY:END -->
