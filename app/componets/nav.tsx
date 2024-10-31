import { MobileSidebar } from "./ui/mobile-sidebar"
import UserButton from "./user-button"

export const Nav = () => {
    return (
        <nav className="pt-4 px-6 flex items-center justify-between">
            <div className="flex-col hidden lg:flex">
                <h1>Home</h1>
                <p className="text-muted-foreground">Monitor all of your projects and tasks here</p>
            </div>
            <MobileSidebar/>
            <UserButton/>
        </nav>
    )
}