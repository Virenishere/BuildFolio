
import { Outlet } from "react-router";

const PrivateLayout = () =>{
    return(
        <div>
            <Outlet />
        </div>
    )
}
export default PrivateLayout;