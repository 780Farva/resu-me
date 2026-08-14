---
id: TASK-18
title: Lock a branch to one remote with a pre-push hook
status: Done
assignee:
  - '@claude'
created_date: '2026-08-14 21:07'
updated_date: '2026-08-14 21:25'
labels: []
dependencies: []
ordinal: 26000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A checkout of resu-me can hold a personal branch with real career data alongside 'origin', which is the shared public template and must stay free of it. Today nothing prevents 'git push origin <personal-branch>'; branch.<name>.remote only sets the default for a bare 'git push'. TASK-15 established that prevention encoding a property of THIS checkout must not ship to forks as behavior, so the hook must be generic and inert by default: hooks/pre-push reads branch-to-remote locks from local git config (multi-valued 'resume.lockedBranch' entries of the form '<branch>:<remote>') and refuses a push that would send a locked branch anywhere else. The branch name and remote live only in the checkout's config, never in a tracked file. hooks/ is already core.hooksPath via 'just install-hooks', so the hook is picked up with no extra wiring.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 hooks/pre-push exists, is executable, and exits 0 doing nothing when no resume.lockedBranch config is set, so forks are unaffected
- [x] #2 With resume.lockedBranch set to '<branch>:<remote>', pushing that branch to any other remote is refused, and the message names the branch, the attempted remote, and the allowed remote
- [x] #3 Pushing the locked branch to its allowed remote succeeds
- [x] #4 The refusal also fires when the locked branch is pushed under a different remote ref name, e.g. 'git push origin locked:other'
- [x] #5 Multiple locked branches are supported via repeated resume.lockedBranch values
- [x] #6 The mechanism and its config syntax are documented in the resu-me-developer skill
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Write hooks/pre-push: read 'git config --get-all resume.lockedBranch' (values '<branch>:<remote>'); exit 0 immediately if none. 2. For each pushed ref on stdin, extract both the local and remote branch name; refuse if either matches a locked branch and $1 (the remote name/URL) is not the allowed remote or one of its configured URLs. 3. Print a message naming the branch, the attempted target, the allowed remote, and the config key that governs it. 4. Document in .claude/skills/resu-me-developer/SKILL.md alongside the other hooks. 5. Test: no config -> inert; locked -> wrong remote refused, allowed remote accepted; renamed refspec refused; two locked branches enforced independently. 6. Set the lock in the affected checkout's local git config only, never in a tracked file -- including in example text, which would put back what the design keeps out.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified in a throwaway repo with two bare remotes (scratchpad, not a real checkout): no config pushes fine; a locked branch was refused to the wrong remote and accepted by the allowed one; 'push wrong-remote locked:renamed' and 'push wrong-remote other:locked' were both refused, so the remote side of the refspec is checked and not just the local; a second lock was enforced independently while an unlocked branch pushed normally; push by raw URL matched against remote.<name>.url/pushurl in both directions; deletions allowed; a malformed value warned once and was skipped rather than failing the push; --no-verify overrode.

Then set the real lock in the affected checkout's local config and confirmed by dry-run that the locked branch is refused to the public remote while main is unaffected. The allow path could not be exercised end-to-end against the real private remote: git connects before running pre-push, and that remote's HTTPS URL has no credential helper configured, so it fails on auth before the hook is reached.

One gap found in the process and worth carrying forward: the hook is a tracked file, so it does not exist on a branch that predates it. A dry-run on the personal branch, immediately after committing the hook to main, showed the push would have succeeded. Fixed by merging main into that branch. Any new personal branch cut from an old commit, or a fresh checkout, has no guard until the hook is present -- documented in that branch's AGENTS.md.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added hooks/pre-push, which refuses to push a branch this checkout has locked to a single remote. Motivated by a personal branch of real career data living alongside a remote that is a shared public template: branch.<name>.remote only picks the default for a bare 'git push', leaving an explicit 'git push <public-remote> <personal-branch>' unguarded, and that is not undoable once the data reaches someone else's server.

Locks are read from multi-valued git config 'resume.lockedBranch' as '<branch>:<remote>', so the branch name and safe remote stay in one clone's config and never enter a tracked file. Example text in the hook and its docs is placeholder-only for the same reason. The hook exits immediately when nothing is configured, keeping it inert in forks -- following TASK-15's finding that prevention encoding a property of one checkout must not ship to forks as behavior. It matches remotes by name and by configured url/pushurl, checks both sides of the refspec, permits deletions, and yields to --no-verify. Documented in the resu-me-developer skill. Verified across nine cases in a throwaway two-remote repo plus dry-runs in the real checkout.
<!-- SECTION:FINAL_SUMMARY:END -->
