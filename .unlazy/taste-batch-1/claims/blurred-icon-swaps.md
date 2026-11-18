# Claims: blurred-icon-swaps

1. Emil Kowalski's tip shows a button that crossfades between two states and a version that adds 2px of blur to that animation. | https://emilkowal.ski/ui/7-practical-animation-tips
2. Emil Kowalski writes "Blur works here because it bridges the visual gap between the old and new states." | https://emilkowal.ski/ui/7-practical-animation-tips
3. Emil Kowalski writes that without blur "you see two distinct objects, which feels less natural." | https://emilkowal.ski/ui/7-practical-animation-tips
4. Emil Kowalski says UI animations should generally stay under 300ms. | https://emilkowal.ski/ui/7-practical-animation-tips
5. Emil Kowalski says to use ease-out for something entering or exiting the screen. | https://emilkowal.ski/ui/7-practical-animation-tips
6. Emil Kowalski says scale(0) "looks like the element comes out of nowhere" and suggests animating from a higher initial scale (0.9+). | https://emilkowal.ski/ui/7-practical-animation-tips
7. Emil Kowalski says a 180ms select animation "feels more responsive than a 400ms one". | https://emilkowal.ski/ui/7-practical-animation-tips
8. Emil Kowalski writes "Remove animations or hover interactions altogether if they are seen tens, maybe even hundreds of times a day." | https://emilkowal.ski/ui/7-practical-animation-tips
9. The Icon Swap component on chanhdai.com enters from opacity 0, scale 0.25 and blur(4px) to opacity 1, scale 1 and blur(0px). | https://chanhdai.com/blog/icon-swap
10. The Icon Swap component exits to opacity 0, scale 0.25 and blur(4px). | https://chanhdai.com/blog/icon-swap
11. The Icon Swap component uses a spring transition with duration 0.3 and bounce 0. | https://chanhdai.com/blog/icon-swap
12. The Icon Swap component uses AnimatePresence with mode="popLayout" and initial={false}. | https://chanhdai.com/blog/icon-swap
13. The Icon Swap page credits Emil Kowalski for the blur technique. | https://chanhdai.com/blog/icon-swap
14. The Icon Swap page was last updated on 18 May 2026. | https://chanhdai.com/blog/icon-swap
15. The jakub.kr "Animating icons" page describes animating opacity, scale and blur in buttons when different icons are shown contextually. | https://jakub.kr/components/animating-icons
16. The jakub.kr author prefers Motion because it makes spring animations easy. | https://jakub.kr/components/animating-icons
17. The SF Symbols Replace animation has three configurations: down-up, up-up and off-up. | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
18. In the down-up configuration the outgoing symbol scales down and the incoming symbol scales up, "communicating a change in state". | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
19. Magic Replace transitions between symbols with related shapes; between unrelated symbols the default down-up animation occurs instead. | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
20. Apple's description of the Replace animation mentions scaling and does not mention blur. | https://developer.apple.com/design/human-interface-guidelines/sf-symbols
21. "Animating a blur" is by Surma and Yi Gu on the Chrome for Developers site, last updated 11 Oct 2017. | https://developer.chrome.com/blog/animated-blur
22. The article says blur is a convolution filter, where every output pixel considers a number of input pixels. | https://developer.chrome.com/blog/animated-blur
23. The article says "The bigger the image or the bigger the blur radius, the more costly the effect is." | https://developer.chrome.com/blog/animated-blur
24. The article reports its animated blur running "well below 60fps". | https://developer.chrome.com/blog/animated-blur
25. The article recommends pre-computing a series of increasingly blurred versions and cross-fading between them. | https://developer.chrome.com/blog/animated-blur
26. web.dev's animations guide, by Kayce Basques and Rachel Andrew, advises restricting animations to opacity and transform where possible. | https://web.dev/articles/animations-guide
27. Motion's performance guide says "Chrome and Firefox handle filter and SVGs entirely on the compositor." | https://motion.dev/docs/performance
28. Motion's performance guide says to stick to transform, filter, clipPath and opacity when the main thread is busy. | https://motion.dev/docs/performance
29. AnimatePresence lets children fire the animations on their exit props before the component is removed from the DOM. | https://motion.dev/docs/react-animate-presence
30. Changing the key of a single child of AnimatePresence swaps the content (the docs use slideshows as the example). | https://motion.dev/docs/react-animate-presence
31. In AnimatePresence popLayout mode, exiting elements are popped out of the page layout so surrounding elements reflow immediately. | https://motion.dev/docs/react-animate-presence
32. initial={false} on AnimatePresence disables initial animations on children present when the component first renders. | https://motion.dev/docs/react-animate-presence
33. With MotionConfig reducedMotion="user", motion components disable transform and layout animations while preserving values like opacity and backgroundColor. | https://motion.dev/docs/react-accessibility
34. Motion's accessibility page does not say how filter animations are handled under reducedMotion="user". | https://motion.dev/docs/react-accessibility
35. Motion's useReducedMotion hook returns true or false depending on whether the visitor has Reduced Motion enabled. | https://motion.dev/docs/react-accessibility
36. MDN says prefers-reduced-motion conveys that the user prefers an interface that removes, reduces or replaces motion based animations. | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
37. MDN says animations such as scaling or panning large objects can be vestibular motion triggers. | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
38. Google's Material Symbols guide says to use the fill axis to convey a state transition. | https://developers.google.com/fonts/docs/material_symbols
39. Figma's smart animate matches layers using both the layer's name and its position in the hierarchy. | https://help.figma.com/hc/en-us/articles/360039818874
40. Figma's smart animate article lists scale, position, opacity, rotation and fill as properties it handles. | https://help.figma.com/hc/en-us/articles/360039818874
41. Figma's help recommends adjusting opacity through the layer property rather than the fill. | https://help.figma.com/hc/en-us/articles/360039818874
42. Figma says it supports smart animate for layers with texture, noise, background blur or layer blur effects applied. | https://help.figma.com/hc/en-us/articles/360039818874
43. Figma's smart animate article does not say that the blur radius itself is interpolated. | https://help.figma.com/hc/en-us/articles/360039818874
