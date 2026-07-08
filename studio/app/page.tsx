import Link from "next/link";
import { templates } from "@/lib/templates";

export default function GalleryPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>Motion Metrics Studio</h1>
      <p style={{ color: "#8a7fae", marginBottom: 40 }}>
        Pick a template, fill in the form, generate a video — no chat needed.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
        {templates.map((t) => (
          <Link
            key={t.id}
            href={`/templates/${t.id}`}
            style={{
              display: "block",
              background: "#151024",
              border: "1px solid #2b2440",
              borderRadius: 12,
              padding: 20,
              textDecoration: "none",
              color: "#fff",
            }}
          >
            <div style={{ fontSize: 12, color: "#7C5CFC", fontWeight: 600, marginBottom: 6 }}>
              {t.aspectRatio}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{t.name}</div>
            <div style={{ fontSize: 14, color: "#8a7fae", marginTop: 6 }}>{t.description}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
