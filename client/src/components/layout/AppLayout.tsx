import Sidebar from "./Sidebar";

import Navbar from "./Navbar";

import Footer from "./Footer";

export default function AppLayout({ children }: any) {
  return (
    <div
      className="

md:flex

min-h-screen

bg-gray-50

"
    >
      <Sidebar />

      <div
        className="

flex-1

flex

flex-col

min-h-screen

"
      >
        <Navbar />

        <main
          className="

p-8

flex-1

"
        >
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
