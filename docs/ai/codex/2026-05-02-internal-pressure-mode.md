# 2026-05-02 Internal Pressure Mode

## What Changed

- Added a pressure mode switch for external/internal pressure in the input panel.
- Added internal-pressure limit calculations using tensile-side material strength.
- Hid external-pressure-only inputs and outputs in internal mode, including water-density fields, buckling KDF, and external buckling result rows.
- Generalized Monte Carlo, failure probability, distribution, and thickness sweep charts so they can show either depth or internal pressure.
- Added tests for internal Lame boundary conditions, internal displacement direction, tensile allowables, and the internal pressure UI switch.

## Decisions

- Internal mode treats the result as gauge pressure.
- Cylinder internal pressure uses Lame thick-wall stresses with the selected closed/open axial condition.
- Dome internal pressure uses membrane tensile stress and keeps the dome yield safety factor.
- Material curves now prefer tensile yield/proof data before compressive yield data.

## TODO

- Add geometry-specific FEA/export support for ports, grooves, bonded seams, and bolted interfaces.
- Replace conservative material allowables with project-specific coupon/proof-test data when available.
