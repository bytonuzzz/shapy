# shapy

Seeded geometric SVG avatars for React, plus an avatar picker. Same text, same avatar, every time.

Pass in a name, an email, an ID, or any other text, and get back an SVG. shapy has no runtime dependencies, runs in the browser and on the server, and ships React components, including a picker so people can choose their own.

## Install

```sh
npm install @tonuzzz/shapy
```

## Quick start

```js
import { createAvatar, avatarDataUri } from '@tonuzzz/shapy';

el.innerHTML = createAvatar('maya@notemap.com');
img.src = avatarDataUri('maya@notemap.com');
```

`createAvatar` returns an SVG string. `avatarDataUri` returns the same SVG as a data URI, for an `<img>`, a CSS background, or an email. Each text gets its own avatar, and the same text always gets the same one.

### Options

Both take the same options as a second argument.

```js
createAvatar('maya@notemap.com', { shape: 'square' });
createAvatar('maya@notemap.com', { colors: 'curated' });
createAvatar('maya@notemap.com', { glyph: 'flower' });
createAvatar('maya@notemap.com', { background: 'ring' });
```

| Option | Default | What it does |
| --- | --- | --- |
| `size` | `64` | Width and height in pixels. |
| `shape` | `'circle'` | `'circle'` or `'square'`. |
| `radius` | `24` | Corner radius of a `'square'`, out of 100. |
| `colors` | `'generated'` | `'generated'` picks from about 300 color sets, `'curated'` from 14 hand-picked ones. |
| `glyph` | from the text | Always draw this shape. Names are in `GLYPH_NAMES`. |
| `glyphs` | all 32 | Only pick from these shapes. |
| `background` | from the text | Always use this background. Names are in `BACKGROUNDS`. |
| `backgrounds` | all 8 | Only pick from these backgrounds. |
| `palette` | from the text | An index into `PALETTES`, or your own `{ name, bg, fg }`. |
| `title` | none | Adds a title for screen readers. Without it, the SVG is hidden from them. |

### More details

`buildAvatar` returns what was drawn as well as the SVG:

```js
import { buildAvatar } from '@tonuzzz/shapy';

const { svg, glyph, background, palette } = buildAvatar(user.id);
```

`palette.bg` is handy for tinting the card or page around the avatar.

## React

The React components come with the same package, from `@tonuzzz/shapy/react`. They need React 18 or newer. If you only import from `@tonuzzz/shapy`, React isn't needed at all.

### Avatar

```jsx
import { Avatar } from '@tonuzzz/shapy/react';

<Avatar value="maya@notemap.com" size={64} />
<Avatar value="maya@notemap.com" size={40} />
<Avatar value="maya@notemap.com" size={32} />
<Avatar value="maya@notemap.com" size={24} />
```

| Prop | Default | What it does |
| --- | --- | --- |
| `value` | required | The text, or a saved value from the picker. |
| `size` | `40` | Width and height in pixels. |
| `alt` | none | Text for screen readers. |
| `className`, `style` | none | Passed to the wrapping `<span>`. |

It also takes every option above except `title`, such as `shape` or `colors`. Any other prop, like `onClick`, `aria-*` or `data-*`, goes on the `<span>`.

The colors and shapes inside are part of the SVG, so you change them with the options above rather than CSS. Everything around the avatar, like a border, a ring or a shadow, can be styled on the `<span>`.

### AvatarPicker

```jsx
import { AvatarPicker } from '@tonuzzz/shapy/react';

<AvatarPicker
  defaultValue={user.avatar ?? user.id}
  onSave={(value) => updateUser({ avatar: value })}
  onCancel={() => setOpen(false)}
/>
```

People drag, swipe or use the arrow keys to look around a honeycomb of avatars, and pick one. The buttons below change the shape, the colors or the background of the one they picked, or shuffle the whole set. When someone uses the keyboard, a soft halo shows around the picked avatar.

The picker fills the width of its container, so you can put it on a page, in a popover or inside your own dialog. It brings its own styles.

| Prop | Default | What it does |
| --- | --- | --- |
| `defaultValue` | random | The avatar to start on. Pass the saved value, or the user's ID. |
| `onSave` | none | Called with the value to store when they press Save. |
| `onCancel` | none | Shows a Cancel button and calls this when it's pressed. |
| `onChange` | none | Called with the value every time the choice changes. Not called on the first render. |
| `colors` | `'generated'` | `'generated'` or `'curated'`. |
| `title` | `'Choose an avatar'` | Heading above the picker. Pass `''` to hide it. |
| `description` | `'Drag to look around, then pick one you like.'` | Line under the heading. Pass `''` to hide it. |
| `saveLabel` | `'Save'` | Label of the Save button. |
| `className` | none | Added to the picker's outer element. |

`defaultValue` is only read when the picker first appears. To start it over on a different avatar, give it a new `key`.

### Styling the picker

Set any of these CSS variables on the `className` you pass:

```css
.my-picker {
  --shapy-panel: #ffffff;
  --shapy-ink: #18181b;
  --shapy-muted: #71717a;
  --shapy-accent: #2563eb;
  --shapy-accent-ink: #ffffff;
}
```

| Variable | Default | What it changes |
| --- | --- | --- |
| `--shapy-panel` | `#1e1d25` | Background. |
| `--shapy-tint-mix` | `12%` | How much the background takes on the picked avatar's color. `0%` keeps it plain. |
| `--shapy-ink` | `#f2f0f7` | Text, icons and the ring around the picked avatar. |
| `--shapy-muted` | `#9c99ab` | Secondary text and idle icons. |
| `--shapy-accent`, `--shapy-accent-ink` | `--shapy-ink`, `--shapy-panel` | Save button background and text. |
| `--shapy-ring`, `--shapy-ring-width` | `--shapy-ink`, `2.5px` | The ring around the picked avatar. |
| `--shapy-radius`, `--shapy-padding`, `--shapy-gap` | `20px`, `20px 20px 14px`, `12px` | Corners, padding and spacing of the picker. |
| `--shapy-button-radius` | `8px` | Corners of the buttons. |
| `--shapy-title-size` | `17px` | Size of the heading. |

Every part also has a `data-part` attribute (`root`, `header`, `title`, `description`, `honeycomb`, `footer`, `shuffle`, `new-shape`, `new-colors`, `new-background`, `reset`, `cancel`, `save`), so you can style any of them:

```css
.my-picker [data-part='save'] { border-radius: 999px; }
```

### Building your own picker

For a different layout, put the parts together yourself. Use only the ones you need, wrap them in your own markup, and pass `unstyled` to drop the built-in look:

```jsx
import {
  AvatarPickerRoot,
  AvatarPickerHoneycomb,
  AvatarPickerPreview,
  AvatarPickerShuffle,
  AvatarPickerNewShape,
  AvatarPickerNewColors,
  AvatarPickerNewBackground,
  AvatarPickerReset,
  useAvatarPicker,
} from '@tonuzzz/shapy/react';

function SaveButton() {
  const { value } = useAvatarPicker();
  return <button onClick={() => updateUser({ avatar: value })}>Save</button>;
}

<AvatarPickerRoot defaultValue={user.avatar ?? user.id} unstyled className="my-picker">
  <div className="sidebar">
    <AvatarPickerPreview size={88} />
    <AvatarPickerShuffle>Shuffle</AvatarPickerShuffle>
    <AvatarPickerNewShape>Shape</AvatarPickerNewShape>
    <AvatarPickerNewColors>Colors</AvatarPickerNewColors>
    <AvatarPickerNewBackground>Background</AvatarPickerNewBackground>
    <AvatarPickerReset />
    <SaveButton />
  </div>
  <AvatarPickerHoneycomb />
</AvatarPickerRoot>
```

| Part | What it is |
| --- | --- |
| `AvatarPickerRoot` | Holds the state. Takes `defaultValue`, `colors`, `onChange`, `unstyled` and any `<div>` prop. Put every other part inside it. |
| `AvatarPickerHoneycomb` | The draggable honeycomb. Sets its own height from its width. Use one per root. |
| `AvatarPickerPreview` | The picked avatar. Takes the same props as `Avatar`, without `value`. |
| `AvatarPickerShuffle`, `AvatarPickerNewShape`, `AvatarPickerNewColors`, `AvatarPickerNewBackground` | Buttons. They show an icon unless you give them children, and take any `<button>` prop. |
| `AvatarPickerReset` | Goes back to the avatar picked in the honeycomb. Disabled until something changes. The built-in picker hides it while it's disabled. |

`useAvatarPicker()` works anywhere inside `AvatarPickerRoot`. It returns `value`, `changed`, and `shuffle`, `newShape`, `newColors`, `newBackground` and `reset`, for your own buttons.

With `unstyled`, the honeycomb still works and draws its ring, but nothing else is styled. The ring uses `--shapy-ring`, then falls back to the text color.

## Saving a picked avatar

The picker gives you a short string like `v1:xzl4n0g:mlda8xw:horizon`. Store it with the user and pass it anywhere you'd pass text. People who haven't picked one fall back to their ID:

```js
createAvatar(user.avatar ?? user.id);
```

Building your own picker without React? `stringifySpec` makes the same strings and `parseSpec` reads them back:

```js
import { stringifySpec, parseSpec } from '@tonuzzz/shapy';

const value = stringifySpec({ seed: 'maya', background: 'ring' });
parseSpec(value); // { seed: 'maya', background: 'ring' }
```

## Determinism

The same text draws the same avatar in every `v1` release, so avatars don't change under people when you update. Saved strings start with `v1:` for the same reason.

shapy draws from 32 shapes, 8 backgrounds and about 300 color sets, for around 3.8 million different avatars.

## SSR

`createAvatar`, `avatarDataUri` and `buildAvatar` are plain functions. They use no DOM APIs, so they work in Node, on the edge, and during SSR.

The React `Avatar` component renders the SVG as HTML inside a `<span>`, so it works with `react-dom/server` and any React SSR setup. The picker injects its styles on the client and is marked `'use client'`.

## Accessibility

Pass `title` to `createAvatar` (or `alt` to `<Avatar>`) to expose the SVG to screen readers. Without it, the SVG is `aria-hidden`.

The picker honeycomb is a keyboard-accessible group: arrow keys move between avatars, and a focus ring appears when it is used from the keyboard. Action buttons have accessible names.

```jsx
<Avatar value="maya@notemap.com" size={40} alt="Maya" />
```

## TypeScript

Types ship with the package for the root entry and for `@tonuzzz/shapy/react`.

```ts
import { createAvatar, type AvatarOptions, type GlyphName } from '@tonuzzz/shapy';
import { Avatar, type AvatarProps } from '@tonuzzz/shapy/react';
```


## Install with shadcn

shapy ships a shadcn registry for the avatar component and the picker. In a project already set up with shadcn, add the `@tonuzzz` registry to your `components.json`:

```json
{
  "registries": {
    "@tonuzzz": "https://bytonuzzz.github.io/shapy/r/{name}.json"
  }
}
```

Then add the components:

```sh
npx shadcn@latest add @tonuzzz/avatar
npx shadcn@latest add @tonuzzz/picker
```

That writes `components/ui/shapy-avatar.tsx` and `components/ui/shapy-picker.tsx`, and installs `@tonuzzz/shapy`.

You can also add them by full URL, with no config:

```sh
npx shadcn@latest add https://bytonuzzz.github.io/shapy/r/avatar.json
npx shadcn@latest add https://bytonuzzz.github.io/shapy/r/picker.json
```

To rebuild the registry after changing files in `registry/`:

```sh
npx shadcn@latest build
```

## License

MIT
