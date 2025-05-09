import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const PublicLayout = () =>{
    return(
        <div className="px-16 py-8 relative z-10">
            <Navbar />
            <main>
                <Outlet /> 
            </main>
            <Footer />
        </div>
    )
}

export default PublicLayout;