import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-green-500'
            : score > 49
        ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="flex flex-row items-center justify-center py-2 gap-4">
            <div className="flex flex-row gap-2 items-center bg-muted rounded-2xl p-4 w-full justify-between border">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-lg">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-xl font-bold tracking-wider">
                    <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-sidebar border p-4 rounded-2xl shadow-md w-full">
            <div className="flex flex-row items-center p-4 gap-8">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-foreground">Your Resume Score</h2>
                    <p className="text-sm text-muted-foreground">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
            <Category title="Content" score={feedback.content.score} />
            <Category title="Structure" score={feedback.structure.score} />
            <Category title="Skills" score={feedback.skills.score} />
        </div>
    )
}
export default Summary