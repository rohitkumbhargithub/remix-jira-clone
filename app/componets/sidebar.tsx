// import Image from "next/image"
import { Link } from "@remix-run/react"
import { Navigation } from "./navigation"
import { WorkspaceSwitcher } from "./workspace-switcher"
// import { DottedSperator } from "./dotted-speator"

export const Sidebar = () => {

    
    return (
        <aside className="h-[35rem] bg-neutral-100 p-5 w-full">
            <Link to="/">
                {/* <Image src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg" alt="logo" width={164} height={48} /> */}
                <h1>LOGO</h1>
            </Link>
            <WorkspaceSwitcher />
            {/* <DottedSperator/> */}
            <Navigation />
        </aside>
    )
}
