# Prototypes, websites, effects and motion

Clickable prototypes, mock pages, website builds, hover and button effects, motion studies.

- A mock of a web product renders as a desktop page that fills the browser, also when opened in a
  new tab; never a phone layout unless asked. The page still holds up at phone width.
  (E0040, E0048, E0061, E0128, E0957, E0298)
- Every hover, click, menu, state and transition is wired before he sees it; a static or half wired
  build is not done. (E0038, E0070, E0071, E0221)
- List every state of each screen first, then build each as its own clean view. (E0481, E0534, E0563)
- Lay out for the longest and shortest real content: no fixed heights guessed, text wraps, rows of
  cards stay even. (E0325, E0326, E0327, E0352)
- Hover on every link, button, card and row, small footer links included; never on anything not
  clickable; a hover never moves letters or shifts layout. (E0186, E0558, E1321, E1318, E1472)
- Effects happen in the content itself; never show the box or layer that carries the effect.
  (E0037, E0718, E1750)
- Motion is part of the first draft (scroll, transitions, nav behaviour) and its timing is tuned by
  hand: not too fast, no library default smooth scroll, no cheap parallax. (E0961, E0967, E0227, E0394, E1233, E0757)
- Keep large or flashing effects within what people with visual impairments can tolerate. (E0988)
- The prototype viewer stays out of the way: tabs and viewer navigation in a top bar, a back
  button, an obvious way to switch flows, a short hint on where to start and no hotspot flash. No
  info dock at the bottom; a small collapsible bottom bar only when he asks for one. Tool
  controls may sit in a right sidebar. (E0303, E1580, E1584, E1586, E1585, E1448)
- Deliver decorative shapes and background marks as vector objects, not flattened images.
  (E1325)
- A prototype for the team carries comments that persist with a name on each. (E1577, E1578)
