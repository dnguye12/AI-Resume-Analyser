import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "lib/puter";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const {fs} = usePuterStore()
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async() =>  {
            const blob = await fs.read(imagePath)
            if(!blob) {
                return;
            }
            let url = URL.createObjectURL(blob)
            setResumeUrl(url)
        }

        loadResume()
    }, [imagePath])

    return (
        <Link to={`/resume/${id}`} className="animate-in fade-in duration-1000 flex flex-col gap-4 w-full lg:w-[450px] xl:w-[490px] bg-card rounded-xl p-4 pb-8 border shadow-sm z-10 hover:duration-300 hover:scale-[1.02]">
            <div className="flex flex-row gap-2 justify-between min-h-[110px] max-sm:flex-col items-center max-md:items-center">
                <div className="flex flex-col gap-2">
                    {companyName && <h2 className="text-foreground text-2xl font-bold break-words text-start">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg break-words text-muted-foreground">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            <div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full">
                    <img
                        src={resumeUrl}
                        alt="resume"
                        className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                    />
                </div>
            </div>
        </Link>
    )
}
export default ResumeCard