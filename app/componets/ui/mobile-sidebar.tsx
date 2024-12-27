import { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";
import { Sidebar } from "~/componets/sidebar";
import { Button } from "~/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"

import { useLocation } from "@remix-run/react"

export const MobileSidebar = ({projects}) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])
    return (
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}> 
            <SheetTrigger asChild>
                <Button size="icon" variant="secondary" className="lg:hidden size-8">
                    <MenuIcon className="size-4 text-neutral-500"/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <Sidebar projects={projects} />
            </SheetContent>
        </Sheet>
    )
}