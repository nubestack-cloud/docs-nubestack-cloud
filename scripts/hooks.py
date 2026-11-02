"""Build searchable reference pages and examples from the checked-in customer contract."""
from __future__ import annotations

import html
import json
import re
from collections import defaultdict
from pathlib import Path

from mkdocs.structure.files import File

ROOT = Path(__file__).resolve().parents[1]
SPEC = json.loads((ROOT / "openapi/nubestack-cloud-v1.json").read_text())
SCHEMAS = SPEC["components"]["schemas"]
OPERATIONS = {
    op["operationId"]: (method.upper(), path, op)
    for path, item in SPEC["paths"].items()
    for method, op in item.items()
    if method in {"get", "post", "put", "patch", "delete"}
}


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def cell(value):
    return html.escape(str(value)).replace("|", "&#124;").replace("\n", " ")


def type_name(schema):
    if "$ref" in schema:
        name = schema["$ref"].split("/")[-1]
        return f"[{cell(name.split('__')[-1])}](schemas.md#{slug(name)})"
    if "anyOf" in schema or "oneOf" in schema:
        return " or ".join(type_name(v) for v in schema.get("anyOf", schema.get("oneOf", [])))
    if schema.get("type") == "array":
        return "array of " + type_name(schema.get("items", {}))
    return schema.get("type", "any")


def constraints(schema):
    notes = []
    for name in ("minimum", "maximum", "minLength", "maxLength", "minItems", "maxItems", "pattern", "format"):
        if name in schema:
            notes.append(f"{name}: `{cell(schema[name])}`")
    if "enum" in schema:
        notes.append("Allowed: " + ", ".join(f"`{cell(v)}`" for v in schema["enum"]))
    if "default" in schema:
        notes.append("Default: `" + cell(json.dumps(schema["default"])) + "`")
    return "; ".join(notes)


def fields(schema):
    if "$ref" in schema:
        schema = SCHEMAS[schema["$ref"].split("/")[-1]]
    if not schema.get("properties"):
        return type_name(schema) + (". " + constraints(schema) if constraints(schema) else "")
    rows = ["| Field | Type | Required | Description |", "|---|---|---|---|"]
    for key, prop in schema["properties"].items():
        desc = " ".join(filter(None, [cell(prop.get("description", "")), constraints(prop)]))
        rows.append(f"| `{cell(key)}` | {type_name(prop)} | {'Yes' if key in schema.get('required', []) else 'No'} | {desc} |")
    return "\n".join(rows)


def reference_pages():
    groups = defaultdict(list)
    for op_id, (method, path, op) in OPERATIONS.items():
        groups[op.get("tags", ["Other"])[0]].append((op_id, method, path, op))
    pages = {}
    index = ["# API reference", "", "Every endpoint below is generated from the checked-in customer API contract. The reference builds locally and is included in site search; it needs no external documentation service.", "", "[Download the OpenAPI contract](../../assets/openapi.json). Start with [authentication](../authentication.md), [requests](../requests.md) and [operations](../operations.md).", "", "The placeholder host is `https://api.nubestack.cloud`. Every path below already includes `/v1`; do not add it twice.", "", "| Service | Operations |", "|---|---|"]
    for group, ops in groups.items():
        filename = slug(group) + ".md"
        index.append(f"| [{group}]({filename}) | {len(ops)} |")
        lines = [f"# {group}", "", "[All services](index.md) · [Request conventions](../requests.md) · [Errors](../errors.md)", ""]
        for op_id, method, path, op in ops:
            lines += [f"## {op.get('summary', op_id)} {{#{slug(op_id)}}}", "", f"```http\n{method} {path}\n```", "", op.get("description", ""), ""]
            lines += ["**Authentication:** " + ("bearer token; access is checked for the requested organization and project." if op.get("security") else "see the endpoint's headers and description."), ""]
            if op.get("parameters"):
                lines += ["### Parameters", "", "| Name | In | Required | Type | Description |", "|---|---|---|---|---|"]
                for param in op["parameters"]:
                    lines.append(f"| `{cell(param['name'])}` | {param['in']} | {'Yes' if param.get('required') else 'No'} | {type_name(param.get('schema', {}))} | {cell(param.get('description', ''))} {constraints(param.get('schema', {}))} |")
                lines.append("")
            body = op.get("requestBody", {}).get("content", {})
            if body:
                lines += ["### Request body", ""]
                for media, content in body.items():
                    lines += [f"Content type: `{media}`", "", fields(content.get("schema", {})), ""]
            lines += ["### Responses", "", "| Status | Description | Body |", "|---|---|---|"]
            for status, response in op.get("responses", {}).items():
                types = "; ".join(type_name(c.get("schema", {})) for c in response.get("content", {}).values())
                lines.append(f"| `{status}` | {cell(response.get('description', ''))} | {types} |")
            if "202" in op.get("responses", {}):
                lines += ["", "A `202` accepts the change. Follow the response's `operation.href` until the operation finishes; [polling guide](../operations.md)."]
            lines += ["", "---", ""]
        pages[filename] = "\n".join(lines)
    index += ["", "[Request and response schemas](schemas.md)", "", "Shared failures also use the [problem response](../errors.md). An endpoint's generated response table is not an exhaustive list of authentication, permission or conflict failures."]
    pages["index.md"] = "\n".join(index)
    schema_lines = ["# Request and response schemas", "", "Field names and constraints come directly from the OpenAPI contract. Business rules may impose further limits; consult the service guide and the response's problem code.", ""]
    for name, schema in SCHEMAS.items():
        schema_lines += [f"## {name.split('__')[-1]} {{#{slug(name)}}}", "", schema.get("description", ""), "", fields(schema), "", "??? abstract \"JSON schema\"", "", "    ```json", *["    " + line for line in json.dumps(schema, indent=2).splitlines()], "    ```", ""]
    pages["schemas.md"] = "\n".join(schema_lines)
    return pages, groups


def on_config(config):
    _, groups = reference_pages()
    api = next(v for item in config.nav for k, v in item.items() if k == "API")
    api[-1] = {"API reference": [
        {"Overview": "api/reference/index.md"},
        *[{g: f"api/reference/{slug(g)}.md"} for g in groups],
        {"Schemas": "api/reference/schemas.md"},
    ]}
    return config


def on_files(files, config):
    pages, _ = reference_pages()
    for filename, content in pages.items():
        files.append(File.generated(config, f"api/reference/{filename}", content=content))
    files.append(File.generated(config, "assets/openapi.json", content=json.dumps(SPEC, indent=2) + "\n"))
    return files


def api_example(op_id):
    method, path, op = OPERATIONS[op_id]
    body = json.loads((ROOT / "data/examples.json").read_text()).get(op_id)
    path = path.replace("{org_id}", "$ORG").replace("{project_id}", "$PROJECT")
    path = re.sub(r"\{([^}]+)\}", lambda m: "$" + m[1].upper(), path)
    command = [f'curl --fail-with-body -i -X {method} "$NUBESTACK_API{path}"',
               '  -H "Authorization: Bearer $NUBESTACK_API_KEY"',
               '  -H "Idempotency-Key: $REQUEST_KEY"']
    if body is not None:
        command += ['  -H "Content-Type: application/json"', "  --data '" + json.dumps(body, indent=2) + "'"]
    lines = ["Use the [API setup and example variables](/api/overview.md#before-you-start). IDs and catalog choices below are examples; replace them with values from your project.", "", "```bash", " \\\n".join(command), "```", ""]
    status = next(code for code in op["responses"] if code.startswith("2"))
    if status == "202":
        lines += ["The response is `202 Accepted`, with an operation link:", "", '```json\n{"operation": {"id": "op_example", "state": "queued", "href": "/v1/orgs/org_example/operations/op_example"}}\n```', "", "Creation responses may also include the resource's ID. Follow `operation.href` as described in [Operations and polling](/api/operations.md); acceptance alone does not mean the change succeeded."]
    else:
        lines += [f"This endpoint returns `{status}` with the saved resource. It does not return a provisioning operation. Changes it triggers in a location can still take time; follow the resource's state."]
    return "\n".join(lines)


def on_page_markdown(markdown, page, config, files):
    markdown = re.sub(r"<!-- api-example: ([a-z0-9_]+) -->", lambda m: api_example(m[1]), markdown)
    if "<!-- problem-table -->" in markdown:
        problems = json.loads((ROOT / "data/problems.json").read_text())
        table = ["| Code | Meaning | Retryable |", "|---|---|---|"]
        table += [f"| `{p['code']}` | {cell(p['title'])} | {'Yes' if p['retryable'] else 'No'} |" for p in problems]
        markdown = markdown.replace("<!-- problem-table -->", "\n".join(table))
    return markdown
