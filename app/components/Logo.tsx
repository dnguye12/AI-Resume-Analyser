interface LogoProps {
    className?: string | undefined
}

const Logo = ({ className }: LogoProps) => {
    return (
        <>
            <img src="/logo-light.svg" alt="AI Resume Analyser" className={`h-8 w-auto hidden dark:block ${className}`} />
            <img src="/logo.svg" alt="AI Resume Analyser" className={`h-8 w-auto block dark:hidden ${className}`} />
        </>
    );
}

export default Logo;