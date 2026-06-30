#!/usr/bin/env python3
"""Render a public-safe Devpost demo video for Vexa Autopilot."""

from __future__ import annotations

import subprocess
from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DEMO_DIR = ROOT / "docs" / "demo"
EDIT_DIR = DEMO_DIR / "edit"
CARDS_DIR = EDIT_DIR / "cards"
CLIPS_DIR = EDIT_DIR / "clips"
OUTPUT = DEMO_DIR / "vexa-devpost-demo.mp4"
SOURCE_RUN = DEMO_DIR / "vexa-local-demo.mp4"
SCREENSHOT = ROOT / "docs" / "design" / "vexa-browser-agent-current.png"

WIDTH = 1280
HEIGHT = 720
FPS = 30

COLORS = {
    "ink": (12, 24, 23),
    "panel": (245, 248, 245),
    "line": (207, 218, 213),
    "teal": (14, 148, 136),
    "mint": (218, 243, 235),
    "amber": (240, 178, 66),
    "coral": (224, 89, 76),
    "text": (36, 45, 45),
    "muted": (101, 115, 113),
    "white": (255, 255, 255),
}


def main() -> None:
    for directory in (EDIT_DIR, CARDS_DIR, CLIPS_DIR):
        directory.mkdir(parents=True, exist_ok=True)

    cards = [
        {
            "name": "01-problem",
            "duration": 8,
            "eyebrow": "Qwen Cloud Hackathon · Track 4 Autopilot Agent",
            "title": "Vexa Autopilot",
            "subtitle": "A public-safe browser agent that gathers evidence and stops before customer-facing actions.",
            "bullets": [
                "Business workflow: inspect storefront policy, compare checkout copy, draft a reply.",
                "Safety behavior: evidence first, human approval before send.",
            ],
            "footer": "Open-source demo repo: github.com/bypinkland-mi/vexa-autopilot",
        },
        {
            "name": "02-task",
            "duration": 8,
            "eyebrow": "Demo objective",
            "title": "Find the policy mismatch",
            "subtitle": "The agent is asked to browse a sandbox store, extract policy evidence, and prepare a reply.",
            "bullets": [
                "Refund policy page says customers can request a refund within 30 days.",
                "Checkout note says returns are accepted within 14 days.",
                "Vexa must detect the contradiction and pause before sending.",
            ],
            "footer": "No real customer data. No real browser profile. Local sandbox only.",
        },
        {
            "name": "03-architecture",
            "duration": 9,
            "eyebrow": "How it works",
            "title": "Qwen plans. Tools execute.",
            "subtitle": "The backend calls Qwen through the DashScope-compatible API when configured. Playwright runs allowed sandbox steps, and risky output pauses for approval.",
            "bullets": [
                "Qwen Cloud adapter: server/qwen-cloud.mjs",
                "Browser runner: navigate, click, extract DOM evidence, pause for approval",
                "Visible fallback state if Qwen/local planner is offline",
            ],
            "footer": "Docker package is ready for Alibaba Cloud deployment.",
        },
        {
            "name": "04-ui",
            "duration": 7,
            "eyebrow": "Browser-agent surface",
            "title": "Floating V agent dock",
            "subtitle": "The V icon opens a browser-agent panel with the objective, trace, planner state, and evidence.",
            "bullets": [
                "This is not private Tabi code.",
                "It is a separate open-source hackathon sandbox.",
            ],
            "footer": "Next: the live UI run.",
            "image": SCREENSHOT,
        },
        {
            "name": "06-evidence",
            "duration": 10,
            "eyebrow": "Evidence result",
            "title": "Mismatch detected",
            "subtitle": "Vexa compares the evidence instead of blindly drafting an answer.",
            "bullets": [
                "Policy page: refund window is 30 days after delivery.",
                "Checkout copy: returns accepted within 14 days.",
                "The UI shows the contradiction and attaches page evidence.",
            ],
            "footer": "The agent prepares work, but does not send customer-facing output.",
        },
        {
            "name": "07-approval",
            "duration": 9,
            "eyebrow": "Safety gate",
            "title": "Draft reply pauses for approval",
            "subtitle": "The final customer reply is treated as high risk because it would face a customer.",
            "bullets": [
                "Reviewer approval is required before any send action.",
                "The demo runner never controls a real mailbox or storefront.",
            ],
            "footer": "Evidence-backed automation with a human checkpoint.",
        },
        {
            "name": "08-cloud",
            "duration": 10,
            "eyebrow": "Submission status",
            "title": "Alibaba Cloud-ready package",
            "subtitle": "The repo includes Docker, an ECS deployment bundle, cloud verification, CI, and a release package.",
            "bullets": [
                "Run npm run verify:cloud -- <cloud-url> after Alibaba deployment.",
                "Set DASHSCOPE_API_KEY and VEXA_FORCE_MOCK=0 for true Qwen Cloud mode.",
            ],
            "footer": "Current blocker: Alibaba profile/public URL must be created from the owner account.",
        },
        {
            "name": "09-close",
            "duration": 6,
            "eyebrow": "Ready for final external steps",
            "title": "Vexa Autopilot",
            "subtitle": "Public repo, MIT license, CI, demo assets, architecture, deck, and deployment bundle are prepared.",
            "bullets": [
                "Release: v0.1-qwen-hackathon",
                "Final remaining steps: Alibaba proof URL, public video upload, Devpost submit.",
            ],
            "footer": "github.com/bypinkland-mi/vexa-autopilot",
        },
    ]

    clips: list[Path] = []
    for index, card in enumerate(cards):
        card_path = CARDS_DIR / f"{card['name']}.png"
        clip_path = CLIPS_DIR / f"{index:02d}-{card['name']}.mp4"
        render_card(card_path, card)
        image_to_clip(card_path, clip_path, card["duration"])
        clips.append(clip_path)
        if card["name"] == "04-ui":
            run_clip = CLIPS_DIR / "05-live-run.mp4"
            render_live_run(run_clip)
            clips.append(run_clip)

    concat_path = EDIT_DIR / "concat.txt"
    concat_path.write_text(
        "".join(f"file '{clip.resolve()}'\n" for clip in clips),
        encoding="utf8",
    )

    silent_video = EDIT_DIR / "vexa-devpost-demo-video-only.mp4"
    run([
        "ffmpeg",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(concat_path),
        "-c",
        "copy",
        str(silent_video),
    ])
    run([
        "ffmpeg",
        "-y",
        "-i",
        str(silent_video),
        "-f",
        "lavfi",
        "-i",
        "anullsrc=channel_layout=stereo:sample_rate=48000",
        "-shortest",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        str(OUTPUT),
    ])

    probe = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration,size",
            "-of",
            "default=nw=1",
            str(OUTPUT),
        ],
        text=True,
    ).strip()
    print(probe)
    print(f"Rendered {OUTPUT.relative_to(ROOT)}")


def render_card(path: Path, card: dict) -> None:
    image = Image.new("RGB", (WIDTH, HEIGHT), COLORS["panel"])
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, WIDTH, 88), fill=COLORS["ink"])
    draw.rounded_rectangle((42, 22, 96, 76), radius=13, fill=COLORS["teal"])
    draw.text((61, 33), "V", fill=COLORS["white"], font=font(30, bold=True))
    draw.text((118, 25), "Vexa Autopilot", fill=COLORS["white"], font=font(25, bold=True))
    draw.text((118, 55), card["eyebrow"], fill=(170, 199, 192), font=font(14, bold=True))

    title_font = font(54, bold=True)
    subtitle_font = font(24)
    body_font = font(24)
    small_font = font(18, bold=True)

    draw.text((58, 132), card["title"], fill=COLORS["text"], font=title_font)
    y = 212
    for line in wrap(card["subtitle"], width=68):
        draw.text((60, y), line, fill=COLORS["muted"], font=subtitle_font)
        y += 34

    if "image" in card:
        draw_content_image(image, Path(card["image"]))
        bullet_x = 650
        bullet_y = 382
    else:
        bullet_x = 86
        bullet_y = 332

    for bullet in card["bullets"]:
        bullet_y = draw_bullet(draw, bullet_x, bullet_y, bullet, body_font)
        bullet_y += 18

    draw.rounded_rectangle((58, 632, WIDTH - 58, 678), radius=8, fill=COLORS["mint"])
    draw.text((82, 645), card["footer"], fill=(40, 93, 85), font=small_font)
    image.save(path)


def draw_content_image(image: Image.Image, source: Path) -> None:
    screenshot = Image.open(source).convert("RGB")
    screenshot.thumbnail((520, 330), Image.Resampling.LANCZOS)
    x = 60
    y = 330
    frame = Image.new("RGB", (560, 370), COLORS["white"])
    frame_draw = ImageDraw.Draw(frame)
    frame_draw.rounded_rectangle((0, 0, 559, 369), radius=14, outline=COLORS["line"], width=2)
    frame.paste(screenshot, (20, 20))
    image.paste(frame, (x, y))


def draw_bullet(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, body_font: ImageFont.ImageFont) -> int:
    draw.ellipse((x - 28, y + 8, x - 10, y + 26), fill=COLORS["teal"])
    for line in wrap(text, width=58 if x < 200 else 38):
        draw.text((x, y), line, fill=COLORS["text"], font=body_font)
        y += 33
    return y


def image_to_clip(image_path: Path, clip_path: Path, duration: float) -> None:
    run([
        "ffmpeg",
        "-y",
        "-loop",
        "1",
        "-t",
        str(duration),
        "-i",
        str(image_path),
        "-vf",
        f"fps={FPS},format=yuv420p",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "18",
        str(clip_path),
    ])


def render_live_run(clip_path: Path) -> None:
    if not SOURCE_RUN.exists():
        raise FileNotFoundError(f"Missing source demo clip: {SOURCE_RUN}")
    run([
        "ffmpeg",
        "-y",
        "-i",
        str(SOURCE_RUN),
        "-vf",
        (
            "scale=1280:720:force_original_aspect_ratio=decrease,"
            "pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=#0c1817,"
            "setpts=2.0*PTS,"
            f"fps={FPS},format=yuv420p"
        ),
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "18",
        str(clip_path),
    ])


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def run(command: list[str]) -> None:
    subprocess.run(command, cwd=ROOT, check=True)


if __name__ == "__main__":
    main()
