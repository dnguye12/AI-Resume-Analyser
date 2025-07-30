import { usePuterStore } from "lib/puter";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ATS from "@/components/AST";
import Details from "@/components/Details";
import Summary from "@/components/Summary";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export const meta = () => ([
    { title: 'AIResume | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState("")
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/resume/${id}`)
        }
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`)

            if (!resume) {
                return
            }

            const data = JSON.parse(resume)

            const resumeBlob = await fs.read(data.resumePath)
            if (!resumeBlob) {
                return
            }

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' })
            const resumeUrl = URL.createObjectURL(pdfBlob)
            setResumeUrl(resumeUrl)

            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) {
                return;
            }
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback)
        }
        loadResume()
    }, [id])

    return (
        <main className="bg-background min-h-screen w-screen flex flex-col relative">
            <Navbar />
            <div className="container mx-auto grid grid-cols-2 max-lg:flex max-lg:flex-col-reverse gap-8 my-8">
                <section className="w-full sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 w-full h-auto group">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain group-hover:scale-95 transition-all duration-500"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="w-full feedback-section">
                    <h2 className="text-4xl text-foreground font-bold mb-2">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Skeleton className="w-full h-[20vh]" />
                            <Skeleton className="w-full h-[20vh]" />
                            <Skeleton className="w-full h-[20vh]" />
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default Resume;