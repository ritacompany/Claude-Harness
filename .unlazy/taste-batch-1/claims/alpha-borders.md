# Claims: alpha-borders

1. Cloud Four's example panel uses a subtle grey #ddd border, and the design works less well when the page background gets closer to #ddd. | https://cloudfour.com/thinks/building-flexible-components-with-transparency/
2. Cloud Four replaces the #ddd border with rgba(0, 0, 0, 0.135). | https://cloudfour.com/thinks/building-flexible-components-with-transparency/
3. Cloud Four says this "matches #ddd on white backgrounds but automatically appears darker on other backgrounds". | https://cloudfour.com/thinks/building-flexible-components-with-transparency/
4. Cloud Four says: "This technique works best when using a transparent black or white." | https://cloudfour.com/thinks/building-flexible-components-with-transparency/
5. Cloud Four warns that with transparency it is easy to end up with combinations that lack accessible contrast. | https://cloudfour.com/thinks/building-flexible-components-with-transparency/
6. The Cloud Four article is by Paul Hebert, published 19 Nov 2020. | https://cloudfour.com/thinks/building-flexible-components-with-transparency/
7. Anthony Hobday's example shows a solid grey border lost against a light blue background, while a black border at 10% opacity darkens both the white and light blue backgrounds and is visible against both. | https://anthonyhobday.com/sideprojects/visualtechniques/techniques/borders/transparent-border-for-contrast
8. Hobday warns that the border's shift from one background colour to another "can look bad in a different way". | https://anthonyhobday.com/sideprojects/visualtechniques/techniques/borders/transparent-border-for-contrast
9. Hobday: "If your background is likely to be dark, your semi-transparent border will need to be less transparent." | https://anthonyhobday.com/sideprojects/visualtechniques/techniques/borders/semi-transparent-border-as-element-contrast-helper
10. Mathias Beke's image border uses outline: 1px solid rgba(0, 0, 0, 0.1) with outline-offset: -1px, drawn on the image rather than around it. | https://www.denbeke.be/blog/?p=1753
11. Beke's post is dated 15 Jan 2015. | https://www.denbeke.be/blog/?p=1753
12. Beke notes the :after pseudo element alternative needs a container because :after does not work on img elements. | https://www.denbeke.be/blog/?p=1753
13. MDN: for outline-offset, "A negative value places the outline inside the element". | https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset
14. MDN: outlines "don't take up space, so they don't affect the layout of the document in any way". | https://developer.mozilla.org/en-US/docs/Web/CSS/outline
15. MDN lists border-radius as a property that affects an outline's corner angles. | https://developer.mozilla.org/en-US/docs/Web/CSS/outline
16. MDN: "The background is always drawn behind the border". | https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip
17. The initial value of background-clip is border-box, under which the background extends to the outside edge of the border, underneath it. | https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip
18. MDN: with background-clip: padding-box, "No background is drawn beneath the border." | https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip
19. light-dark() returns its first value when the used colour scheme is light (or no preference) and its second when it is dark. | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
20. light-dark() needs color-scheme set to light dark, usually on :root. | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
21. MDN marks light-dark() Baseline 2024, available across latest browsers since May 2024. | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
22. WCAG SC 1.4.11 requires visual information needed to identify user interface components and states to have a contrast ratio of at least 3:1 against adjacent colours. | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
23. The understanding document says the criterion does not require controls to have a visual boundary indicating the hit area, and a boundary is only required when there is no other visual way to identify the control. | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
24. The understanding document says "particularly thin lines and shapes of non-text elements may be rendered by user agents with a much fainter color". | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
25. WCAG defines contrast ratio as (L1 + 0.05) / (L2 + 0.05) and relative luminance as 0.2126 R + 0.7152 G + 0.0722 B on linearised sRGB channels (threshold 0.04045). The entry's worked values follow from this: black at 10% over white composites to #e6e6e6 at about 1.25:1; black needs about 42% alpha for 3:1 on white; white needs about 34% for 3:1 on #121212; black at 10% on #121212 is about 1.02:1. | https://www.w3.org/TR/WCAG22/
26. Figma's stroke position menu applies a stroke inside, outside or centre of the layer's path. | https://help.figma.com/hc/en-us/articles/360049283914
27. Figma: most shapes are set to inside by default, except lines, which are set to centre. | https://help.figma.com/hc/en-us/articles/360049283914
28. Figma's stroke colour picker sets fill type, value and opacity. | https://help.figma.com/hc/en-us/articles/360049283914
29. Figma does not include stroke weight in a layer's dimensions, except that an auto layout frame can be set to include strokes. | https://help.figma.com/hc/en-us/articles/360049283914
30. Figma colour variables can be applied to stroke colours. | https://help.figma.com/hc/en-us/articles/15343107263511
31. Apple's HIG says an icon of a drop of oil might need a slight border to make its edge visible against a dark background. | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/dark-mode.json
32. Figma variable modes let one variable hold different values for contexts such as light and dark themes. | https://help.figma.com/hc/en-us/articles/15343816063383
