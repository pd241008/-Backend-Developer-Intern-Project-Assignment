import Sidebar from "../components/Sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4f5f7] pt-32">
      <div className="max-w-[1600px] mx-auto flex relative">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex justify-center w-full">
          <main className="w-full max-w-4xl px-8 py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
