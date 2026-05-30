import Dashboard from "@/components/Dashboard";

export const metadata = {
  title: "Dashboard - TaggySustain",
  description: "Seu impacto ambiental com a Taggy",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F4F7F5]">
      <Dashboard />
    </main>
  );
}
