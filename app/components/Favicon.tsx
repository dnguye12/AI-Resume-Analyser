interface FaviconProps {
    className?: string | undefined
}

const Favicon = ({ className }: FaviconProps) => {
    return (
        <>
            <img src="/favicon-light.svg" className={`hidden dark:block ${className}`} />
            <img src="/favicon.svg" className={`block dark:hidden ${className}`} />
        </>
    );
}

export default Favicon;