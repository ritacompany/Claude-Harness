1. CSS Values and Units Level 4 defines large, small and dynamic viewport sizes with lv*, sv* and dv* units. | https://www.w3.org/TR/css-values-4/
2. The spec defines the large viewport as "the viewport sized assuming any UA interfaces that are dynamically expanded and retracted to be retracted". | https://www.w3.org/TR/css-values-4/
3. The spec defines the default v* units (vh, vw) with respect to the large viewport size. | https://www.w3.org/TR/css-values-4/
4. The spec says the mapping of default units to the large viewport units is "presumed to be required for Web compatibility". | https://www.w3.org/TR/css-values-4/
5. The spec defines the small viewport as the viewport sized assuming those UA interfaces are expanded, and says small units are fixed and stable unless the viewport itself is resized. | https://www.w3.org/TR/css-values-4/
6. The spec defines dynamic units "with dynamic consideration" of UA interfaces and says they are not stable even while the viewport itself is unchanged. | https://www.w3.org/TR/css-values-4/
7. The spec says large unit content "might be hidden behind such interfaces when they are expanded". | https://www.w3.org/TR/css-values-4/
8. The spec says an element sized as height: 100svh "will fill the screen perfectly, without any of its content being obscured" when the UA's dynamic UI is shown, and will have "extra space" around it once that UI hides. | https://www.w3.org/TR/css-values-4/
9. The spec calls the small viewport units "safer" in general. | https://www.w3.org/TR/css-values-4/
10. The spec says dynamic units "can cause content to resize e.g. while the user scrolls the page" and that this "can be disturbing to the user and/or costly in terms of performance". | https://www.w3.org/TR/css-values-4/
11. The spec says the UA is not required to animate dynamic units during the UI expansion or retraction and recommends assuming the fully retracted size for that duration. | https://www.w3.org/TR/css-values-4/
12. The spec says on-screen keyboards typically fall into the category of interfaces that overlay content and have no effect on viewport-percentage lengths. | https://www.w3.org/TR/css-values-4/
13. The spec defines vi and vb as 1% of the viewport size in the box's inline axis and block axis. | https://www.w3.org/TR/css-values-4/
14. The CSS Values and Units Level 4 document at that URL is a W3C Working Draft dated 12 March 2024. | https://www.w3.org/TR/css-values-4/
15. MDN says "Currently, all default viewport units (vh, vw, etc.) are equivalent to their large viewport counterparts (lvh, lvw, etc.)." | https://developer.mozilla.org/en-US/docs/Web/CSS/length
16. MDN calls the small viewport-percentage units "safer" to use in general. | https://developer.mozilla.org/en-US/docs/Web/CSS/length
17. MDN says dynamic viewport units can cause content to resize while a user scrolls and can cause a performance hit. | https://developer.mozilla.org/en-US/docs/Web/CSS/length
18. web.dev says elements sized to be 100vh tall "will bleed out of the viewport" on mobile when the dynamic toolbars are expanded. | https://web.dev/blog/viewport-units
19. web.dev says dynamic viewport values are "clamped between their lv* and sv* counterparts". | https://web.dev/blog/viewport-units
20. web.dev lists the units svw, svh, svi, svb, svmin, svmax and the same with lv and dv prefixes. | https://web.dev/blog/viewport-units
21. web.dev says "The values for the dynamic viewport do not update at 60fps. In all browsers updating is throttled as the UA UI expands or retracts." | https://web.dev/blog/viewport-units
22. web.dev says the on-screen keyboard "is not considered part of the UA UI". | https://web.dev/blog/viewport-units
23. web.dev says the new units ship in Chrome 108, joining Safari and Firefox which already had support. | https://web.dev/blog/viewport-units
24. The web.dev viewport units article is by Bramus. | https://web.dev/blog/viewport-units
25. WebKit announced the svh, lvh and dvh units (and related variants) as new in Safari 15.4, in a post dated 14 March 2022. | https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/
26. Ahmad Shadeed's article says that with 100vh a hero's element is "blurred underneath the address bar UI in iOS Safari and cropped in Android browsers". | https://ishadeed.com/article/new-viewport-units/
27. Ahmad Shadeed's article says using 100vh makes the bottom part of a modal invisible. | https://ishadeed.com/article/new-viewport-units/
28. Ahmad Shadeed's article says using svh solves the hero case. | https://ishadeed.com/article/new-viewport-units/
29. Ahmad Shadeed's article says the modal case can be solved with either svh or dvh. | https://ishadeed.com/article/new-viewport-units/
30. Ahmad Shadeed's article says dvh "will change as you scroll, so it might create a confusing experience when used for stuff like font-size". | https://ishadeed.com/article/new-viewport-units/
31. Ahmad Shadeed's article is dated 8 July 2023. | https://ishadeed.com/article/new-viewport-units/
32. caniuse lists small, large and dynamic viewport units as supported from Chrome 108, Edge 108, Safari 15.4, Safari on iOS 15.4, Firefox 101 and Samsung Internet 21. | https://caniuse.com/viewport-unit-variants
33. caniuse put global usage support for viewport unit variants at about 96% (96.07%) on 18 Nov 2026. | https://caniuse.com/viewport-unit-variants
34. Chrome's blog says that from Chrome 108, Chrome on Android resizes only the visual viewport, not the layout viewport, when the on-screen keyboard shows. | https://developer.chrome.com/blog/viewport-resize-behavior
35. Chrome's blog says showing or hiding the on-screen keyboard does not affect viewport-relative units under this behaviour. | https://developer.chrome.com/blog/viewport-resize-behavior
36. Chrome's blog lists interactive-widget values resizes-visual, resizes-content and overlays-content, where resizes-content resizes both the visual and layout viewport. | https://developer.chrome.com/blog/viewport-resize-behavior
37. The Chrome viewport resize behaviour post is by Bramus. | https://developer.chrome.com/blog/viewport-resize-behavior
38. MDN defines safe-area-inset-top, right, bottom and left as the safe distance from the viewport edge where content will not be cut off by a non-rectangular display. | https://developer.mozilla.org/en-US/docs/Web/CSS/env
39. MDN says the safe-area-inset values are 0 if the viewport is a rectangle with no features occupying viewport space. | https://developer.mozilla.org/en-US/docs/Web/CSS/env
40. MDN says the second argument to env() is a fallback used if the environment variable is not supported or does not exist. | https://developer.mozilla.org/en-US/docs/Web/CSS/env
41. Figma's prototype scroll behavior Position options are Scroll with parent, Fixed and Sticky. | https://help.figma.com/hc/en-us/articles/360039818734
42. Figma's help says "Fixed objects don't move, even as you scroll up and down." | https://help.figma.com/hc/en-us/articles/360039818734
