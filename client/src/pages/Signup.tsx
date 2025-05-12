import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router";

const Signup = () => {
    return(
        <div>
            <div>
            Sigup Page

            </div>
            <Link to="/login">
            <Button>
                Click Here for Login
            </Button>
            </Link>
        
        </div>
    )
}

export default Signup;