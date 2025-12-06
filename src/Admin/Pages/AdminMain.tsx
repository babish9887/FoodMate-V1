import { useState, useEffect } from "react";
import Navbar from "../AdminComponents/Navbar"
import Sidebar from "../AdminComponents/Sidebar"
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Menu from "./Menu";
import Feedbacks from "./Feedbacks";
import Customers from "./Customers";

const AdminPage = () => {
  const getInitialComponent = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      const validTabs = ["Dashboard", "Orders", "Menu", "Feedback", "Customers"];
      if (tab && validTabs.includes(tab)) {
        return tab;
      }
    }
    return "Dashboard";
  };

  const [activeComponent, setIsActiveComponent] = useState(getInitialComponent);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeComponent);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  }, [activeComponent]);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <Dashboard  />;
      case "Orders":
        return <Orders />;
      case "Menu":
        return <Menu />;
      case "Feedback":
        return <Feedbacks />;
      case "Customers":
        return <Customers />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <div className="w-full flex justify-between text-black">
        <Sidebar 
          activeComponent={activeComponent}
          setIsActiveComponent={setIsActiveComponent} 
        />
        <div className="w-full h-auto  flex-1 bg-zinc-100 justify-center items-center ">
        <Navbar activeComponent={activeComponent}/>    
        <div className="w-full p-6" >
            {renderActiveComponent()}
        </div>
        </div>
    </div>
  )
}

export default AdminPage