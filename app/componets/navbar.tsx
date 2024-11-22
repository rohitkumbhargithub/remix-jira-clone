import { Link, useLocation } from "@remix-run/react"
import { Button } from "~/components/ui/button";
import Logo from "~/componets/utils/logo.png"

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isSignIn = pathname === "/sign-in";
    return (
        <nav className="px-2 py-1 bg-black">
        <ul className="flex justify-between">
          <li className="mr-6">
            <Link className="text-blue-500 hover:text-blue-800" to="#">
              <img src={Logo} width={40}/>
            </Link>
          </li>
          <div className="flex justify-center">
              <li className="mr-6">
                <Button className="py-2 rounded inline-flex items-center"
                 variant="outline"
                >
                  
                  <Link to={isSignIn ? "/sign-up" : "/sign-in"}>{pathname === "/sign-in" ? "Sign Up" : "Login"}</Link>
                </Button>
              </li>
            
          </div>
        </ul>
        </nav>
    )
}

export default Navbar;