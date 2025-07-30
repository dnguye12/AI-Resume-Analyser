import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine background gradient based on score
  const textClass = score > 69
    ? 'text-green-500'
    : score > 49
      ? 'text-yellow-500'
      : 'text-red-500';

  const bgClass = score > 69
    ? 'bg-green-700/50'
    : score > 49
      ? 'bg-yellow-700/50'
      : 'bg-red-700/50';

  // Determine subtitle based on score
  const subtitle = score > 69
    ? 'Great Job!'
    : score > 49
      ? 'Good Start'
      : 'Needs Improvement';

  return (
    <div className={`bg-sidebar rounded-2xl shadow-md w-full p-6 border`}>
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 ${bgClass} ${textClass} rounded-lg inline-flex items-center justify-center`}>
          {
            score > 69
              ?
              (
                <CircleCheckIcon className="w-8 h-8" />
              )
              :
              score > 49
                ?
                (
                  <CircleAlertIcon className="w-8 h-8" />
                )
                :
                (
                  <CircleAlertIcon className="w-8 h-8" />
                )
          }
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${textClass}`}>ATS Score - {score}/100</h2>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{subtitle}</h3>
        <p className="text-muted-foreground mb-4">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
        </p>

        {/* Suggestions list */}
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3">
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={suggestion.type === "good" ? "Check" : "Warning"}
                className="w-5 h-5 mt-1"
              />
              <p className={suggestion.type === "good" ? "text-green-500" : "text-yellow-500"}>
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing encouragement */}
      <p className="text-muted-foreground/75 italic">
        Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
      </p>
    </div>
  )
}

export default ATS