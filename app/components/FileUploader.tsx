import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from 'lib/utils';
import { CircleAlertIcon, TrashIcon } from 'lucide-react';
import { Button } from './ui/button';

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;

        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
    })

    const file = acceptedFiles[0] || null;

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer bg-sidebar border border-border rounded-xl p-6 backdrop-blur-sm shadow-sm">
                    {file ? (
                        <div className="uploader-selected-file flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                            <img src="/images/pdf.png" alt="pdf" className="size-10" />
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-sm font-medium text-foreground text-center truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground text-center">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <Button size={"icon"} variant={"destructive"} className="cursor-pointer" onClick={(e) => {
                                onFileSelect?.(null)
                            }}>
                                <TrashIcon className='w-4 h-4'/>
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <div className="mx-auto flex items-center justify-center mb-4">
                                <CircleAlertIcon className=' w-8 h-8'/>
                            </div>
                            <p className="text-lg text-muted-foreground text-center">
                                <span className="font-semibold">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-lg text-muted-foreground/75 text-center">PDF (max {formatSize(maxFileSize)})</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FileUploader;