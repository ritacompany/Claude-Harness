# Claims: oklch-gradients

1. Evil Martians describe a gradient as a path through a colour space, so changing the colour space gives a very different gradient for the same start and end colours. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
2. CSS Images 4 adds a <color-interpolation-method> argument to linear-gradient(), radial-gradient() and conic-gradient(). | https://www.w3.org/TR/css-images-4/
3. CSS Color 4 defines <color-interpolation-method> = in [ <rectangular-color-space> | <polar-color-space> <hue-interpolation-method>? ]. | https://www.w3.org/TR/css-color-4/
4. Rectangular colour spaces include srgb, srgb-linear, display-p3, lab and oklab; polar ones are hsl, hwb, lch and oklch. | https://www.w3.org/TR/css-color-4/
5. The hue interpolation methods are shorter, longer, increasing and decreasing, and shorter is the default. | https://www.w3.org/TR/css-color-4/
6. shorter takes the shorter arc between the two hues and longer takes the longer arc. | https://www.w3.org/TR/css-color-4/
7. Interpolating in OkLCh from oklch(0.6 0.24 30) to oklch(0.8 0.15 90) gives a midpoint of oklch(0.7 0.195 60), a deep orange, with shorter and oklch(0.7 0.195 240), a sky blue, with longer. | https://www.w3.org/TR/css-color-4/
8. With increasing or decreasing, an animated hue does not flip to the other arc when the hue difference passes through 180 degrees. | https://www.w3.org/TR/css-color-4/
9. CSS Images 4 says that if no <color-interpolation-method> is given in a gradient, interpolation uses the default interpolation colour space, Oklab. | https://www.w3.org/TR/css-images-4/
10. CSS Color 4 requires user agents to interpolate between legacy sRGB colour formats (hex, named colours, rgb(), hsl(), hwb()) in gamma encoded sRGB, for web compatibility. | https://www.w3.org/TR/css-color-4/
11. Authors can opt in to other interpolation by using a non legacy colour form for at least one colour or by specifying an interpolation colour space explicitly. | https://www.w3.org/TR/css-color-4/
12. CSS Color 4 calls sRGB "neither linear-light nor perceptually uniform" and says it "produces poorer results (overly dark or greyish mixes)". | https://www.w3.org/TR/css-color-4/
13. CSS Images 4 says a gradient from #f01 to #081 in gamma encoded sRGB is "clearly too dark at the midpoint". | https://www.w3.org/TR/css-images-4/
14. CSS Images 4 says a gradient from white to #01E in sRGB is too dark at the midpoint, a little desaturated and has a slight purplish cast. | https://www.w3.org/TR/css-images-4/
15. CSS Images 4 says CIE Lab avoids the too dark midpoint but has "a significant purple cast", while Oklab has "no purple cast at all". | https://www.w3.org/TR/css-images-4/
16. Ottosson lists "Blending two colors should result in even transitions" as a requirement for his colour space. | https://bottosson.github.io/posts/oklab/
17. Ottosson found CIELAB, CIELUV and HSV all show hue shifts toward purple when blending white with blue. | https://bottosson.github.io/posts/oklab/
18. Ottosson's post lists Oklab as Photoshop's default interpolation method for gradients. | https://bottosson.github.io/posts/oklab/
19. CSS Images 4 draws #A37 to #595 in CIE LCH, CIE Lab, sRGB, Oklab and Oklch and notes: "The rectangular spaces have a greyish midpoint, while the intermediate colors in the polar spaces follow a curved, chroma-preserving path." | https://www.w3.org/TR/css-images-4/
20. CSS Color 4 recommends Oklab when colours "need to be evenly spaced perceptually (such as in a gradient)" and OkLCh when avoiding graying out, i.e. maximising chroma throughout the transition. | https://www.w3.org/TR/css-color-4/
21. Computed with Ottosson's conversion, #2563eb is about oklch(0.546 0.215 262.9) and #facc15 is about oklch(0.861 0.173 91.9). | https://bottosson.github.io/posts/oklab/
22. Computed with Ottosson's conversion, the sRGB midpoint of #2563eb and #facc15 is #909880, with OKLCH chroma about 0.035 and lightness about 0.665. | https://bottosson.github.io/posts/oklab/
23. Computed with Ottosson's conversion, the Oklab midpoint of #2563eb and #facc15 has lightness about 0.703 and chroma about 0.026. | https://bottosson.github.io/posts/oklab/
24. Computed with Ottosson's conversion, the OKLCH (shorter hue) midpoint of #2563eb and #facc15 has chroma about 0.194 at hue about 177, where sRGB holds only about 0.13. | https://bottosson.github.io/posts/oklab/
25. CSS Color 4 says interpolation results, particularly in a polar colour space, may fall outside the gamut of a display even when both end colours are in gamut. | https://www.w3.org/TR/css-color-4/
26. In CSS Color 4's example, interpolating #1A1 to #23F in oklch puts most of the interpolated values outside both srgb and display-p3. | https://www.w3.org/TR/css-color-4/
27. The <color-interpolation-method> can override the default interpolation colour space for color-mix() as well as linear-gradient(). | https://developer.mozilla.org/en-US/docs/Web/CSS/color-interpolation-method
28. MDN's compatibility data describes premultiplied gradients as preventing grays from appearing in gradients with transparency, supported since Chrome 29, Firefox 36 and Safari 15. | https://bcd.developer.mozilla.org/bcd/api/v0/current/css.types.gradient.linear-gradient.json
29. Computed with Ottosson's conversion, oklch(0.75 0.11 190) and oklch(0.5 0.19 265) are inside sRGB. | https://bottosson.github.io/posts/oklab/
30. Computed with Ottosson's conversion, sampling the OKLCH (shorter hue) path from #2563eb to #facc15 every 10%, with chroma reduced at constant lightness and hue where it leaves sRGB, gives #2563eb, #007fcb, #008fbb, #009eb3, #00abab, #00b99f, #00c885, #5fd05d, #a0d139, #d1cf12, #facc15. | https://bottosson.github.io/posts/oklab/
31. The @csstools/postcss-gradients-interpolation-method README example turns a two stop `in oklch` gradient into an rgb() gradient with eleven stops, placed before the preserved original declaration. | https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-gradients-interpolation-method
32. The @csstools/postcss-gradients-interpolation-method plugin does not support variable (var()) colours. | https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-gradients-interpolation-method
33. CSS Color 4 says that if a powerless component is manually specified, it acts as normal. | https://www.w3.org/TR/css-color-4/
34. Under the shorter method, interpolating hue 0 to hue 263 adjusts the first angle to 360, so the midpoint hue is 311.5. | https://www.w3.org/TR/css-color-4/
35. Computed with Ottosson's conversion, oklch(0.775 0.1 311.5) is #cba4e5 and oklch(0.775 0.1 263) is #94b6f6. | https://bottosson.github.io/posts/oklab/
36. A missing (none) component in one colour takes the other colour's value for that component during interpolation. | https://www.w3.org/TR/css-color-4/
37. When a colour is produced by conversion into a polar space and its hue is powerless (chroma at or below epsilon), the hue is set to missing. | https://www.w3.org/TR/css-color-4/
38. The interpolation colour space and hue interpolation method in linear-gradient() were added in Safari 16.2 (13 Dec 2022), Chrome 111 (7 Mar 2023), Edge 111 (13 Mar 2023) and Firefox 127 (11 Jun 2024). | https://bcd.developer.mozilla.org/bcd/api/v0/current/css.types.gradient.linear-gradient.json
39. Figma's gradient types are linear, radial, angular and diamond. | https://help.figma.com/hc/en-us/articles/34208860210199-Use-gradients-as-a-fill-or-stroke
40. In Figma, gradient stops are added by clicking along the gradient slider. | https://help.figma.com/hc/en-us/articles/34208860210199-Use-gradients-as-a-fill-or-stroke
41. The Perceptual Color plugin listing says "the color blending (or interpolation) between colors in Figma is done in RGB color space" and that Figma will not reflect the gradient seen in the plugin or on the web. | https://figma-web.pages.dev/plugins/1266828922235523696
42. Perceptual Color, by Jeremy Knudsen, lets you inspect and manipulate gradients and solid colours in OKLCH on selected layers. | https://figma-web.pages.dev/plugins/1266828922235523696
43. A Figma forum request for more colour spaces and the ability to specify gradient interpolation was posted on 13 Jun 2022, and the thread shows no reply from Figma staff. | https://forum.figma.com/t/support-for-more-color-spaces-including-the-ability-to-specify-gradient-interpolation-method/23804
44. The Figma forum thread has replies into Nov 2026. | https://forum.figma.com/t/support-for-more-color-spaces-including-the-ability-to-specify-gradient-interpolation-method/23804
45. culori's interpolate(colors, mode) returns an interpolator in the given colour space, and samples(n) returns n equally spaced values in [0, 1]. | https://culorijs.org/api/
46. culori interpolates hue along the shortest path by default in colour spaces with a hue channel. | https://culorijs.org/api/
47. culori's formatHex clamps red, green and blue channels to [0, 255], as if passed through clampRgb. | https://culorijs.org/api/
48. culori's toGamut converts to OKLCH by default and finds the largest in gamut chroma. | https://culorijs.org/api/
49. MDN's linear-gradient page shows `linear-gradient(in oklab, blue, red)` and `linear-gradient(in hsl longer hue, blue, red)`. | https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient
50. Evil Martians say Oklab gradients have no grayish area in the middle like default (sRGB) gradients and no blue to purple shift like Lab. | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
51. The current CSS Images 4 is a W3C Working Draft dated 30 Sep 2025. | https://www.w3.org/TR/css-images-4/
52. The current CSS Color 4 is a W3C Candidate Recommendation Draft dated 12 Nov 2026. | https://www.w3.org/TR/css-color-4/
