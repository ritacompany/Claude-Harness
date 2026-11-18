# Claims: tabular-numbers

1. Tabular figures are set on a fixed width. | https://practicaltypography.com/alternate-figures.html
2. Proportional figures are set on varying widths that suit the shape of the figure. | https://practicaltypography.com/alternate-figures.html
3. The OpenType 'tnum' feature replaces figure glyphs set on proportional widths with corresponding glyphs set on uniform (tabular) widths. | https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt
4. The OpenType 'pnum' feature replaces figure glyphs set on uniform (tabular) widths with corresponding glyphs set on proportional widths. | https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt
5. 'tnum' overrides the results of 'pnum', and 'pnum' overrides the results of 'tnum'. | https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt
6. The OpenType spec says tabular widths "will generally, but not always, be the default". | https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt
7. The spec's UI suggestion for both 'tnum' and 'pnum' is that the feature should be off by default. | https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt
8. The spec's example for 'tnum' is getting oldstyle figures that align vertically in a column. | https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt
9. The spec's example for 'pnum' is "even spacing for lining figures used as dates in an all-cap headline". | https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt
10. Butterick says the default figures on many fonts, especially system fonts, are tabular lining figures. | https://practicaltypography.com/alternate-figures.html
11. Lining figures are usually the same height as caps. | https://practicaltypography.com/alternate-figures.html
12. MDN describes lining-nums as figures that are all lying on the baseline, corresponding to OpenType lnum. | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric
13. MDN describes oldstyle-nums as figures where some numbers, like 3, 4, 7, 9, have descenders, corresponding to OpenType onum. | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric
14. Oldstyle figures are designed to look more like lowercase letters. | https://practicaltypography.com/alternate-figures.html
15. The spec says the 'lnum' feature "is distinct from the figure width features ('pnum' and 'tnum')". | https://learn.microsoft.com/en-us/typography/opentype/spec/features_ko
16. The spec says 'onum' is separate from the figure width features 'pnum' and 'tnum'. | https://learn.microsoft.com/en-us/typography/opentype/spec/features_ko
17. Figma's Numbers Style options are offered as proportional or monospace, each in lining (uppercase) or old-style (lowercase), giving four combinations. | https://help.figma.com/hc/en-us/articles/360039956634
18. REMOVED: source dropped, the page carried a hidden instruction to the reading agent.
19. REMOVED: source dropped, the page carried a hidden instruction to the reading agent.
20. REMOVED: source dropped, the page carried a hidden instruction to the reading agent.
21. Butterick says "tabular figures are essential for one purpose: vertically aligned columns". | https://practicaltypography.com/alternate-figures.html
22. Dialpad's Dialtone design system recommends tabular figures for aligning tabular data and "preventing layout shifts of dynamically-changing content". | https://dialtone.dialpad.com/utilities/typography/font-variant-numeric.html
23. Dialtone gives "a timer counting down" as its example of dynamically changing content. | https://dialtone.dialpad.com/utilities/typography/font-variant-numeric.html
24. Butterick says "In body text, proportional figures are preferred because they tend to have more even spacing and a more consistent appearance." | https://practicaltypography.com/alternate-figures.html
25. Butterick says "Not every font has every set of alternate figures." | https://practicaltypography.com/alternate-figures.html
26. The DEV article says "A font without tnum glyphs will silently do nothing." | https://dev.to/alanwest/tabular-numbers-in-css-font-variant-numeric-vs-monospace-hacks-25cn
27. The DEV article describes using a monospace font to stop digits jittering as a hack and recommends font-variant-numeric: tabular-nums instead. | https://dev.to/alanwest/tabular-numbers-in-css-font-variant-numeric-vs-monospace-hacks-25cn
28. MDN maps tabular-nums to OpenType tnum. | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric
29. MDN maps proportional-nums to OpenType pnum. | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric
30. The initial value of font-variant-numeric is normal. | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric
31. MDN lists font-variant-numeric as available across browsers since January 2020. | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric
32. MDN's font-feature-settings examples include `td.tabular { font-feature-settings: "tnum"; }` to enable tabular figures. | https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings
33. MDN says "Whenever possible, Web authors should instead use the font-variant shorthand property or an associated longhand property" rather than font-feature-settings. | https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings
34. MDN says the font-variant properties give "more effective, predictable, understandable results" than font-feature-settings. | https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings
35. MDN lists font-feature-settings as available across browsers since March 2016. | https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings
36. The spec says the 'kern' feature should not be used in combination with features that result in fixed-width metrics, 'tnum' among them, and should be disabled for a run where one is active. | https://learn.microsoft.com/en-us/typography/opentype/spec/features_ko
37. In Figma, the type settings are opened from the Typography section of the right sidebar and number options are on the Details tab. | https://help.figma.com/hc/en-us/articles/360039956634
38. Figma's help says "Monospace figures, also known as tabular figures, have the same width regardless of the character being used." | https://help.figma.com/hc/en-us/articles/360039956634
39. Figma's help says "Hover over any feature or property to see the preview." | https://help.figma.com/hc/en-us/articles/360039956634
40. Figma's help says of the Numbers section: "The properties in this section will depend on the font family you are using." | https://help.figma.com/hc/en-us/articles/360039956634
41. Butterick says "It's never wrong to use the default figures in your font." | https://practicaltypography.com/alternate-figures.html
42. Butterick says "With caps, however, you should not use oldstyle figures. They look wrong." | https://practicaltypography.com/alternate-figures.html
43. Butterick's test for tabular figures: type a line of zeroes above a line of ones; if they are the same length, the font has tabular figures. | https://practicaltypography.com/alternate-figures.html
