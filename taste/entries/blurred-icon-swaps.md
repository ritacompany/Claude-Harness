# Blurred icon swaps

- id: blurred-icon-swaps
- kind: technique
- surfaces: product-ui, brochure, motion
- layers: motion, state, interaction
- default: no, opt in for an icon that changes in place to confirm an action
- captured from: charles.unemployed, "10 niche design hacks" (no. 7)
- researched: 18 Nov 2026
- confidence: high on how it is built and on reduced motion, medium on exact values (practitioners publish different ones)

## In one line

When one icon replaces another in the same spot, such as copy turning into a tick, fade the old one
out and the new one in while each scales and blurs, so the change reads as one control changing
state rather than a frame cut.

## What it is

Both icons occupy one slot. The outgoing icon goes from full opacity, full scale and no blur to
transparent, smaller and blurred; the incoming icon runs the same values in reverse, and the two
overlap in time. Emil Kowalski's version takes a plain crossfade and adds "2px of blur to that
animation". The Icon Swap component on chanhdai.com enters from opacity 0, scale 0.25 and `blur(4px)` to
opacity 1, scale 1 and `blur(0px)`, exits the same way, and runs on a spring with a duration of 0.3
and no bounce. It credits Emil Kowalski for the blur. The "Animating icons" write up on jakub.kr
describes the same
move as animating opacity, scale and blur when different icons are shown contextually in a button.

Apple ships the scale half natively. SF Symbols has a Replace animation whose down-up
configuration scales the outgoing symbol down and the incoming symbol up, "communicating a change
in state", and Magic Replace transitions between symbols with related shapes, falling back to
down-up between unrelated ones. Apple's guidelines do not describe a blur in it.

## Why it works

Emil Kowalski's reason: "Blur works here because it bridges the visual gap between the old and new
states." Without it, "you see two distinct objects, which feels less natural." The scale adds a
direction: the old state shrinks away and the new one grows into place, which matches Apple's
framing of down-up as a change in state.

My judgment on why it matters for confirmations: the person just clicked the control, so their eyes
are on it. An instant swap there can look like a flicker or a rendering glitch; a short blurred
crossfade reads as the control answering.

## Use it when

- A control confirms its own action in place: copy to tick, add to added, play to pause, mute to
  unmute, send to sent.
- The two icons are unrelated shapes, so a morph or a fill change is not available.
- The change follows a deliberate click, not a stream of repeated input.

## Do not use it when

- The control is used constantly. Emil Kowalski: "Remove animations or hover interactions
  altogether if they are seen tens, maybe even hundreds of times a day." A row toggle in a dense
  table or a key held down wants an instant swap.
- The person has asked for reduced motion. MDN describes the setting as telling the browser the
  person prefers an interface that removes, reduces or replaces motion based animation, and names
  scaling large objects as a possible vestibular trigger. Drop the scale and blur and keep at most a short opacity fade.
- The icon is large. Animating blur is a convolution: Chrome's engineers write that "The bigger the
  image or the bigger the blur radius, the more costly the effect is", and their animated blur ran
  "well below 60fps". On a hero sized icon or an image, animate opacity and
  scale only, or crossfade between pre blurred copies as that article recommends.
- Many icons swap at once, such as a whole list re-rendering. In my judgment each blurred icon adds
  its own filter cost, and the effect should be kept to the one control the person touched.
- A state axis already exists. Google's guidance for Material Symbols is to use the fill axis for
  state transitions, so a heart filling in is clearer than swapping two glyphs. On Apple platforms
  use the system Replace animation rather than rebuilding it.
- The swap is decoration, not a state change. Cycling icons for interest is motion with no meaning.

## How: code

CSS only. Stack both icons in one grid cell so they overlap and the button never changes width,
and put the scale and blur inside a `no-preference` query so reduced motion gets a plain fade.

```html
<button class="copy" data-copied="false" aria-label="Copy">
  <span class="swap" aria-hidden="true">
    <svg class="swap__copy"><!-- copy icon --></svg>
    <svg class="swap__check"><!-- tick icon --></svg>
  </span>
</button>
```

```css
.swap { display: inline-grid; }
.swap > * { grid-area: 1 / 1; transition: opacity 150ms linear; }
.copy[data-copied="false"] .swap__check,
.copy[data-copied="true"] .swap__copy { opacity: 0; }

@media (prefers-reduced-motion: no-preference) {
  .swap > * {
    transition: opacity 200ms ease-out, transform 200ms ease-out, filter 200ms ease-out;
  }
  .copy[data-copied="false"] .swap__check,
  .copy[data-copied="true"] .swap__copy {
    transform: scale(0.8);
    filter: blur(4px);
  }
}
```

Set `data-copied` and the `aria-label` together in script, then set both back after the
confirmation has been seen.

React with Motion. `AnimatePresence` runs a child's `exit` animation before removing it, changing
the child's `key` swaps it, `mode="popLayout"` pops the exiting element out of the layout so
surrounding elements reflow at once, and `initial={false}` stops the icon animating on first
render.

```jsx
const reduce = useReducedMotion();
const hidden = reduce
  ? { opacity: 0 }
  : { opacity: 0, scale: 0.8, filter: "blur(4px)" };

<AnimatePresence mode="popLayout" initial={false}>
  <motion.span
    key={copied ? "check" : "copy"}
    initial={hidden}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={hidden}
    transition={{ type: "spring", duration: 0.25, bounce: 0 }}
  >
    {copied ? <Check /> : <Copy />}
  </motion.span>
</AnimatePresence>
```

Motion's `reducedMotion="user"` setting disables transform and layout animations while keeping
values like opacity; its docs do not say what happens to `filter`, so the snippet drops the blur
itself with `useReducedMotion`.

Performance: web.dev's advice is to restrict animations to `opacity` and `transform` where
possible. Motion's performance guide says Chrome and Firefox handle `filter` entirely on the
compositor and lists `filter` with `transform`, `clipPath` and `opacity` as the properties to stick
to when the main thread is busy. Chrome's own blur article shows the cost grows with area and
radius. My judgment from those three: a 4px blur on a 16 to 24px icon for 200ms is cheap, and the
same blur on a large element is not.

## How: Figma

Make two frames, one for each state, each holding both icon layers with identical names in the same
place in the hierarchy (smart animate matches layers by name and position in the hierarchy). In
each frame set the hidden icon to opacity 0 at the layer level, scaled down to about 80% and with a
4px layer blur. Connect the frames with Smart animate, ease out, around 200ms. Figma's help lists
scale, position, opacity, rotation and fill as what smart animate handles and says it supports
layers with layer blur applied; it does not say the blur radius itself is interpolated, so preview
the prototype before relying on the blur.

## Defaults to start from

These are judgment within the published values:

- Duration 200ms, ease-out, or a spring with duration 0.25 and no bounce. Emil Kowalski keeps UI
  animations under 300ms and uses ease-out for anything entering or exiting.
- Hidden icon: opacity 0, scale 0.8, blur 4px. Published values range from 2px blur on a crossfade
  (Emil Kowalski) to 4px blur and scale 0.25 (the chanhdai.com component). Emil warns that scale(0) "looks like the
  element comes out of nowhere".
- Both icons animate at the same time; the outgoing one does not wait.
- Return from tick to copy after about 2 seconds.
- Reduced motion: opacity only, 150ms linear, or an instant swap.

## How it goes wrong

- Icons left in normal flow, so both show side by side for a moment or the button jumps in width.
- Blur too large (8px and up), so the icon smears into a grey blob that reads as loading.
- Too slow: past 300ms the confirmation lags the click. Emil Kowalski's example is a 180ms select
  that "feels more responsive than a 400ms one".
- Scaling from 0, so the new icon appears from nowhere.
- Every icon animating on first render because `initial` was left on.
- Reduced motion ignored, or handled by `reducedMotion="user"` while the blur still runs.
- The icon changes but neither the accessible name nor a status message does, so the confirmation
  exists only visually.
- A rapid second click leaves both icons half visible; the swap must be interruptible.

## How to check it

1. For every icon that changes in place: both icons share one box and the control's bounding box
   is the same size before, during and after the swap.
2. Transitioned properties are only `opacity`, `transform` and `filter`; duration 300ms or less;
   easing ease-out or a spring with no bounce; blur 4px or less; scale on the hidden icon 0.5 or
   more.
3. With reduced motion emulated, no scale or blur runs; at most an opacity fade.
4. The accessible name or a status message changes with the icon.
5. Clicking twice quickly ends in one fully visible icon.
6. The animated element is icon sized; no blur is animated on anything larger than about 48px.

## His take

Not yet given.

## Related

- matched-icon-weight (how the icons sit; this entry is how one changes into another)
- animate-useful-feedback, interruptible-animation, layout-shift, optimistic-update (not yet
  researched)

## Sources

- https://emilkowal.ski/ui/7-practical-animation-tips : Emil Kowalski, "7 practical animation
  tips". A crossfade with 2px of blur, why blur bridges two states, under 300ms, ease-out for
  enter and exit, scale from 0.9 or higher rather than 0, remove animations seen hundreds of times
  a day.
- https://chanhdai.com/blog/icon-swap : chanhdai.com, Icon Swap component (last updated 18 May 2026).
  Opacity 0, scale 0.25 and blur 4px in and out, spring 0.3 with no bounce, `AnimatePresence` with
  `popLayout` and `initial={false}`, credits Emil Kowalski.
- https://jakub.kr/components/animating-icons : jakub.kr, "Animating icons". Opacity, scale
  and blur on contextual icons in buttons; prefers Motion for springs.
- https://developer.apple.com/design/human-interface-guidelines/sf-symbols : Apple Human Interface
  Guidelines, SF Symbols. The Replace animation and its down-up, up-up and off-up configurations;
  Magic Replace.
- https://developer.chrome.com/blog/animated-blur : Surma and Yi Gu, "Animating a blur", Chrome
  for Developers (last updated October 2017). Blur is a costly convolution that grows with size
  and radius; pre blurred copies crossfaded with opacity.
- https://web.dev/articles/animations-guide : Kayce Basques and Rachel Andrew, web.dev. Restrict
  animations to opacity and transform where possible.
- https://motion.dev/docs/performance : Motion, performance guide. Chrome and Firefox handle
  `filter` on the compositor; stick to transform, filter, clipPath and opacity.
- https://motion.dev/docs/react-animate-presence : Motion, `AnimatePresence`. Exit animations,
  swapping by `key`, `mode` options, `initial={false}`.
- https://motion.dev/docs/react-accessibility : Motion, accessibility. `reducedMotion="user"`
  disables transform and layout animations and keeps opacity; `useReducedMotion`.
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion : MDN,
  `prefers-reduced-motion`. What the setting asks for and scaling as a vestibular trigger.
- https://developers.google.com/fonts/docs/material_symbols : Google Fonts, Material Symbols. Use
  the fill axis to convey a state transition.
- https://help.figma.com/hc/en-us/articles/360039818874 : Figma help, "Smart animate layers between
  frames". Matching by name and hierarchy, the properties it handles, support for layers with blur.
