# Backend changes requested — Home page

Two client requests. The front end is **already implemented and deployed against
mock data**, so nothing breaks while these ship: every new field is optional and
the old behaviour stays as the fallback. Once the API returns the real values the
mocks stop being used automatically (`src/mocks/home.ts` can then be deleted).

Endpoint affected: `GET /api/landing-page/home`.

- [1. Hero — video as uploaded file **or** YouTube link](#1-hero--video-as-uploaded-file-or-youtube-link)
- [2. Motivated seller — clean image + label texts](#2-motivated-seller--clean-image--label-texts)

---

## 1. Hero — video as uploaded file **or** YouTube link

### What the client wants

Today the hero video can only be an uploaded media file. The client wants to be
able to paste a YouTube link instead — without losing the option to upload.

### Dashboard

In the **Hero** section, add a source selector:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `video_type` | radio / select: `file` \| `youtube` | no | Which source is in use. Empty = no video. |
| `video` | file upload (existing field) | required when `video_type = file` | mp4 / webm, unchanged from today |
| `video_url` | text | required when `video_type = youtube` | full YouTube URL |

UI behaviour: show the upload input when `file` is picked, the URL input when
`youtube` is picked. Clearing the selector should clear both values.

### Validation

```php
'video_type' => ['nullable', 'in:file,youtube'],
'video'      => ['nullable', 'required_if:video_type,file', 'mimetypes:video/mp4,video/webm', 'max:51200'],
'video_url'  => ['nullable', 'required_if:video_type,youtube', 'url', 'regex:/(youtube\.com|youtu\.be)/i'],
```

Accept every common YouTube shape (the front end parses all of them):

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/live/VIDEO_ID`

Please store the URL exactly as pasted — don't strip query params, and don't try
to convert it to an embed URL. The front end builds the embed itself
(`youtube-nocookie.com`, no-cookie + no-autoload until the visitor presses play).

### API response

Add two keys to `data.hero`. `video` keeps its current meaning and type.

```jsonc
"hero": {
  "id": 1,
  "title": "…",
  "caption": "…",
  "description": "<p>…</p>",
  "button_text_one": "…",
  "image": "https://dashboard.res-va.com/storage/uploads/hero/poster.jpeg",

  "video_type": "youtube",                                   // NEW: "file" | "youtube" | null
  "video": null,                                             // file URL when video_type = "file"
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",// NEW: link when video_type = "youtube"

  "statistics": [ … ]
}
```

Uploaded-file example:

```jsonc
"video_type": "file",
"video": "https://dashboard.res-va.com/storage/uploads/hero/01KY….mp4",
"video_url": null
```

`image` stays the poster frame shown before playback. When it's empty and the
source is YouTube, the front end falls back to the YouTube thumbnail — so an
uploaded poster is recommended but not mandatory.

### Front-end behaviour (already built)

`src/lib/video.ts` → `resolveVideoSource()`:

1. `video_type` only decides which field to read **first** — it is a hint, not a
   contract.
2. The actual player is chosen by parsing the URL: anything that resolves to a
   YouTube id renders an iframe, anything else renders `<video>`.
3. Therefore a YouTube link accidentally saved into `video`, or a file URL left
   in `video_url`, still plays correctly.
4. No video at all → the poster renders with the play button disabled (today's
   behaviour).

### Acceptance criteria

- [ ] Switching a hero from uploaded file to YouTube and back works without
      clearing the poster image.
- [ ] `video_url` round-trips unchanged (query string included).
- [ ] Existing heroes that only have `video` keep playing (regression check).

---

## 2. Motivated seller — clean image + label texts

### What the client wants

The `motivated_seller` image currently ships as a single flattened graphic with
the labels ("Property type", "Owner age", …) burned into the artwork. That means
the copy can't be edited or translated, and it looks soft on high-DPI screens.

The client wants to upload **the property image with no text on it**, plus the
label texts as separate editable fields. The front end draws the labels,
connector arrows, hover states and scroll animations on top.

### Dashboard

In the **Motivated seller** section:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `image_free` | image upload | no | The clean property image, **no text baked in** |
| `annotations[]` | repeater | no | The labels drawn over the image |

Repeater row fields:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | text (max 40 chars) | yes | The label copy, e.g. `Equity %` |
| `position` | select | no | Which slot on the image (see list below) |
| `sort` | integer | no | Display order; used when `position` is empty |

`position` options — **max 6 rows, one per slot**:

`top-left`, `middle-left`, `bottom-left`, `top-right`, `middle-right`, `bottom-right`

If `position` is left empty the front end assigns slots in list order
(`top-left → top-right → middle-left → middle-right → bottom-left → bottom-right`),
so the field can be shipped as optional. Rows beyond the sixth are ignored by
the front end.

#### Image requirements (please put this hint next to the upload field)

- Transparent **PNG**, square (1:1), ideally 1600×1600 or larger.
- Subject centred, occupying roughly the middle 70% of the frame.
- No text, no arrows, no drop-shadow baked in.

The label slots are positioned against that framing. A very differently-cropped
image won't break anything, but the arrows will point at the wrong spots and the
front-end constants in `src/components/home/AnnotatedHouse.tsx` (`SLOTS`) would
need re-tuning.

### Validation

```php
'image_free'             => ['nullable', 'image', 'mimes:png,webp', 'max:4096'],
'annotations'            => ['nullable', 'array', 'max:6'],
'annotations.*.title'    => ['required', 'string', 'max:40'],
'annotations.*.position' => ['nullable', 'in:top-left,middle-left,bottom-left,top-right,middle-right,bottom-right'],
'annotations.*.sort'     => ['nullable', 'integer'],
```

A `distinct` rule on `annotations.*.position` would be good — two labels in the
same slot overlap.

### Suggested schema

```sql
ALTER TABLE motivated_sellers ADD COLUMN image_free VARCHAR(255) NULL AFTER image;

CREATE TABLE motivated_seller_annotations (
  id                  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  motivated_seller_id BIGINT UNSIGNED NOT NULL,
  title               VARCHAR(40) NOT NULL,
  position            VARCHAR(20) NULL,
  sort                INT NOT NULL DEFAULT 0,
  created_at          TIMESTAMP NULL,
  updated_at          TIMESTAMP NULL,
  FOREIGN KEY (motivated_seller_id) REFERENCES motivated_sellers(id) ON DELETE CASCADE
);
```

### API response

Add two keys to `data.motivated_seller.motivated_seller`. `image` stays exactly
as it is (the old flattened graphic) — it's the fallback.

```jsonc
"motivated_seller": {
  "header_1": { … },
  "motivated_seller": {
    "id": 1,
    "description": "<p>…</p>",
    "image": "https://dashboard.res-va.com/storage/uploads/motivated_seller/old-annotated.png",

    "image_free": "https://dashboard.res-va.com/storage/uploads/motivated_seller/house.png",  // NEW
    "annotations": [                                                                          // NEW
      { "id": 1, "title": "Property type",       "position": "top-left",      "sort": 1 },
      { "id": 2, "title": "Owner age",           "position": "top-right",     "sort": 2 },
      { "id": 3, "title": "Price range",         "position": "middle-left",   "sort": 3 },
      { "id": 4, "title": "Year built",          "position": "middle-right",  "sort": 4 },
      { "id": 5, "title": "Distress indicators", "position": "bottom-left",   "sort": 5 },
      { "id": 6, "title": "Equity %",            "position": "bottom-right",  "sort": 6 }
    ]
  },
  "header_2": { … }
}
```

Please return `annotations` as `[]` (not `null`) when there are none, and sort it
by `sort` server-side.

### Front-end behaviour (already built)

`src/components/home/AnnotatedHouse.tsx`:

- **Desktop (`lg` and up)** — the clean image sits in a 2:1 canvas, labels sit in
  the left/right gutters, and an SVG connector runs from each label to its point
  on the house.
- **Scroll animation** — when the section enters the viewport the image fades and
  scales in, then each connector "draws itself" (stroke-dash) while its label
  slides in from its side, staggered ~110 ms apart.
- **Hover** — the hovered label scales up and turns `brand-dark`, its connector
  thickens, a dot pops on the anchor point, and the other labels/lines dim to 30–40%.
- **Reduced motion** — all of the above degrades to a plain static render for
  users with `prefers-reduced-motion`.
- **Mobile / tablet** — no room for the overlay, so the image renders on its own
  and the labels appear as chips underneath.
- **Fallback chain** — `image_free` missing (or 404s) or `annotations` empty →
  the old `image` renders exactly as it does today.

### Acceptance criteria

- [ ] `image_free` and `annotations` present → labels are editable from the
      dashboard and reflect immediately on the site.
- [ ] Deleting `image_free` reverts the site to the old flattened `image`.
- [ ] `annotations` returns `[]`, never `null`.
- [ ] Two rows can't be saved with the same `position`.

---

## Front-end files touched (for reference)

| File | Purpose |
| --- | --- |
| `src/lib/video.ts` | YouTube-vs-file source resolution |
| `src/components/home/HeroVideo.tsx` | Poster → `<video>` / YouTube iframe |
| `src/components/home/AnnotatedHouse.tsx` | Label overlay, connectors, animations |
| `src/types/home.ts` | `HomeHero.video_type` / `video_url`, `MotivatedSellerBody.image_free` / `annotations` |
| `src/mocks/home.ts` | Temporary mock values — **delete once the API ships** |
