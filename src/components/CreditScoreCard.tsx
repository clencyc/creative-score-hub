import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Info } from "lucide-react";
import { CreditScore, CreditFactor } from "@/types/database";

interface CreditScoreCardProps {
  creditScore: CreditScore;
}

const CreditScoreCard = ({ creditScore }: CreditScoreCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 750) return "bg-green-500";
    if (score >= 700) return "bg-blue-500";
    if (score >= 650) return "bg-yellow-500";
    if (score >= 600) return "bg-orange-500";
    return "bg-red-500";
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Excellent': return "bg-green-100 text-green-800";
      case 'Very Good': return "bg-blue-100 text-blue-800";
      case 'Good': return "bg-yellow-100 text-yellow-800";
      case 'Fair': return "bg-orange-100 text-orange-800";
      case 'Poor': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFactorIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Credit Score Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Credit Score
          </CardTitle>
          <CardDescription>
            Last updated: {new Date(creditScore.last_updated).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{creditScore.score}</div>
              <Badge className={getGradeColor(creditScore.grade)}>
                {creditScore.grade}
              </Badge>
            </div>
            <div className="flex-1 ml-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Poor</span>
                  <span>Fair</span>
                  <span>Good</span>
                  <span>Very Good</span>
                  <span>Excellent</span>
                </div>
                <Progress 
                  value={(creditScore.score / 850) * 100} 
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>300</span>
                  <span>600</span>
                  <span>650</span>
                  <span>700</span>
                  <span>750</span>
                  <span>850</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Score Factors</CardTitle>
          <CardDescription>
            Factors affecting your credit score and their impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creditScore.factors.map((factor, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="mt-0.5">
                  {getFactorIcon(factor.impact)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{factor.factor}</h4>
                    <Badge variant={factor.impact === 'positive' ? 'default' : 
                                 factor.impact === 'negative' ? 'destructive' : 'secondary'}>
                      Weight: {factor.weight}/10
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{factor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Credit Improvement Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            How to Improve Your Credit Score
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your credit profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creditScore.score < 650 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Priority Actions</h4>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Pay all bills on time - payment history is 35% of your score</li>
                  <li>• Reduce credit card balances below 30% of credit limit</li>
                  <li>• Check for errors in your credit report and dispute them</li>
                </ul>
              </div>
            )}
            
            {creditScore.score >= 650 && creditScore.score < 750 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Continue Building</h4>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li>• Keep old credit accounts open to maintain credit history length</li>
                  <li>• Diversify your credit mix (credit cards, loans, etc.)</li>
                  <li>• Keep credit utilization below 10% for optimal scores</li>
                </ul>
              </div>
            )}

            {creditScore.score >= 750 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Excellent Credit!</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Maintain current payment habits</li>
                  <li>• Monitor your credit regularly for any changes</li>
                  <li>• Consider premium credit products with better terms</li>
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium mb-2">Quick Wins</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Set up automatic payments</li>
                  <li>• Request credit limit increases</li>
                  <li>• Use credit monitoring apps</li>
                </ul>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium mb-2">Long-term Strategy</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Build emergency fund</li>
                  <li>• Diversify income sources</li>
                  <li>• Plan major purchases carefully</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditScoreCard;
