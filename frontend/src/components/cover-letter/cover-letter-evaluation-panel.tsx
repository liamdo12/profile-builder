import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { CoverLetterEvaluation } from '@/types/cover-letter'

interface CoverLetterEvaluationPanelProps {
  evaluation: CoverLetterEvaluation
}

export function CoverLetterEvaluationPanel({ evaluation }: CoverLetterEvaluationPanelProps) {
  const matchColor =
    evaluation.matchPercentage >= 80
      ? 'text-green-500'
      : evaluation.matchPercentage >= 60
        ? 'text-yellow-500'
        : 'text-red-500'
  const badgeVariant = evaluation.matchPercentage >= 90 ? 'default' : 'secondary'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cover Letter Evaluation</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Match percentage circle */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-primary">
            <span className={`text-2xl font-bold ${matchColor}`}>
              {Math.round(evaluation.matchPercentage)}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium">Match Score</span>
            <span className="text-muted-foreground">{Math.round(evaluation.matchPercentage)}%</span>
          </div>
          <Progress value={Math.round(evaluation.matchPercentage)} />
        </div>

        {/* Verdict badge */}
        <div className="mb-4">
          <Badge
            variant={badgeVariant}
            className={evaluation.matchPercentage >= 90 ? 'bg-green-500/10 text-green-500' : ''}
          >
            {evaluation.verdict}
          </Badge>
        </div>

        {/* Suggestions */}
        {evaluation.suggestions.length > 0 ? (
          <div className="mt-4">
            <p className="font-semibold text-sm mb-2">Suggestions</p>
            <div className="space-y-2">
              {evaluation.suggestions.map((suggestion, index) => (
                <div key={index} className="rounded-md border p-3 text-sm">
                  <span className="font-medium mr-2">{index + 1}.</span>
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <p className="text-green-500 font-medium">Your cover letter is an excellent match!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
