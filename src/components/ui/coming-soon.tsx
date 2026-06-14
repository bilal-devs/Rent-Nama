import { Building2 } from "lucide-react";

export default function ComingSoonPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-4">
        <Building2 className="w-8 h-8 text-outline" />
      </div>
      <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-2">{title}</h1>
      <p className="text-sm text-on-surface-variant text-center max-w-md">{description}</p>
    </div>
  );
}
