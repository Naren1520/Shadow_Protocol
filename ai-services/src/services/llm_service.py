import asyncio
import json
import logging
import urllib.error
import urllib.request

from ..config.settings import settings

logger = logging.getLogger(__name__)


class LLMService:
    def __init__(self):
        self.provider = settings.LLM_PROVIDER.lower()

    async def generate_text(self, prompt: str) -> str:
        logger.info("LLM prompt: %s", prompt)

        if self.provider == "gemini" and settings.GEMINI_API_KEY:
            return await self._generate_with_gemini(prompt)

        if self.provider == "openai" and settings.OPENAI_API_KEY:
            return await self._generate_with_openai(prompt)

        logger.warning("No LLM API key configured; returning fallback response")
        return "0.8"

    async def _generate_with_gemini(self, prompt: str) -> str:
        try:
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"maxOutputTokens": 32},
            }
            data = json.dumps(payload).encode("utf-8")
            url = (
                f"https://generativelanguage.googleapis.com/v1beta/models/{settings.DEFAULT_LLM_MODEL}:generateContent"
                f"?key={settings.GEMINI_API_KEY}"
            )
            req = urllib.request.Request(
                url,
                data=data,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            response = await asyncio.to_thread(self._fetch_url, req)
            body = json.loads(response)
            candidates = body.get("candidates", [])
            if not candidates:
                return "0.8"
            parts = candidates[0].get("content", {}).get("parts", [])
            if not parts:
                return "0.8"
            text = parts[0].get("text", "")
            return text.strip() or "0.8"
        except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError, KeyError, IndexError) as exc:
            logger.warning("Gemini request failed: %s", exc)
            return "0.8"

    async def _generate_with_openai(self, prompt: str) -> str:
        try:
            import openai

            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            response = await asyncio.to_thread(
                lambda: client.responses.create(
                    model=settings.DEFAULT_LLM_MODEL,
                    input=prompt,
                    max_tokens=32,
                )
            )
            output = ""
            if hasattr(response, "output") and response.output:
                first_output = response.output[0]
                if hasattr(first_output, "content") and first_output.content:
                    output = (
                        first_output.content[0].get("text", "")
                        if isinstance(first_output.content[0], dict)
                        else getattr(first_output.content[0], "text", "")
                    )
                elif isinstance(first_output, dict):
                    output = first_output.get("text", "")
            if not output:
                output = response.text if hasattr(response, "text") else "0.8"
            return output.strip()
        except Exception as exc:
            logger.warning("OpenAI request failed: %s", exc)
            return "0.8"

    def _fetch_url(self, req: urllib.request.Request) -> str:
        with urllib.request.urlopen(req, timeout=20) as response:
            return response.read().decode("utf-8")
