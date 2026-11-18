# Claims: matched-icon-weight

1. SF Symbols comes in nine symbol weights, from ultralight to black. | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
2. Each SF Symbols weight corresponds to a weight of the San Francisco system font. | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
3. Apple says this correspondence helps "achieve precise weight matching between symbols and adjacent text". | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
4. Each SF Symbol is available in three scales: small, medium (the default) and large. | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
5. The SF Symbols scales are defined relative to the cap height of the San Francisco system font. | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
6. Apple says specifying a scale "lets you adjust a symbol's emphasis compared to adjacent text, without disrupting the weight matching with text that uses the same point size." | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
7. Apple describes an outlined symbol as having no solid areas, "resembling the appearance of text". | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
8. Apple says the outline variant works well in toolbars, lists and other places where a symbol is displayed alongside text. | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
9. Apple says the solid areas of the fill variant give "more visual emphasis", making it a good choice for iOS tab bars, swipe actions and places where an accent colour communicates selection. | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
10. Apple says symbols that use an enclosing shape "can improve legibility at small sizes". | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
11. Apple's SF Symbols terms prohibit using symbols in app icons, logos or any other trademarked use. | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
12. The Material Symbols weight axis ranges from thin (100) to bold (700). | https://developers.google.com/fonts/docs/material_symbols
13. Google says adjustments to Material Symbols grade are more granular than adjustments to weight. | https://developers.google.com/fonts/docs/material_symbols
14. Google says "You can match grade levels between text and symbols for a harmonious visual effect." | https://developers.google.com/fonts/docs/material_symbols
15. Google suggests a low grade, for example -25, "to reduce glare for a light symbol on a dark background". | https://developers.google.com/fonts/docs/material_symbols
16. Material Symbols optical sizes range from 20dp to 48dp. | https://developers.google.com/fonts/docs/material_symbols
17. Google says optical size "offers a way to automatically adjust the stroke weight when you increase or decrease the symbol size". | https://developers.google.com/fonts/docs/material_symbols
18. The Material Symbols fill axis takes 0 for default and 1 for completely filled. | https://developers.google.com/fonts/docs/material_symbols
19. Google says "To convey a state transition, use the fill axis for animation or interaction." | https://developers.google.com/fonts/docs/material_symbols
20. Google's Material Symbols guide shows axis ranges requested in the format number..number. | https://developers.google.com/fonts/docs/material_symbols
21. Lucide icons have a default stroke width of 2px. | https://lucide.dev/guide/basics/stroke-width
22. Lucide says that when the size prop changes, "the size of the stroke width will be relative to the size of the icon". | https://lucide.dev/guide/basics/stroke-width
23. Lucide offers a strokeWidth prop and a nonScalingStroke prop that makes the stroke width constant. | https://lucide.dev/guide/basics/stroke-width
24. Given a 2px stroke on a 24px canvas that scales with size, a Lucide icon renders a stroke of about 1.33px at 16px and about 2.67px at 32px (arithmetic from claims 21, 22 and 25). | https://lucide.dev/guide/basics/stroke-width
25. Lucide icons must be designed on a 24 by 24 pixel canvas. | https://lucide.dev/guide/design/icon-design-guide
26. Lucide requires round line caps on open paths and round line joins. | https://lucide.dev/guide/design/icon-design-guide
27. Lucide uses a 2px corner radius for shapes at least 8px wide or tall. | https://lucide.dev/guide/design/icon-design-guide
28. Lucide's guide says "Lucide is a consistent icon set, not a collection of unrelated icons." | https://lucide.dev/guide/design/icon-design-guide
29. With vector-effect: non-scaling-stroke, the stroke width does not depend on the element's transformations or zoom level. | https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/vector-effect
30. vector-effect has been available across browsers since July 2020. | https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/vector-effect
31. MDN calls font-variation-settings a low level mechanism to use only when no basic property exists to set the feature. | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
32. MDN maps the registered wght axis to the font-weight property. | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
33. The registered axes MDN maps to CSS properties are wght, wdth, slnt, ital and opsz; custom axes are given upper case tags (so FILL and GRAD have no property of their own). | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
34. The CSS cap unit equals the cap height (nominal height of capital letters) of the element's font. | https://developer.mozilla.org/en-US/docs/Web/CSS/length
35. Ahmad Shadeed's example sizes a button's SVG icon at 1.65cap with a 0.5cap gap. | https://ishadeed.com/article/css-cap-unit/
36. The cap unit was first released in Firefox (Feb 2022), Chrome (Sep 2023) and Safari (Dec 2023). | https://ishadeed.com/article/css-cap-unit/
37. Ahmad Shadeed's cap unit article was published on 5 Jun 2024. | https://ishadeed.com/article/css-cap-unit/
38. In Figma, a text layer in a variable font has a Variable tab in the type settings with sliders and input boxes for each axis. | https://help.figma.com/hc/en-us/articles/5579502031511
39. Figma's scale tool (shortcut K) scales blurs and strokes along with the layer. | https://help.figma.com/hc/en-us/articles/360040451453
40. Figma's scale tool cannot scale locked layers or layers nested inside a component instance. | https://help.figma.com/hc/en-us/articles/360040451453
