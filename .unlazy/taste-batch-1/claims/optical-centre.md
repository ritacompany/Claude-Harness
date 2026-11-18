# Claims: optical-centre

1. Apple's WWDC25 session "Get to know the new design system" says that "to preserve optical balance, views are mathematically centered when it makes sense" and "subtly offset when it doesn't". | https://developer.apple.com/videos/play/wwdc2025/356/
2. That statement sits in the session's Design language chapter. | https://developer.apple.com/videos/play/wwdc2025/356/
3. The optical centre of a rectangular region sits slightly above its geometric centre. | https://sites.math.duke.edu/education/ccp/resources/write/design/graphic7.html
4. The same page says mat board for photographs and artwork "is usually slightly wider at the bottom". | https://sites.math.duke.edu/education/ccp/resources/write/design/graphic7.html
5. Pixso says "A play triangle, for example, has more visible area near its flat edge than near its point." | https://pixso.net/articles/alignment-icon/
6. IconBuddy says a play button placed in a circle and perfectly centred looks "like it's sliding off to the left". | https://iconic.iconbuddy.com/p/week-01-why-your-icons-look-off
7. IconBuddy says triangles, arrows and asymmetric glyphs carry "their visual weight away from their geometric center". | https://iconic.iconbuddy.com/p/week-01-why-your-icons-look-off
8. IconBuddy says "Your eye balances mass, not bounding boxes." | https://iconic.iconbuddy.com/p/week-01-why-your-icons-look-off
9. IconBuddy says a one pixel nudge to the right makes a play button in a circle feel centred. | https://iconic.iconbuddy.com/p/week-01-why-your-icons-look-off
10. IconBuddy describes keylines as guide shapes icon designers use so that shapes of different forms in one bounding box look equally large. | https://iconic.iconbuddy.com/p/week-01-why-your-icons-look-off
11. The IconBuddy article is dated 15 July 2026. | https://iconic.iconbuddy.com/p/week-01-why-your-icons-look-off
12. FontLab says "Overshoots are important to make round letters feel like they are the same height as straight letters." | https://help.fontlab.com/fontlab/8/tutorials/calfonts/3.%20Fitting%20and%20Spacing/03a%20Setting%20Your%20Letter%20Heights/
13. Overshoot is where round or pointed letters extend past the baseline or cap height (or x-height) so they look the same size as flat letters. | https://en.wikipedia.org/wiki/Overshoot_(typography)
14. Wikipedia says "perhaps 1% to 3% of the cap or x-height is typical for O". | https://en.wikipedia.org/wiki/Overshoot_(typography)
15. Wikipedia cites Peter Karow recommending 3% overshoot for O and 5% for A. | https://en.wikipedia.org/wiki/Overshoot_(typography)
16. Figma describes vertical trim as a way to "remove the extra space above and below text". | https://help.figma.com/hc/en-us/articles/360039956634
17. MDN says "Vertical spacing differs between fonts, making consistent typesetting historically challenging on the web." | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim
18. MDN says hanging punctuation may be placed outside the line box. | https://developer.mozilla.org/en-US/docs/Web/CSS/hanging-punctuation
19. jakub.kr says "when a button has both text and an icon, it is better to have slightly less padding on the side of the icon to optically align the content." | https://jakub.kr/components/optical-alignment
20. jakub.kr says "a lot of icon packs already account for this". | https://jakub.kr/components/optical-alignment
21. jakub.kr says that for icons "the best way to fix it is in the svg itself, so no additional margin or padding needs to be added." | https://jakub.kr/components/optical-alignment
22. MDN says text-box-trim "specifies which of the over and under edges of text content to trim from a text element's block container". | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim
23. text-box-trim accepts the values none, trim-start, trim-end and trim-both. | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim
24. The text-box-edge value cap trims the over edge of the text element's block container to the top of the capital letters. | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-edge
25. The text-box-edge value alphabetic trims the under edge flush with the text baseline. | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-edge
26. `text-box-edge: cap alphabetic` is a valid value. | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-edge
27. text-box-edge has no effect if text-box-trim is not set or is set to none. | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-edge
28. text-box is a shorthand for text-box-trim and text-box-edge, and `text-box: trim-start cap alphabetic` is one of MDN's syntax examples. | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box
29. MDN marks text-box-trim as Baseline 2026, newly available since August 2026, and warns it might not work in older devices or browsers. | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim
30. MDN marks text-box-edge as Baseline 2026, newly available since August 2026. | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-edge
31. MDN marks the text-box shorthand as Baseline 2026, newly available since August 2026. | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box
32. MDN says hanging-punctuation "specifies whether a punctuation mark should hang at the start or end of a line of text". | https://developer.mozilla.org/en-US/docs/Web/CSS/hanging-punctuation
33. The hanging-punctuation value first makes an opening bracket or quote at the start of the first formatted line of an element hang. | https://developer.mozilla.org/en-US/docs/Web/CSS/hanging-punctuation
34. MDN marks hanging-punctuation as Limited availability, not Baseline. | https://developer.mozilla.org/en-US/docs/Web/CSS/hanging-punctuation
35. Can I use lists full hanging-punctuation support only in Safari (and Safari on iOS) from version 17.4. | https://caniuse.com/css-hanging-punctuation
36. Can I use lists no hanging-punctuation support in Chrome, Edge or Firefox. | https://caniuse.com/css-hanging-punctuation
37. Figma's type settings have a Basics tab with an option to toggle vertical trim. | https://help.figma.com/hc/en-us/articles/360039956634
38. Figma's help says "This allows text layers to behave like other components in your layout" about vertical trim. | https://help.figma.com/hc/en-us/articles/360039956634
39. With vertical trim enabled, Figma's Dev Mode shows `leading-trim: both;` in the Typography section. | https://help.figma.com/hc/en-us/articles/360039956634
40. Figma's help calls leading-trim and text-edge draft features that aren't widely supported by web browsers. | https://help.figma.com/hc/en-us/articles/360039956634
41. MDN documents the trim properties as text-box-trim and text-box-edge. | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim
42. Pixso says "Do not automatically enlarge every circle to 26 px or offset every triangle by 1 px." | https://pixso.net/articles/alignment-icon/
43. Pixso advises: "Keep a geometrically centered version beside the candidate." | https://pixso.net/articles/alignment-icon/
44. Pixso advises viewing buttons at their intended display size, not only at a large canvas zoom. | https://pixso.net/articles/alignment-icon/
45. Pixso says a right pointing play triangle may need a small shift toward its point. | https://pixso.net/articles/alignment-icon/
46. The Pixso article was published 30 May 2026. | https://pixso.net/articles/alignment-icon/
