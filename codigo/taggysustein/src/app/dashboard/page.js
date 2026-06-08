import Painel from "@/components/Painel";

export const metadata = {
  title: "Painel - TaggySustain",
  description: "Seu impacto ambiental com a Taggy",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <Painel />
    </main>
  );
}
