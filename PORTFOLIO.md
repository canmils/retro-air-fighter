# Retro Air Fighter — product case study

[Play the prototype](https://canmils.github.io/retro-air-fighter/) · [Source and instructions](README.md) · [Give feedback](https://github.com/canmils/retro-air-fighter/issues/new?template=playtest.yml)

## Goal and role

Create a small retro vertical shooter that someone can try immediately on a computer or phone. Joan Casellas directed the product scope, reference selection and release process. Code, procedural graphics and synthesized sounds were created through AI-assisted implementation.

## MVP decisions

- One complete mission, one player aircraft, two enemy types, three lives and one final boss.
- Arrow keys and Space on desktop; relative drag movement with firing on touch.
- One temporary weapon upgrade, local best score and immediate restart.
- Browser delivery through GitHub Pages to remove installation and account requirements.
- No ads, shop, currency economy or native app packaging in this release.

The scope tests a complete play loop before investing in progression or monetisation. Free access alone does not establish a viable F2P product.

## Evidence and current limits

The repository contains simulation tests for movement, collisions, damage/invulnerability, pausing, reset, pickups, boss completion and bounded entity counts. [CI](https://github.com/canmils/retro-air-fighter/actions/workflows/ci.yml) and [deployment](https://github.com/canmils/retro-air-fighter/actions/workflows/pages.yml) expose the check history.

The initial release passed seven simulation tests and was deployed publicly. The project owner has reported playing it. No structured external playtest, real-device compatibility matrix or measured retention result is available yet. Passing simulation tests does not verify the full browser experience.

## Next validation

Observe a first-time player without coaching. Record device/browser, whether controls are understood, where lives are lost, whether the mission is completed, and whether the player chooses another run. Use the issue template to capture findings. Choose the next change from observed friction rather than adding features by default.

## Portfolio claim supported

Directed the scope and AI-assisted delivery of a publicly playable arcade MVP with keyboard/touch controls, automated simulation checks and a feedback route. This is evidence of a scoped prototype release, not commercial game performance.
