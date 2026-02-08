#!/bin/bash

# Labels
gh label create blocker --color FF0000 --description "Blocks dependent work" || true
gh label create enhancement --color 1D76DB || true
gh label create ui --color A2EEEF || true
gh label create logic --color C5DEF5 || true
gh label create analytics --color 5319E7 || true

# Milestones
gh milestone create "M1 - App Skeleton & Data Layer" || true
gh milestone create "M2 - Core Finance Features" || true
gh milestone create "M3 - Dashboard & Analytics" || true
gh milestone create "M4 - UX Polish & Quality" || true

