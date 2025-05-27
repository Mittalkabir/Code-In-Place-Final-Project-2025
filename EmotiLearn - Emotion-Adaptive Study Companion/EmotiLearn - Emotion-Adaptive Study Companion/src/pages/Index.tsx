
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EmotionDetector } from '@/components/EmotionDetector';
import { StudyDashboard } from '@/components/StudyDashboard';
import { QuizComponent } from '@/components/QuizComponent';
import { MeditationBreak } from '@/components/MeditationBreak';
import { MotivationalPrompts } from '@/components/MotivationalPrompts';
import { Camera, Brain, Heart, Target, Zap } from 'lucide-react';

const Index = () => {
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [studyMode, setStudyMode] = useState<'dashboard' | 'quiz' | 'meditation' | 'focus'>('dashboard');
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [emotionHistory, setEmotionHistory] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  const handleEmotionDetected = (emotion: string) => {
    setCurrentEmotion(emotion);
    setEmotionHistory(prev => [...prev.slice(-19), emotion]);
    
    // Adaptive responses based on emotion
    if (emotion === 'frustrated' || emotion === 'sad') {
      setTimeout(() => setStudyMode('meditation'), 2000);
    } else if (emotion === 'bored' || emotion === 'neutral') {
      setTimeout(() => setStudyMode('quiz'), 1500);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      happy: 'bg-green-500',
      sad: 'bg-blue-500',
      angry: 'bg-red-500',
      frustrated: 'bg-orange-500',
      surprised: 'bg-yellow-500',
      neutral: 'bg-gray-500',
      focused: 'bg-purple-500',
      bored: 'bg-indigo-500',
    };
    return colors[emotion as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EmotiLearn
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className={`${getEmotionColor(currentEmotion)} text-white border-none`}>
                {currentEmotion}
              </Badge>
              <div className="text-sm text-gray-600">
                Session: {formatTime(sessionTime)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Emotion Detection & Controls */}
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  <span>Emotion Monitor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmotionDetector 
                  onEmotionDetected={handleEmotionDetected}
                  isActive={sessionActive}
                />
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span>Session Control</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => setSessionActive(!sessionActive)}
                  className={`w-full ${sessionActive 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {sessionActive ? 'End Session' : 'Start Study Session'}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setStudyMode('dashboard')}
                    className={studyMode === 'dashboard' ? 'bg-blue-50' : ''}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setStudyMode('quiz')}
                    className={studyMode === 'quiz' ? 'bg-green-50' : ''}
                  >
                    Quiz
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setStudyMode('meditation')}
                    className={studyMode === 'meditation' ? 'bg-purple-50' : ''}
                  >
                    Meditate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setStudyMode('focus')}
                    className={studyMode === 'focus' ? 'bg-indigo-50' : ''}
                  >
                    Focus
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emotion History */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Emotion Journey</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-10 gap-1">
                  {emotionHistory.slice(-20).map((emotion, index) => (
                    <div
                      key={index}
                      className={`h-3 rounded-sm ${getEmotionColor(emotion)} opacity-${Math.min(100, 50 + index * 2.5)}`}
                      title={emotion}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Last 20 emotional states</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {studyMode === 'dashboard' && (
              <StudyDashboard 
                currentEmotion={currentEmotion}
                sessionTime={sessionTime}
                isActive={sessionActive}
              />
            )}
            
            {studyMode === 'quiz' && (
              <QuizComponent 
                emotion={currentEmotion}
                onModeChange={setStudyMode}
              />
            )}
            
            {studyMode === 'meditation' && (
              <MeditationBreak 
                emotion={currentEmotion}
                onComplete={() => setStudyMode('dashboard')}
              />
            )}
            
            {studyMode === 'focus' && (
              <MotivationalPrompts 
                emotion={currentEmotion}
                sessionTime={sessionTime}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
