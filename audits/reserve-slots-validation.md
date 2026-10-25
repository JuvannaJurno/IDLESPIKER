# Reserve slots validation

- PASS test-roster-switch.cjs: stage-four unlock, five role slots, alternatives below both views, wrong-role/duplicate normalization, reserve assignment, starter/reserve swap, prematch swap, persistence after reload, removal to alternatives, reveal, 320/390/1440 bounds and dark theme.
- PASS test-team.cjs: existing starter constraints and normalization.
- PASS test-first-league-academy.cjs: academy and first-league rules.
- Existing test-transfer-lineup.cjs expects roster growth from 12 to 13; fails 12 != 13 with both current files and HEAD team.js/team-rules.js served in an isolated baseline run.
- test-lineup-picker.cjs fails its room-upgrade wait assertion before browser setup; room rules are unchanged in this task.
- test-pre-match-team.cjs is blocked by its missing language onboarding setup. Dedicated reserve browser test validates the actual prematch commit API, including swapping an assigned reserve into the starting squad and preserving the outgoing player in the reserve slot.

Visual evidence: roster-switch-starters.png, roster-switch-reserves.png, roster-switch-dark.png.
Automatic in-match substitutions are not introduced; squad assignments and manual/prematch swaps are implemented.
