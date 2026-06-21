import json
import sys
from pathlib import Path


def as_text(source):
    if isinstance(source, list):
        return "".join(source)
    return source or ""


def summarize_output(output):
    output_type = output.get("output_type", "")

    if output_type == "stream":
        return {
            "type": "stream",
            "text": as_text(output.get("text", "")),
        }

    data = output.get("data", {})
    if "text/plain" in data:
        return {
            "type": output_type,
            "text": as_text(data["text/plain"]),
        }

    if "text/html" in data:
        return {
            "type": output_type,
            "html": as_text(data["text/html"]),
        }

    return {"type": output_type}


def summarize_notebook(path):
    notebook = json.loads(Path(path).read_text(encoding="utf-8"))
    cells = []

    for index, cell in enumerate(notebook.get("cells", []), start=1):
        item = {
            "index": index,
            "cell_type": cell.get("cell_type"),
            "source": as_text(cell.get("source", "")),
        }

        if cell.get("cell_type") == "code":
            item["execution_count"] = cell.get("execution_count")
            item["outputs"] = [summarize_output(output) for output in cell.get("outputs", [])]

        cells.append(item)

    return {
        "notebook": Path(path).name,
        "cell_count": len(cells),
        "cells": cells,
    }


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python convert_notebook.py caminho/do/notebook.ipynb")

    summary = summarize_notebook(sys.argv[1])
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
