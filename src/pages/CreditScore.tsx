import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import CreditScoreCard from "@/components/CreditScoreCard";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Target,
  CreditCard,
  Calendar,
  BarChart3
} from "lucide-react";
import { CreditScore as CreditScoreType } from "@/types/database";

const CreditScore = () => {
  // Mock credit score data with detailed history
  const mockCreditScore: CreditScoreType = {
    score: 720,
    grade: 'Very Good',
    last_updated: new Date().toISOString(),
    factors: [
      {
        factor: "Payment History",
        impact: "positive",
        description: "You have consistently made payments on time for the past 12 months. Keep maintaining this excellent payment record.",
        weight: 9
      },
      {
        factor: "Credit Utilization", 
        impact: "positive",
        description: "Your credit utilization is at 25%, which is within the recommended range of under 30%. Consider reducing it to under 10% for an excellent score.",
        weight: 7
      },
      {
        factor: "Credit History Length",
        impact: "neutral",
        description: "Your credit history is 3 years old, which is moderate. A longer credit history will improve your score over time.",
        weight: 6
      },
      {
        factor: "Credit Mix",
        impact: "positive", 
        description: "You have a good mix of credit types including loans and credit cards, which demonstrates responsible credit management.",
        weight: 8
      },
      {
        factor: "New Credit",
        impact: "negative",
        description: "You've opened 2 new accounts in the past 6 months. Avoid opening new accounts frequently to improve your score.",
        weight: 4
      }
    ]
  };

  // Mock score history data
  const scoreHistory = [
    { month: "Jan 2024", score: 680 },
    { month: "Feb 2024", score: 690 },
    { month: "Mar 2024", score: 700 },
    { month: "Apr 2024", score: 705 },
    { month: "May 2024", score: 710 },
    { month: "Jun 2024", score: 720 },
  ];

  const getScoreRange = (score: number) => {
    if (score >= 800) return { range: "Excellent", color: "text-green-600", description: "You have excellent credit" };
    if (score >= 740) return { range: "Very Good", color: "text-blue-600", description: "You have very good credit" };
    if (score >= 670) return { range: "Good", color: "text-yellow-600", description: "You have good credit" };
    if (score >= 580) return { range: "Fair", color: "text-orange-600", description: "You have fair credit" };
    return { range: "Poor", color: "text-red-600", description: "Your credit needs improvement" };
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'negative': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const scoreRange = getScoreRange(mockCreditScore.score);

  // Credit improvement tips based on current score
  const improvementTips = [
    {
      title: "Lower Credit Utilization",
      description: "Aim to use less than 10% of your available credit limit",
      priority: "High",
      impact: "+20-30 points"
    },
    {
      title: "Pay Bills on Time",
      description: "Set up automatic payments to never miss a due date",
      priority: "High", 
      impact: "+35-50 points"
    },
    {
      title: "Keep Old Accounts Open",
      description: "Maintain older credit accounts to increase your credit history length",
      priority: "Medium",
      impact: "+10-15 points"
    },
    {
      title: "Diversify Credit Types",
      description: "Consider adding different types of credit (installment loans, etc.)",
      priority: "Low",
      impact: "+5-10 points"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Credit Score</h1>
            <p className="text-gray-600 mt-2">Monitor and improve your creditworthiness</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Credit Score Card */}
            <div className="lg:col-span-2">
              <CreditScoreCard creditScore={mockCreditScore} />
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Score Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${scoreRange.color}`}>
                      {mockCreditScore.score}
                    </div>
                    <div className="text-lg font-medium text-gray-600">
                      {scoreRange.range}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {scoreRange.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>300</span>
                      <span>850</span>
                    </div>
                    <Progress 
                      value={((mockCreditScore.score - 300) / (850 - 300)) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    Last updated: {new Date(mockCreditScore.last_updated).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Recent Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scoreHistory.slice(-3).map((entry, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{entry.month}</span>
                        <span className="font-medium">{entry.score}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">+40 points in 6 months</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Credit Factors Analysis */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Credit Factors Analysis</CardTitle>
                <CardDescription>
                  Understanding what affects your credit score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockCreditScore.factors.map((factor, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getImpactIcon(factor.impact)}
                          <h3 className="font-medium">{factor.factor}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Weight: {factor.weight}/10</div>
                          <Badge 
                            variant="outline"
                            className={
                              factor.impact === 'positive' ? 'border-green-200 text-green-800' :
                              factor.impact === 'negative' ? 'border-red-200 text-red-800' :
                              'border-yellow-200 text-yellow-800'
                            }
                          >
                            {factor.impact}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                      <div className="mt-2">
                        <Progress value={factor.weight * 10} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Improvement Tips */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Credit Improvement Tips
                </CardTitle>
                <CardDescription>
                  Actionable steps to boost your credit score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {improvementTips.map((tip, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{tip.title}</h3>
                        <Badge 
                          variant="outline"
                          className={
                            tip.priority === 'High' ? 'border-red-200 text-red-800' :
                            tip.priority === 'Medium' ? 'border-yellow-200 text-yellow-800' :
                            'border-green-200 text-green-800'
                          }
                        >
                          {tip.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-600">
                          Potential Impact: {tip.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score History Chart */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Score History
                </CardTitle>
                <CardDescription>
                  Your credit score trend over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scoreHistory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{entry.month}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold">{entry.score}</span>
                        {index > 0 && (
                          <div className="flex items-center">
                            {entry.score > scoreHistory[index - 1].score ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : entry.score < scoreHistory[index - 1].score ? (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            ) : null}
                            <span className={`text-sm ml-1 ${
                              entry.score > scoreHistory[index - 1].score ? 'text-green-600' :
                              entry.score < scoreHistory[index - 1].score ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {entry.score > scoreHistory[index - 1].score ? '+' : ''}
                              {entry.score - scoreHistory[index - 1].score}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScore;
