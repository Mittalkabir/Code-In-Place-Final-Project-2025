
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, TrendingUp, Target, Lightbulb, Coffee } from 'lucide-react';

interface StudyDashboardProps {
  currentEmotion: string;
  sessionTime: number;
  isActive: boolean;
}

export const StudyDashboard: React.FC<StudyDashboardProps> = ({
  currentEmotion,
  sessionTime,
  isActive
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const getEmotionRecommendation = (emotion: string) => {
    const recommendations = {
      frustrated: {
        title: "Take a Breather",
        description: "It looks like you're feeling frustrated. Consider taking a short meditation break or switching to a different topic.",
        color: "bg-orange-100 border-orange-300",
        icon: Coffee
      },
      bored: {
        title: "Spice Things Up",
        description: "Feeling bored? Let's try an interactive quiz or switch to a more engaging study method!",
        color: "bg-yellow-100 border-yellow-300",
        icon: Lightbulb
      },
      happy: {
        title: "Great Energy!",
        description: "You're in a great mood! This is perfect for tackling challenging concepts or diving deep into new material.",
        color: "bg-green-100 border-green-300",
        icon: TrendingUp
      },
      focused: {
        title: "In the Zone",
        description: "Excellent focus! Keep going with your current study approach - you're doing great!",
        color: "bg-blue-100 border-blue-300",
        icon: Target
      },
      sad: {
        title: "Gentle Support",
        description: "Feeling down? That's okay. Let's start with something light and gradually build momentum.",
        color: "bg-blue-100 border-blue-300",
        icon: Coffee
      },
      neutral: {
        title: "Ready to Learn",
        description: "You seem calm and ready. This is a great state for absorbing new information methodically.",
        color: "bg-gray-100 border-gray-300",
        icon: BookOpen
      }
    };

    return recommendations[emotion as keyof typeof recommendations] || recommendations.neutral;
  };

  const recommendation = getEmotionRecommendation(currentEmotion);
  const RecommendationIcon = recommendation.icon;

  const studyProgress = Math.min((sessionTime / 1800) * 100, 100); // 30 minutes = 100%
  const focusScore = Math.max(0, 100 - Math.abs(sessionTime % 300 - 150) / 1.5); // Fluctuating focus

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Current Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {formatTime(sessionTime)}
              </div>
              <p className="text-sm text-gray-600">Time Elapsed</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {Math.round(focusScore)}%
              </div>
              <p className="text-sm text-gray-600">Focus Score</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1 capitalize">
                {currentEmotion}
              </div>
              <p className="text-sm text-gray-600">Current Mood</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Session Progress</span>
                <span>{Math.round(studyProgress)}%</span>
              </div>
              <Progress value={studyProgress} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Focus Level</span>
                <span>{Math.round(focusScore)}%</span>
              </div>
              <Progress value={focusScore} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emotion-Based Recommendation */}
      <Card className={`${recommendation.color} shadow-lg`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white rounded-full">
              <RecommendationIcon className="h-6 w-6 text-gray-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">
                {recommendation.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {recommendation.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Tips */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>Smart Study Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-blue-800">
                Take a 5-minute break every 25 minutes (Pomodoro Technique)
              </p>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-green-800">
                Switch between different types of content to maintain engagement
              </p>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm text-purple-800">
                Practice active recall by testing yourself regularly
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {!isActive && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Ready to Start Learning?</h3>
            <p className="text-blue-100 text-sm mb-4">
              Begin your study session to unlock personalized recommendations and emotion-adaptive features.
            </p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Click "Start Study Session" to begin
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
