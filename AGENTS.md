# Retro Air Fighter

An original, tiny vertical scrolling shooter inspired by 8-bit arcade games.
Playable prototype, dependency-free, live on GitHub Pages. No ads, purchases,
accounts, analytics or backend.

## Commands

- Run: `npm start` then open http://localhost:8000
- Tests: `npm test`

## Layout

- `index.html`, `style.css`, `game.js` (rendering and input), `engine.js` (game rules, pure).
- `tests/`, `docs/`, `PORTFOLIO.md`.

## Rules

- Keep it dependency-free and playable on desktop (keys) and phone (touch).
- Original art and sound only.

## Coding discipline (Karpathy guidelines)

Before writing, reviewing or refactoring code, load the `karpathy-guidelines` skill
(source: github.com/multica-ai/andrej-karpathy-skills, MIT). The short version:

1. **Read first.** Read the code, docs and tests you will touch before you change anything. Investigate; do not guess.
2. **Think before coding.** State your assumptions. If there is more than one reading of the task, name them. If something is unclear, stop and ask.
3. **Simplicity first.** Write the minimum code for the request. No speculative features, no early abstractions, no new dependency without a stated reason.
4. **Surgical changes.** Touch only what the task needs and match the existing style. Mention unrelated problems; do not fix them silently.
5. **Define success before building.** Turn the task into a check, for example a test that fails first and then passes.
6. **Test the behaviour and fix the root cause.** A green build is not enough. Do not patch symptoms.
7. **Explain what changed and why.** Files touched, the reason, and the checks you actually ran.
