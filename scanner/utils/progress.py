import json
import os
from pathlib import Path


def get_progress_file():
    return os.environ.get("CYALYSIS_PROGRESS_FILE")


def write_progress(
    current_check,
    completed,
    total,
    status="running",
    result=None
):
    progress_file = get_progress_file()

    if not progress_file:
        return

    progress = {
        "status": status,
        "current_check": current_check,
        "completed": completed,
        "total": total
    }

    if result is not None:
        progress["result"] = result

    try:
        path = Path(progress_file)
        path.parent.mkdir(parents=True, exist_ok=True)

        temporary_path = path.with_suffix(".tmp")

        with open(temporary_path, "w", encoding="utf-8") as file:
            json.dump(progress, file, indent=2)

        temporary_path.replace(path)

    except Exception:
        pass