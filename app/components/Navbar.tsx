import { Link } from "react-router";
import { Button } from "./ui/button";
import { usePuterStore } from "lib/puter";
import { DoorOpenIcon, UserIcon } from "lucide-react";

const Navbar = () => {
    const { auth } = usePuterStore()

    const handleSignOut = async () => {
        await auth.signOut()
    }

    return (
        <nav className="navbar">
            <Link to="/">
                <img src="logo.svg" alt="AI Resume Analyser" className="h-8 w-auto" />
            </Link>
            <div className="flex gap-1">
                <Button size={"lg"}>
                    <Link to="/upload" className="">
                        Upload Resume
                    </Link>
                </Button>
                <Button
                    size={"lg"}
                    variant={"destructive"}
                    className="inline-flex gap-1 items-center cursor-pointer"
                    onClick={handleSignOut}
                >
                    <DoorOpenIcon /> Logout
                </Button>
            </div>
        </nav>
    )
}
export default Navbar