import GeneratorForm from "@/components/GeneratorForm";

export default function GeneratePage() {
  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h1>Generate AI Compliance Pack</h1>
      <p style={{ color: "#666" }}>
        Generates internal templates (not legal advice). EU AI Act + US best practices.
      </p>
      <GeneratorForm />
    </div>
  );
}
