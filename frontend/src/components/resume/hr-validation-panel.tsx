import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { HrValidationResponse } from '@/types/smart-resume'
import { RecommendationCard } from './recommendation-card'

interface HrValidationPanelProps {
  validation: HrValidationResponse
}

function ScoreRow({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-3">
      <span className="text-sm font-medium sm:w-[200px]">{label}</span>
      <div className="flex-1">
        <Progress value={Math.round(score * 100)} />
      </div>
    </div>
  )
}

// Displays HR AI validation scores, strengths, gaps, and recommendations
export function HrValidationPanel({ validation }: HrValidationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>HR Validation Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-primary">
            <span className="text-2xl font-bold">{validation.overallScore.toFixed(1)}/10</span>
          </div>
        </div>

        <ScoreRow label="Keyword Match" score={validation.keywordMatchScore} />
        <ScoreRow label="Experience Relevance" score={validation.experienceRelevanceScore} />
        <ScoreRow label="Skills Alignment" score={validation.skillsAlignmentScore} />
        <ScoreRow label="Resume Quality" score={validation.resumeQualityScore} />
        <ScoreRow label="Education Fit" score={validation.educationFitScore} />

        {validation.strengths.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold text-sm mb-2">Strengths</p>
            <div className="flex flex-wrap gap-2">
              {validation.strengths.map((s, i) => (
                <Badge key={i} variant="secondary" className="bg-green-500/10 text-green-500">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        {validation.gaps.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold text-sm mb-2">Gaps</p>
            <div className="flex flex-wrap gap-2">
              {validation.gaps.map((g, i) => (
                <Badge key={i} variant="secondary" className="bg-red-500/10 text-red-500">{g}</Badge>
              ))}
            </div>
          </div>
        )}

        {validation.recommendations.length > 0 && (
          <div className="mt-6">
            <p className="font-semibold text-sm mb-3">Recommendations</p>
            <div className="space-y-3">
              {validation.recommendations.map((rec, i) => (
                <RecommendationCard key={i} recommendation={rec} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
