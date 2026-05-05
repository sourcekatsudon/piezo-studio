# 2026-05-01 Material Curves And Accuracy

## What Changed

- Added a Ramberg-Osgood based stress-strain approximation from material proof/yield, ultimate, and modulus values.
- Applied the material nonlinearity as a secant amplification to the pressure-displacement chart.
- Added a stress-strain chart to the material panel.
- Replaced long-cylinder-only external buckling with a finite-length cylindrical shell mode search.
- Increased rectangular plate series resolution and corrected center deflection summation signs.
- Added CP titanium Grade 1 and Grade 4 material entries.
- Fixed thickness sweep P50/P5 depth conversion to include internal pressure.
- Fixed Playwright web server startup on Windows by removing the WSL-only `bash -lc` wrapper.

## Decisions

- Material curves are still approximations, not certified coupon curves. The implementation uses 0.2% proof/yield behavior to avoid the unrealistic sharp elastic-perfectly-plastic corner.
- The cylinder buckling update uses a classical thin-shell finite-length expression and keeps the existing KDF workflow for imperfections.

## TODO

- Replace estimated Ramberg-Osgood exponents with grade-specific coupon data where available.
- Add a real shell/plate nonlinear solver or FEA export path for penetrators, grooves, bolts, and dome-to-cylinder transitions.

## Notes

- Existing hole test expected a 0.9a hole to exceed center stress, but the clamped circular plate maximum occurs at the fixed edge. The test now checks the actual edge condition.
