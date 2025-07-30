import Navbar from "../components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "@/components/ResumeCard";
import { useEffect, useState } from "react";
import { usePuterStore } from "lib/puter";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import Favicon from "@/components/Favicon";
import { FileUpIcon } from "lucide-react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "AIResume | Home" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (auth && !auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true)

      const resumes = (await kv.list("resume:*", true)) as KVItem[]

      const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, [])

  return (
    <main className=" bg-background min-h-screen w-screen flex flex-col relative">
      <Navbar />
      <section className="flex-1 flex flex-col items-center gap-6 text-center my-16">
        <div className="rounded-xl bg-sidebar p-4 backdrop-blur-sm w-20 h-20 flex items-center justify-center shadow-sm  mb-6">
          <Favicon className="w-16" />
        </div>
        <div>
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">Track Your Applications & Resume Ratings</h1>
          {
            !loadingResumes && resumes?.length === 0
              ?
              (
                <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl animate-pulse">No resumes found. Upload your first resume to get feedback.</p>
              )
              :
              (
                <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">Review your submissions and check AI-powered feedback.</p>
              )
          }

        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}
        {!loadingResumes && resumes.length > 0 && (
          <div className="flex flex-wrap max-lg:px-8 max-lg:flex-col gap-6 items-start  w-full justify-evenly relative z-10 mt-8">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-6 gap-4">
            <Button asChild size={"lg"} variant={"default"} className="inline-flex items-center gap-x-1">
              <Link to="/upload">
                <FileUpIcon /> Upload Resume
              </Link>
            </Button>
          </div>
        )}
      </section>
      <div className="fixed inset-x-0 top-0 left-0 right-0 h-full w-full z-0 pointer-events-none">
        <img src="/images/square-alt-grid.svg" className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90 dark:opacity-20" />
      </div>
    </main>
  );
}
