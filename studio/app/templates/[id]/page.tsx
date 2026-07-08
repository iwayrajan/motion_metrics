"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { templates, audioCatalog } from "@/lib/templates";

type Callout = { text: string; top: number };

export default function TemplateFormPage() {
  const params = useParams();
  const templateId = params.id as string;
  const template = templates.find((t) => t.id === templateId);

  const [hook, setHook] = useState("");
  const [cta, setCta] = useState("");
  const [musicFile, setMusicFile] = useState(audioCatalog[0]?.file || "");
  const [image, setImage] = useState<File | null>(null);
  const [callouts, setCallouts] = useState<Callout[]>([
    { text: "", top: 25 },
    { text: "", top: 50 },
    { text: "", top: 75 },
  ]);
  const [status, setStatus] = useState<"idle" | "rendering" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!template) {
    return <main style={{ padding: 40 }}>Unknown template: {templateId}</main>;
  }

  const updateCallout = (i: number, field: keyof Callout, value: string) => {
    setCallouts((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, [field]: field === "top" ? Number(value) : value } : c))
    );
  };

  const addCallout = () => {
    if (callouts.length >= (template.fields.find((f) => f.type === "calloutList")?.maxItems || 5)) return;
    setCallouts((prev) => [...prev, { text: "", top: 50 }]);
  };

  const removeCallout = (i: number) => setCallouts((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("rendering");
    setErrorMsg(null);

    const formData = new FormData();
    formData.set("templateId", template.id);
    formData.set("hook", hook);
    formData.set("cta", cta);
    formData.set("musicFile", musicFile);
    formData.set("callouts", JSON.stringify(callouts.filter((c) => c.text.trim() !== "")));
    if (image) formData.set("image", image);

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

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>{template.name}</h1>
      <p style={{ color: "#8a7fae", marginBottom: 30 }}>{template.description}</p>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Headline</label>
        <input style={inputStyle} value={hook} onChange={(e) => setHook(e.target.value)} placeholder="e.g. Introducing our new template" required />

        <label style={labelStyle}>Image</label>
        <input
          style={inputStyle}
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          required
        />

        <label style={labelStyle}>Callouts (feature text + vertical position %)</label>
        {callouts.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              value={c.text}
              onChange={(e) => updateCallout(i, "text", e.target.value)}
              placeholder={`Callout ${i + 1}`}
            />
            <input
              style={{ ...inputStyle, marginBottom: 0, width: 80 }}
              type="number"
              min={0}
              max={100}
              value={c.top}
              onChange={(e) => updateCallout(i, "top", e.target.value)}
            />
            <button type="button" onClick={() => removeCallout(i)} style={{ background: "none", border: "none", color: "#8a7fae", cursor: "pointer" }}>
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={addCallout} style={{ marginBottom: 16, background: "none", border: "1px solid #2b2440", color: "#8a7fae", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
          + Add callout
        </button>

        <label style={labelStyle}>Call to action</label>
        <input style={inputStyle} value={cta} onChange={(e) => setCta(e.target.value)} placeholder="e.g. Try it free at yoursite.com" required />

        <label style={labelStyle}>Background music</label>
        <select style={inputStyle} value={musicFile} onChange={(e) => setMusicFile(e.target.value)}>
          {audioCatalog.map((a) => (
            <option key={a.file} value={a.file}>
              {a.label}
            </option>
          ))}
        </select>

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

      {status === "error" && (
        <p style={{ color: "#ef4444", marginTop: 20 }}>Error: {errorMsg}</p>
      )}

      {status === "done" && resultUrl && (
        <div style={{ marginTop: 30 }}>
          <video src={resultUrl} controls style={{ width: "100%", borderRadius: 12 }} />
          <a href={resultUrl} download style={{ display: "inline-block", marginTop: 12, color: "#7C5CFC" }}>
            Download mp4
          </a>
        </div>
      )}
    </main>
  );
}
