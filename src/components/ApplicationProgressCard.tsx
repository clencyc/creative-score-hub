import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  Eye,
  Calendar,
  ArrowRight
} from "lucide-react";
import { Application, ApplicationProgress } from "@/types/database";

interface ApplicationProgressCardProps {
  applications: Application[];
  applicationProgress: Record<string, ApplicationProgress>;
  onViewApplication: (applicationId: string) => void;
}

const ApplicationProgressCard = ({ applications, applicationProgress, onViewApplication }: ApplicationProgressCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return "bg-green-100 text-green-800";
      case 'under_review': return "bg-blue-100 text-blue-800";
      case 'submitted': return "bg-yellow-100 text-yellow-800";
      case 'rejected': return "bg-red-100 text-red-800";
      case 'pending_documents': return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'under_review': return <Eye className="h-4 w-4" />;
      case 'submitted': return <FileText className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      case 'pending_documents': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getApplicationStages = (type: string) => {
    const baseStages = [
      "Application Submitted",
      "Initial Review", 
      "Document Verification",
      "Assessment",
      "Decision"
    ];

    if (type === 'loan') {
      return [
        "Application Submitted",
        "Credit Check",
        "Financial Assessment", 
        "Risk Analysis",
        "Approval Decision"
      ];
    }

    return baseStages;
  };

  const getCurrentStageIndex = (status: string) => {
    switch (status) {
      case 'submitted': return 0;
      case 'under_review': return 1;
      case 'pending_documents': return 2;
      case 'approved': case 'rejected': return 4;
      default: return 0;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Application Progress
        </CardTitle>
        <CardDescription>
          Track the status and progress of your applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No applications submitted yet</p>
            <p className="text-sm">Start your creative funding journey today</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              const progress = applicationProgress[app.id];
              const stages = getApplicationStages(app.application_type);
              const currentStageIndex = progress?.current_stage || getCurrentStageIndex(app.status);
              const progressPercentage = ((currentStageIndex + 1) / stages.length) * 100;

              return (
                <div key={app.id} className="border rounded-lg p-4 space-y-4">
                  {/* Application Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{app.project_title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {app.business_name} • {formatAmount(app.funding_amount_requested)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(app.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(app.status)}
                          {app.status.replace('_', ' ')}
                        </div>
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewApplication(app.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progressPercentage)}% Complete</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  {/* Stages */}
                  <div className="space-y-2">
                    {stages.map((stage, index) => {
                      const isCompleted = index < currentStageIndex;
                      const isCurrent = index === currentStageIndex;
                      const isUpcoming = index > currentStageIndex;

                      return (
                        <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${
                          isCurrent ? 'bg-blue-50 border border-blue-200' : ''
                        }`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            isCompleted ? 'bg-green-500 text-white' :
                            isCurrent ? 'bg-blue-500 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {isCompleted ? <CheckCircle className="h-3 w-3" /> : index + 1}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${
                              isCompleted ? 'text-green-700' :
                              isCurrent ? 'text-blue-700' :
                              'text-gray-500'
                            }`}>
                              {stage}
                            </div>
                            {isCurrent && progress?.description && (
                              <p className="text-xs text-blue-600 mt-1">
                                {progress.description}
                              </p>
                            )}
                          </div>
                          {isCurrent && progress?.estimated_completion && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Est. {new Date(progress.estimated_completion).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Timeline Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Submitted: {new Date(app.created_at).toLocaleDateString()}</span>
                    {app.submitted_at && (
                      <span>Last Update: {new Date(app.submitted_at).toLocaleDateString()}</span>
                    )}
                  </div>

                  {/* Action Items */}
                  {app.status === 'pending_documents' && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 text-orange-800 font-medium mb-1">
                        <AlertCircle className="h-4 w-4" />
                        Action Required
                      </div>
                      <p className="text-sm text-orange-700">
                        Additional documents needed. Please upload the requested documents to proceed.
                      </p>
                      <Button size="sm" className="mt-2">
                        Upload Documents
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationProgressCard;
