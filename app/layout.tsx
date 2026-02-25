import Nav from "@/components/Nav";

export const metadata = {
  title: "AI Policy OS",
  description: "Generate AI compliance policy packs (EU + US)."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
