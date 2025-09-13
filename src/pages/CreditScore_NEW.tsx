import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
      }
    ]
  };

  const scoreHistory = [
    { month: "Jan 2024", score: 680 },
    { month: "Feb 2024", score: 695 },
    { month: "Mar 2024", score: 710 },
    { month: "Apr 2024", score: 720 }
  ];

  const scoreRange = {
    color: mockCreditScore.score >= 750 ? "text-green-600" : 
           mockCreditScore.score >= 700 ? "text-blue-600" : 
           mockCreditScore.score >= 650 ? "text-yellow-600" : "text-red-600"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
                  <Badge className="mt-2" variant="secondary">
                    {mockCreditScore.grade}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Range</span>
                    <span className="text-sm font-medium">300 - 850</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last Update</span>
                    <span className="text-sm font-medium">
                      {new Date(mockCreditScore.last_updated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Score History
                </CardTitle>
                <CardDescription>
                  Your credit score trend over the past 4 months
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
                            <span className="text-sm ml-1 text-gray-600">
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
