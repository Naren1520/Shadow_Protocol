import logging
from typing import Optional

from openai import OpenAI

from ..config.settings import settings

logger = logging.getLogger(__name__)


class LLMService:
    def __init__(self):
        self.client: Optional[OpenAI] = None
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    async def generate_text(self, prompt: str) -> str:
        logger.info("LLM prompt: %s", prompt)

        if self.client is None:
            logger.warning("No OpenAI API key configured; returning fallback response")
            return "0.8"

        try:
            response = await self.client.responses.create(
                model=settings.DEFAULT_LLM_MODEL,
                input=prompt,
                max_tokens=32,
            )
            output = ""
            if hasattr(response, "output") and response.output:
                first_output = response.output[0]
                if hasattr(first_output, "content") and first_output.content:
                    output = first_output.content[0].get("text", "") if isinstance(first_output.content[0], dict) else getattr(first_output.content[0], "text", "")
                elif isinstance(first_output, dict):
                    output = first_output.get("text", "")
            if not output:
                output = response.text if hasattr(response, "text") else "0.8"
            return output.strip()
        except Exception as exc:
            logger.warning("OpenAI request failed: %s", exc)
            return "0.8"
