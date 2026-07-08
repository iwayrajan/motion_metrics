export const metadata = { title: "Motion Metrics Studio" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0b0b14", color: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
