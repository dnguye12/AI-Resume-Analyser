import { useState, type FormEvent } from "react";
import { usePuterStore } from "lib/puter";
import { convertPdfToImage } from "lib/pdf2img";
import FileUploader from "@/components/FileUploader";
import Navbar from "@/components/Navbar";
import { generateUUID } from "lib/utils";
import { prepareInstructions } from "constants/index";
import { useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Route } from "./+types/home";
import { SearchIcon } from "lucide-react";
import { toast } from "sonner"

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "AIResume | Upload" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore()
    const [isProcessing, setIsProcessing] = useState(false)
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate()

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget.closest("form")
        if (!form) {
            return
        }

        const formData = new FormData(form)
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) {
            return
        }

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true)
        setStatusText("Uploading the file...")

        const uploadedFile = await fs.upload([file])
        if (!uploadedFile) {
            toast('Error: Failed to upload file')
            window.location.reload()
            return
        }

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) {
            toast('Error: Failed to convert PDF to image');
            window.location.reload()
            return
        }

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) {
            toast('Error: Failed to upload image');
            window.location.reload()
            return
        }

        setStatusText('Preparing data...');
        const uuid = generateUUID()
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data))

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )

        if (!feedback) {
            toast('Error: Failed to analyze resume');
            window.location.reload()
            return
        }

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        navigate(`/resume/${uuid}`);
    }

    return (
        <main className="min-h-screen w-screen flex flex-col relative">
            <Navbar />
            <section className="container mx-auto">
                <div className="py-16">
                    <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl text-center">Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2 className="mx-auto max-w-3xl lg:text-xl text-center">{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-64 h-auto mx-auto" />
                        </>
                    ) : (
                        <h2 className="mx-auto max-w-3xl lg:text-xl text-center">Drop your resume for an ATS score and improvement tips.</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 max-w-2xl mx-auto">
                            <div className="mb-6">
                                <Label htmlFor="company-name" className="mb-3">Company Name</Label>
                                <Input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="mb-6">
                                <Label htmlFor="job-title" className="mb-3">Job Title</Label>
                                <Input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="mb-6">
                                <Label htmlFor="job-description" className="mb-3">Job Description</Label>
                                <Textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="mb-6">
                                <Label htmlFor="uploader" className="mb-3">Upload Resume</Label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <Button
                                size={"lg"}
                                className="w-full cursor-pointer"
                                type="submit"
                                disabled={isProcessing || !file}
                            >
                                <SearchIcon /> Analyze Resume
                            </Button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Upload;