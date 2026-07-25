import logging
from fastapi import FastAPI


def setup_logging(app: FastAPI) -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )
    app.logger = logging.getLogger("shadowprotocol-ai")
