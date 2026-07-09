"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { templates, audioCatalog, TemplateField } from "@/lib/templates";

type FieldValue = string | File | null | { text?: string; top?: number; label?: string; value?: number; pointIndex?: number; color?: string }[];

export default function TemplateFormPage() {
  const params = useParams();
  const templateId = params.id as string;
  const template = templates.find((t) => t.id === templateId);

  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [status, setStatus] = useState<"idle" | "rendering" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [jsonMsg, setJsonMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!template) {
    return <main style={{ padding: 40 }}>Unknown template: {templateId}</main>;
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #2b2440",
    background: "#0b0b14",
    color: "#fff",
    marginTop: 6,
    marginBottom: 16,
  };
  const labelStyle: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: "#8a7fae" };

  const setValue = (key: string, value: FieldValue) => setValues((prev) => ({ ...prev, [key]: value }));

  // list-type fields share a row shape: {text?, top?, label?, value?, pointIndex?, color?}
  const getList = (key: string) => (Array.isArray(values[key]) ? (values[key] as any[]) : []);
  const updateListItem = (key: string, i: number, field: string, val: string) => {
    const list = [...getList(key)];
    const parsedVal = field === "top" || field === "value" || field === "pointIndex" ? Number(val) : val;
    list[i] = { ...list[i], [field]: parsedVal };
    setValue(key, list);
  };
  const addListItem = (key: string, defaultRow: any, maxItems?: number) => {
    const list = getList(key);
    if (maxItems && list.length >= maxItems) return;
    setValue(key, [...list, defaultRow]);
  };
  const removeListItem = (key: string, i: number) => setValue(key, getList(key).filter((_, idx) => idx !== i));

  const renderField = (field: TemplateField) => {
    switch (field.type) {
      case "text":
        return (
          <input
            style={inputStyle}
            value={(values[field.key] as string) || ""}
            onChange={(e) => setValue(field.key, e.target.value)}
            placeholder={field.placeholder}
          />
        );
      case "textarea":
        return (
          <textarea
            style={{ ...inputStyle, minHeight: 80 }}
            value={(values[field.key] as string) || ""}
            onChange={(e) => setValue(field.key, e.target.value)}
            placeholder={field.placeholder}
          />
        );
      case "image":
        return (
          <input
            style={inputStyle}
            type="file"
            accept="image/*"
            onChange={(e) => setValue(field.key, e.target.files?.[0] || null)}
          />
        );
      case "audio":
        return (
          <select style={inputStyle} value={(values[field.key] as string) || audioCatalog[0]?.file} onChange={(e) => setValue(field.key, e.target.value)}>
            {audioCatalog.map((a) => (
              <option key={a.file} value={a.file}>{a.label}</option>
            ))}
          </select>
        );
      case "calloutList": {
        const list = getList(field.key);
        return (
          <>
            {list.map((row, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={row.text || ""} onChange={(e) => updateListItem(field.key, i, "text", e.target.value)} placeholder={`Callout ${i + 1}`} />
                <input style={{ ...inputStyle, marginBottom: 0, width: 80 }} type="number" min={0} max={100} value={row.top ?? 50} onChange={(e) => updateListItem(field.key, i, "top", e.target.value)} />
                <button type="button" onClick={() => removeListItem(field.key, i)} style={{ background: "none", border: "none", color: "#8a7fae", cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem(field.key, { text: "", top: 50 }, field.maxItems)} style={{ marginBottom: 16, background: "none", border: "1px solid #2b2440", color: "#8a7fae", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>+ Add</button>
          </>
        );
      }
      case "pointList": {
        const list = getList(field.key);
        return (
          <>
            {list.map((row, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={row.label || ""} onChange={(e) => updateListItem(field.key, i, "label", e.target.value)} placeholder="Label (e.g. 2024)" />
                <input style={{ ...inputStyle, marginBottom: 0, width: 120 }} type="number" value={row.value ?? 0} onChange={(e) => updateListItem(field.key, i, "value", e.target.value)} placeholder="Value" />
                <button type="button" onClick={() => removeListItem(field.key, i)} style={{ background: "none", border: "none", color: "#8a7fae", cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem(field.key, { label: "", value: 0 }, field.maxItems)} style={{ marginBottom: 16, background: "none", border: "1px solid #2b2440", color: "#8a7fae", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>+ Add point</button>
          </>
        );
      }
      case "pointCalloutList": {
        const list = getList(field.key);
        const points = getList("points");
        return (
          <>
            {list.map((row, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <select style={{ ...inputStyle, marginBottom: 0, width: 120 }} value={row.pointIndex ?? 0} onChange={(e) => updateListItem(field.key, i, "pointIndex", e.target.value)}>
                  {points.map((p, idx) => (
                    <option key={idx} value={idx}>{p.label || `Point ${idx}`}</option>
                  ))}
                </select>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={row.label || ""} onChange={(e) => updateListItem(field.key, i, "label", e.target.value)} placeholder="Callout text" />
                <input style={{ ...inputStyle, marginBottom: 0, width: 90 }} value={row.color || ""} onChange={(e) => updateListItem(field.key, i, "color", e.target.value)} placeholder="#hex" />
                <button type="button" onClick={() => removeListItem(field.key, i)} style={{ background: "none", border: "none", color: "#8a7fae", cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem(field.key, { pointIndex: 0, label: "", color: "" }, field.maxItems)} style={{ marginBottom: 16, background: "none", border: "1px solid #2b2440", color: "#8a7fae", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>+ Add callout</button>
          </>
        );
      }
      default:
        return null;
    }
  };

  const applyJson = (parsed: unknown) => {
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      setJsonMsg({ type: "error", text: "JSON must be an object with field keys, e.g. { \"title\": ... }" });
      return;
    }
    const obj = parsed as Record<string, unknown>;
    const imageFields = template!.fields.filter((f) => f.type === "image").map((f) => f.key);
    const skipped: string[] = [];
    const next: Record<string, FieldValue> = { ...values };

    for (const field of template!.fields) {
      if (!(field.key in obj)) continue;
      if (imageFields.includes(field.key)) {
        skipped.push(field.key); // can't set a File from JSON — must be uploaded separately
        continue;
      }
      next[field.key] = obj[field.key] as FieldValue;
    }

    setValues(next);
    setJsonMsg({
      type: "success",
      text:
        skipped.length > 0
          ? `Loaded. Note: ${skipped.join(", ")} can't come from JSON — upload that file separately below.`
          : "Loaded — form filled in.",
    });
  };

  const handleLoadJsonText = () => {
    try {
      applyJson(JSON.parse(jsonText));
    } catch {
      setJsonMsg({ type: "error", text: "Couldn't parse that as JSON — check for a stray comma or missing bracket." });
    }
  };

  const handleJsonFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result);
        setJsonText(text);
        applyJson(JSON.parse(text));
      } catch {
        setJsonMsg({ type: "error", text: "Couldn't parse that file as JSON." });
      }
    };
    reader.readAsText(file);
  };

  const loadExample = () => {
    const example = JSON.stringify(template!.exampleJson, null, 2);
    setJsonText(example);
    applyJson(template!.exampleJson);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("rendering");
    setErrorMsg(null);

    const formData = new FormData();
    formData.set("templateId", template.id);
    for (const field of template.fields) {
      const v = values[field.key];
      if (field.type === "image") {
        if (v instanceof File) formData.set(field.key, v);
      } else if (field.type === "calloutList" || field.type === "pointList" || field.type === "pointCalloutList") {
        formData.set(field.key, JSON.stringify(v || []));
      } else {
        formData.set(field.key, (v as string) || "");
      }
    }

    try {
      const res = await fetch("/api/render", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Render failed");
      setResultUrl(data.url);
      setStatus("done");
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>{template.name}</h1>
      <p style={{ color: "#8a7fae", marginBottom: 30 }}>{template.description}</p>

      <div style={{ background: "#111022", border: "1px solid #2b2440", borderRadius: 10, padding: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Import JSON</div>
        <div style={{ fontSize: 13, color: "#8a7fae", marginBottom: 10 }}>
          Paste JSON matching this template's fields (ask Claude for one, or write your own), upload a .json file, or load the example to see the shape.
        </div>
        <textarea
          style={{ ...inputStyle, minHeight: 100, fontFamily: "monospace", fontSize: 12, marginBottom: 8 }}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={`{\n  "title": "...",\n  ...\n}`}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={handleLoadJsonText} style={{ background: "#7C5CFC", border: "none", color: "#fff", borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
            Load JSON
          </button>
          <label style={{ background: "none", border: "1px solid #2b2440", color: "#8a7fae", borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 13 }}>
            Upload .json file
            <input
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleJsonFileUpload(e.target.files[0])}
            />
          </label>
          <button type="button" onClick={loadExample} style={{ background: "none", border: "1px solid #2b2440", color: "#8a7fae", borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 13 }}>
            Load example
          </button>
        </div>
        {jsonMsg && (
          <div style={{ marginTop: 10, fontSize: 13, color: jsonMsg.type === "error" ? "#ef4444" : "#22c55e" }}>
            {jsonMsg.text}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {template.fields.map((field) => (
          <div key={field.key}>
            <label style={labelStyle}>{field.label}</label>
            {renderField(field)}
          </div>
        ))}

        <button
          type="submit"
          disabled={status === "rendering"}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 8,
            border: "none",
            background: status === "rendering" ? "#4b3f6b" : "#7C5CFC",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            cursor: status === "rendering" ? "default" : "pointer",
          }}
        >
          {status === "rendering" ? "Rendering… (can take a minute)" : "Generate Video"}
        </button>
      </form>

      {status === "error" && <p style={{ color: "#ef4444", marginTop: 20 }}>Error: {errorMsg}</p>}

      {status === "done" && resultUrl && (
        <div style={{ marginTop: 30 }}>
          <video src={resultUrl} controls style={{ width: "100%", borderRadius: 12 }} />
          <a href={resultUrl} download style={{ display: "inline-block", marginTop: 12, color: "#7C5CFC" }}>Download mp4</a>
        </div>
      )}
    </main>
  );
}
