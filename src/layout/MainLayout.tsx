import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./components/Footer/Footer";
// import Sidebar from "./sidebar/Sidebar";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Sidebar /> */}
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
