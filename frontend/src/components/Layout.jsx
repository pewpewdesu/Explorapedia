import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout()
{
    return(
        <div className = "min-hscreen bg-gray-100">
            <Navbar />
            <main className = "p-8">
                <Outlet />
            </main>
        </div>
    )
}