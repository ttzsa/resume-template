import asyncio
import base64
import json
import os
from typing import Any, Optional
from urllib.parse import urlencode


def build_print_url(frontend_url: str, resume: dict[str, Any]) -> str:
    payload = json.dumps(resume, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    encoded = base64.urlsafe_b64encode(payload).decode("ascii").rstrip("=")
    return f"{frontend_url.rstrip('/')}/resume/print?{urlencode({'data': encoded})}"


def browser_launch_candidates(executable_path: Optional[str]) -> list[dict[str, str]]:
    candidates: list[dict[str, str]] = []
    if executable_path:
        candidates.append({"executable_path": executable_path})
    candidates.extend([{}, {"channel": "chrome"}, {"channel": "msedge"}])
    return candidates


async def launch_browser(playwright: Any) -> Any:
    last_error: Optional[Exception] = None
    for candidate in browser_launch_candidates(os.getenv("PLAYWRIGHT_CHROMIUM_PATH")):
        try:
            return await playwright.chromium.launch(**candidate, args=["--font-render-hinting=none"])
        except Exception as error:
            last_error = error
    if last_error:
        raise last_error
    raise RuntimeError("No Chromium launch candidate was available")


async def render_pdf(frontend_url: str, resume: dict[str, Any]) -> bytes:
    from playwright.async_api import async_playwright

    print_url = build_print_url(frontend_url, resume)
    async with async_playwright() as playwright:
        browser = await launch_browser(playwright)
        try:
            page = await browser.new_page()
            await page.goto(print_url, wait_until="networkidle", timeout=60_000)
            await page.wait_for_selector('[data-pdf-ready="true"]', timeout=30_000)
            await page.evaluate("document.fonts.ready")
            await asyncio.sleep(0.05)
            return await page.pdf(
                format="A4",
                print_background=True,
                prefer_css_page_size=True,
                margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
            )
        finally:
            await browser.close()
