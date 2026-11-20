# Claims: dark-mode-depth

1. Material's Android docs: "Shadows are less effective in an app using a dark theme, because they will have less contrast with the dark background colors and will appear to be less visible." | https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Dark.md
2. Material's Android docs say surfaces "become lighter and more colorful at higher elevations, when they are closer to the implied light source". | https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Dark.md
3. Material's elevation overlays are semi-transparent overlays placed on the surface colour, with alpha rising with elevation. | https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Dark.md
4. Material's baseline dark theme background and surface are dark grey instead of black, "which increases visibility for shadows and also reduces eye strain for light text". | https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Dark.md
5. The overlay alpha fraction is (4.5 x ln(1 + elevation in dp) + 2) / 100, capped at 1; this gives about 5% at 1dp, 8% at 3dp, 11% at 6dp, 12% at 8dp, 15% at 16dp and 16% at 24dp. | https://raw.githubusercontent.com/material-components/material-components-android/master/lib/java/com/google/android/material/elevation/ElevationOverlayProvider.java
6. Material 3 themes set the elevation overlay colour to colorPrimary. | https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Color.md
7. In Material Components, surface with elevation overlay has been replaced by tonal surface colour roles, and maintenance of the elevation overlay has been discontinued. | https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Color.md
8. Material 3 dark scheme tones: background and surface neutral 6, surface container lowest 4, low 10, container 12, high 17, highest 22, surface bright 24. | https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Color.md
9. Material's Android library sets #121212 as the default dark background and dark surface colour (design_dark_default_color_background and design_dark_default_color_surface). | https://raw.githubusercontent.com/material-components/material-components-android/master/lib/java/com/google/android/material/color/res/values/colors.xml
10. Apple: in iOS and iPadOS dark mode the system uses two sets of background colours, base and elevated. | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/dark-mode.json
11. Apple: "The base colors are dimmer, making background interfaces appear to recede, and the elevated colors are brighter, making foreground interfaces appear to advance." | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/dark-mode.json
12. Apple: the background colour changes automatically from base to elevated when an interface is in the foreground, such as a popover or modal sheet. | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/dark-mode.json
13. Apple: dark mode colours are not necessarily inversions of their light counterparts. | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/dark-mode.json
14. Apple asks for a contrast ratio no lower than 4.5:1, and to strive for 7:1 for custom foreground and background colours. | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/dark-mode.json
15. Apple says an app for immersive media viewing can use a permanently dark appearance that lets the UI recede. | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/dark-mode.json
16. Atlassian: "the higher the elevation, the lighter the surface looks". | https://atlassian.design/foundations/elevation
17. Atlassian: raised and overlay surfaces are lighter in dark mode to help differentiate elevations. | https://atlassian.design/foundations/elevation
18. Atlassian: "Raised and overlay surfaces are still paired with shadows for added depth and consistency in dark mode." | https://atlassian.design/foundations/elevation
19. Atlassian: the sunken surface token darkens in both light and dark modes. | https://atlassian.design/foundations/elevation
20. Atlassian: "To create flat cards, pair with a border." | https://atlassian.design/foundations/elevation
21. Ondrej Pesicka (Atmos): "Choose dark grays for your default surface color." | https://atmos.style/blog/dark-mode-ui-best-practices
22. Pesicka: "Another advantage is that you will be able to use shadows on dark gray surfaces." | https://atmos.style/blog/dark-mode-ui-best-practices
23. Pesicka suggests making the surface lighter the higher it is. | https://atmos.style/blog/dark-mode-ui-best-practices
24. The Atmos article was published 8 Oct 2022 and updated 20 Jul 2023. | https://atmos.style/blog/dark-mode-ui-best-practices
25. color-mix() mixes colours in a given colour space by given amounts, and MDN marks it available across browsers since May 2023. | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
26. Figma variable modes represent different contexts such as light and dark themes; a frame's mode is set with Apply variable mode in the Appearance section, and a frame on Auto takes its parent's mode. | https://help.figma.com/hc/en-us/articles/15343816063383
27. Figma colour variables can be applied to fills, stroke colours and the colour of shadow effects. | https://help.figma.com/hc/en-us/articles/15343107263511
