import { Link } from "react-router";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePuterStore } from "lib/puter";
import { DoorOpenIcon, FileUpIcon, Moon, Sun } from "lucide-react";
import useTheme from "hooks/use-theme";
import Logo from "./Logo";
import Favicon from "./Favicon";

const Navbar = () => {
    const { auth } = usePuterStore()
    const { setTheme } = useTheme()

    const handleSignOut = async () => {
        await auth.signOut()
    }

    return (
        <nav className="p-4 w-full">
            <div className="flex justify-between items-center container mx-auto">
                <Link to="/" className="hidden md:block">
                    <Logo/>
                </Link>
                <Link to="/" className="block md:hidden">
                    <Favicon className="h-8"/>
                </Link>
                <div className="flex gap-2 h-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size={"icon"}>
                                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:hidden" />
                                <Moon className="h-[1.2rem] w-[1.2rem] hidden scale-0 rotate-90 transition-all dark:inline-block dark:scale-100 dark:rotate-0" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Separator orientation="vertical" />
                    <Button className="hidden md:inline-flex items-center gap-x-1" asChild>
                        <Link to="/upload" className="">
                            <FileUpIcon/> Upload Resume
                        </Link>
                    </Button>
                    <Button
                        variant={"outline"}
                        className="inline-flex gap-1 items-center cursor-pointer"
                        onClick={handleSignOut}
                    >
                        <DoorOpenIcon /> Logout
                    </Button>
                </div>
            </div>
        </nav>
    )
}
export default Navbar