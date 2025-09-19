// app/configuration/primary/page.tsx
import dynamic from "next/dynamic";

// Load the editor only on the client if it relies on browser APIs.
const FrameworkEditor = dynamic(
  () => import("@/components/framework/FrameworkEditor"),
  { ssr: false }
);

export default function PrimaryFrameworkEditorPage() {
  // The FrameworkEditor component renders its own PageHeader (group=configuration, page=primary).
  return <FrameworkEditor />;
}
