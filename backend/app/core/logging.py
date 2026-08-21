import logging
import sys


def setup_logging(debug: bool = False) -> logging.Logger:
    log_level = logging.DEBUG if debug else logging.INFO

    formatter = logging.Formatter(
        fmt="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    logger = logging.getLogger("dota2_insight")
    logger.setLevel(log_level)

    if not logger.handlers:
        logger.addHandler(handler)

    return logger


logger = setup_logging()
