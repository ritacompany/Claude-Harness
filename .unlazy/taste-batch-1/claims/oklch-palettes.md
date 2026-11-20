# Claims: oklch-palettes

1. Björn Ottosson published the Oklab colour space in a post dated 23 Dec 2020. | https://bottosson.github.io/posts/oklab/
2. In Oklab, L is perceived lightness, a is how green or red the colour is and b is how blue or yellow it is. | https://bottosson.github.io/posts/oklab/
3. Oklab's polar form uses chroma C = √(a² + b²) and hue h = atan2(b, a). | https://bottosson.github.io/posts/oklab/
4. Oklab was derived by optimising the parameters of a colour space with the same structure as IPT, using data generated with CAM16. | https://bottosson.github.io/posts/oklab/
5. Ottosson lists as a requirement that L, C and h "should be perceived as orthogonal, so one can be altered without affecting the other two". | https://bottosson.github.io/posts/oklab/
6. The CSS spec writes the polar form of Oklab as OkLCh. | https://www.w3.org/TR/css-color-4/
7. CSS Color 4 says Oklab has improved hue linearity, hue uniformity and chroma uniformity compared to CIE LCH. | https://www.w3.org/TR/css-color-4/
8. In CSS oklch(), L runs from 0 to 1 or 0% to 100%, with 0 black and 1 (100%) a diffuse white. | https://www.w3.org/TR/css-color-4/
9. Out of range L values in oklch() are clamped at parsed value time. | https://www.w3.org/TR/css-color-4/
10. An OkLCh colour with L of 0 or 1 is displayed as black or white respectively. | https://www.w3.org/TR/css-color-4/
11. CSS Color 4 says the maximum chroma in oklch() is "theoretically unbounded (but in practice does not exceed 0.5)". | https://www.w3.org/TR/css-color-4/
12. In oklch(), a chroma percentage of 100% equals 0.4. | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
13. Evil Martians state that for both sRGB and P3 the OKLCH chroma value will always be below 0.37. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
14. In oklch(), 0deg points toward purplish red, 90deg toward mustard yellow, 180deg toward greenish cyan and 270deg toward sky blue. | https://www.w3.org/TR/css-color-4/
15. MDN notes that the angles for particular hues differ between hsl(), lch() and oklch(). | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
16. When the chroma of an OkLCh colour is 0, its hue component is powerless. | https://www.w3.org/TR/css-color-4/
17. CSS Color 4 says HSL lightness "does not correspond to the visual perception of lightness across hues". | https://www.w3.org/TR/css-color-4/
18. hsl(240deg 100% 50%) (blue) and hsl(60deg 100% 50%) (yellow) both have HSL lightness 50%, while in OkLCh they have lightness 0.452 and 0.968. | https://www.w3.org/TR/css-color-4/
19. The HSL hue pair 220deg and 250deg look fairly similar while 50deg and 80deg look very different, though both are 30deg apart; in OkLCh the pairs are 6.3deg and 35.66deg apart. | https://www.w3.org/TR/css-color-4/
20. Evil Martians say they use OKLCH in their projects. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
21. Evil Martians say OKLCH's "predictable lightness" provides better accessibility. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
22. Evil Martians give a code example flagging a 20% (0.2) lightness difference between text and background as not sufficient for good contrast. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
23. Harmonizer uses the OKLCH colour model and the APCA contrast formula to create palettes with consistent chroma and contrast across all levels and hues. | https://evilmartians.com/opensource/harmonizer
24. Harmonizer is available as a Figma plugin and a web application. | https://evilmartians.com/opensource/harmonizer
25. Evil Martians say "every hue has a different maximum chroma". | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
26. Evil Martians write: "For some lightness values, there is only a blue color with a large chroma." | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
27. CSS Color 4 allows three gamut mapping algorithms, all aiming at "constant-lightness, constant-hue chroma reduction in the OkLCh color space". | https://www.w3.org/TR/css-color-4/
28. Chrome's HD colour guide says "The browser gamut maps or clamps to sRGB" when the display is not wide gamut. | https://developer.chrome.com/docs/css-ui/migrate-hd-color
29. Evil Martians report that Chrome and Safari use the clipping method for out of gamut colours rather than the OKLCH method the spec requires. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
30. CSS Color 4 gives a clipping example where the OkLCh hue angle changes from 265.1° to 196.1°, a change of 69°. | https://www.w3.org/TR/css-color-4/
31. Evil Martians set L to 0.8 and C to 0.17 on a hue taken from a user's avatar colour and keep black text on it. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
32. Computed with Ottosson's Oklab conversion, the maximum in gamut sRGB chroma at L 0.62 is about 0.13 for hue 90 and about 0.21 for hue 260. | https://bottosson.github.io/posts/oklab/
33. Tailwind's default palette lists yellow-500 as oklch(79.5% 0.184 86.047) and blue-500 as oklch(62.3% 0.214 259.815). | https://tailwindcss.com/docs/colors
34. Computed with Ottosson's conversion, oklch(0.62 0.20 260), oklch(0.62 0.16 150), oklch(0.62 0.21 25) and oklch(0.93 0.005 260) are inside sRGB, and oklch(0.62 0.215 260) is inside Display P3. | https://bottosson.github.io/posts/oklab/
35. Computed with Ottosson's conversion, sRGB holds about chroma 0.16 at L 0.70 for hue 260, so oklch(0.70 0.20 260) is outside sRGB. | https://bottosson.github.io/posts/oklab/
36. Relative colour syntax keeps the origin colour's channels where the keywords l, c and h are used, so calc(l - 0.07) changes only lightness. | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
37. Evil Martians say % does not work in calc() or relative colours for OKLCH lightness. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
38. oklch() was added in Safari 15.4, Chrome 111, Edge 111 and Firefox 113. | https://bcd.developer.mozilla.org/bcd/api/v0/current/css.types.color.oklch.json
39. MDN marks oklch() Baseline widely available and says it has been "available across browsers since May 2023". | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
40. Relative colour syntax in oklch() has full support from Chrome 122, Edge 122, Firefox 128 and Safari 18. | https://bcd.developer.mozilla.org/bcd/api/v0/current/css.types.color.oklch.json
41. Evil Martians list the oklch.com picker and converter, the Huetone palette generator, npx convert-to-oklch, stylelint-gamut and the Color.js and culori libraries. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
42. Evil Martians say Huetone uses Oklab by default. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
43. stylelint-gamut detects P3 colours that need to be wrapped in @media (color-gamut: p3). | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
44. culori's toGamut converts a colour to OKLCH (by default) and finds the largest chroma that is in the destination gamut. | https://culorijs.org/api/
45. An Evil Martians article dated 28 May 2025 says "Figma doesn't support OKLCH in its color picker just yet". | https://evilmartians.com/chronicles/exploring-the-oklch-ecosystem-and-its-tools
46. The OkColor Figma plugin can copy colours as oklch() using its OkLCh (CSS) format. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
47. Harmonizer takes its colour space (P3 or sRGB) from the Figma document. | https://evilmartians.com/opensource/harmonizer
48. Polychrom is a Figma plugin that checks text contrast with APCA and shows and adjusts colours in OKLCH. | https://evilmartians.com/chronicles/exploring-the-oklch-ecosystem-and-its-tools
49. Evil Martians report a bug where pasting an oklch() value into Figma's hex input breaks when the file uses a P3 colour profile. | https://evilmartians.com/chronicles/exploring-the-oklch-ecosystem-and-its-tools
50. Tailwind v4's blue ramp from 50 to 950 has L values 97%, 93.2%, 88.2%, 80.9%, 70.7%, 62.3%, 54.6%, 48.8%, 42.4%, 37.9%, 28.2%. | https://tailwindcss.com/docs/colors
51. Tailwind's blue chroma is 0.014 at 50, 0.245 at 600 and 0.091 at 950. | https://tailwindcss.com/docs/colors
52. Tailwind's blue hue runs from 254.604 at blue-50 to 267.935 at blue-950. | https://tailwindcss.com/docs/colors
53. Evil Martians' sample palette uses oklch(0.96 0.005 300) for a light surface and oklch(0.29 0.01 300) for a dark one. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
54. Tailwind v4.0 (22 Jan 2025) moved its default palette from rgb to oklch and tried to keep the balance between colours the same as in v3. | https://tailwindcss.com/blog/tailwindcss-v4
55. Evil Martians' article "OKLCH in CSS: why we moved from RGB and HSL" is by Andrey Sitnik and Travis Turner and dated 17 Sep 2025 on the page. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
56. "Migrate to HD CSS color" on Chrome for Developers is by Adam Argyle. | https://developer.chrome.com/docs/css-ui/migrate-hd-color
57. Ottosson's post is titled "A perceptual color space for image processing". | https://bottosson.github.io/posts/oklab/
58. The current CSS Color 4 is a W3C Candidate Recommendation Draft dated 12 Nov 2026. | https://www.w3.org/TR/css-color-4/
