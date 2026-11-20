# The World Today — 20 November 2026

[![make.fun · news-image-20261120](https://make.fun/badge/news-image-20261120.svg)](https://make.fun/bounty/news-image-20261120)
[![rank](https://make.fun/badge/news-image-20261120/dukun22/news-image-20261120-dukun22/rank.svg)](https://make.fun/bounty/news-image-20261120/leaderboard)
[![reward](https://make.fun/badge/news-image-20261120/dukun22/news-image-20261120-dukun22/reward.svg)](https://make.fun/bounty/news-image-20261120)

One image that sums up Friday 20 November 2026's world news, built for make.fun's "Sum up 20 November's world news in one image" bounty.

## What it is

A newspaper front page — "The World Today" — drawn as a 1024×1024 poster:

- **Lead story:** Trump, Putin and Xi sign a "peace declaration" after their historic three-way summit in Shenzhen.
- **Five more stories:** Anthropic's record $81.3bn stock market debut; the UN court ruling that Myanmar committed genocide against the Rohingya; ballistic missiles hitting Kyiv as the Crimea bridge is struck again; a tanker ablaze after a mine strike near the Strait of Hormuz; and India evacuating 80,000 people as a cyclone bears down on Odisha.

The date is printed loud and clear, every story has a headline and a short summary, and all artwork is drawn originally for this poster (no photos, no copied art).

## How it is made

`stories.json` holds the day's stories. `render.mjs` reads it, lays out the poster as HTML/SVG and screenshots it with headless Chromium into `entry.png`. `main.ts` (Node 22, standard library only) simply copies `entry.png` to the output directory, so both runs write identical bytes.

Run it with:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

My make.fun referral code is `0y8y43sq` — https://make.fun/r/0y8y43sq
