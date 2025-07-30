import Beams from "@/components/Beams";
import { Button } from "@/components/ui/button";
import { usePuterStore } from "lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { DoorOpenIcon, UserIcon } from "lucide-react";
import Logo from "@/components/Logo";

export const meta = () => ([
    { title: 'AIResume | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="h-screen w-screen relative !pt-0">
            <Card className="w-full max-w-sm absolute top-1/2 left-1/2 -translate-1/2 z-10 bg-background">
                <CardHeader className=" justify-center">
                    <CardTitle>
                        <Logo className="mb-4"/>
                    </CardTitle>
                    <CardDescription className="text-center">
                        Log In to Continue Your Job Journey
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 items-center">
                    {isLoading ? (
                        <button className="auth-button animate-pulse">
                            <p>Signing you in...</p>
                        </button>
                    ) : (
                        <>
                            <Button disabled={auth.isAuthenticated} size={"lg"} onClick={auth.signIn} className="w-full cursor-pointer">
                                <UserIcon/> Log In
                            </Button>
                            <Button disabled={!auth.isAuthenticated} size={"lg"} variant={"outline"} onClick={auth.signOut} className="w-full cursor-pointer">
                                <DoorOpenIcon/> Log Out
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
            <Beams
                beamWidth={2}
                beamHeight={30}
                beamNumber={20}
                lightColor="#ffffff"
                speed={2}
                noiseIntensity={1.75}
                scale={0.2}
                rotation={30}
            />
        </main>
    );
}

export default Auth;