
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Pause, Play, RotateCcw, Heart, Waves, CheckCircle } from 'lucide-react';

interface MeditationBreakProps {
  emotion: string;
  onComplete: () => void;
}

export const MeditationBreak: React.FC<MeditationBreakProps> = ({ emotion, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const durations = [
    { label: '2 min', value: 120, description: 'Quick reset' },
    { label: '5 min', value: 300, description: 'Standard break' },
    { label: '10 min', value: 600, description: 'Deep relaxation' }
  ];

  const getEmotionSpecificGuidance = (emotion: string) => {
    const guidance = {
      frustrated: {
        title: "Calming Breath",
        instruction: "Let's release that tension with gentle breathing",
        breathPattern: { inhale: 4, hold: 4, exhale: 6 },
        color: "from-orange-400 to-red-400"
      },
      sad: {
        title: "Gentle Comfort",
        instruction: "Be kind to yourself with this soothing practice",
        breathPattern: { inhale: 4, hold: 2, exhale: 4 },
        color: "from-blue-400 to-indigo-400"
      },
      bored: {
        title: "Energizing Focus",
        instruction: "Recharge your mind with focused breathing",
        breathPattern: { inhale: 3, hold: 3, exhale: 3 },
        color: "from-yellow-400 to-orange-400"
      },
      happy: {
        title: "Joyful Mindfulness",
        instruction: "Maintain this positive energy with mindful breathing",
        breathPattern: { inhale: 4, hold: 4, exhale: 4 },
        color: "from-green-400 to-blue-400"
      },
      neutral: {
        title: "Centering Practice",
        instruction: "Find your center with balanced breathing",
        breathPattern: { inhale: 4, hold: 4, exhale: 4 },
        color: "from-purple-400 to-pink-400"
      }
    };

    return guidance[emotion as keyof typeof guidance] || guidance.neutral;
  };

  const guidance = getEmotionSpecificGuidance(emotion);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsCompleted(true);
      setIsActive(false);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    let breathInterval: NodeJS.Timeout;
    
    if (isActive) {
      const { inhale, hold, exhale } = guidance.breathPattern;
      const totalCycle = inhale + hold + exhale;
      
      breathInterval = setInterval(() => {
        setBreathingTimer(prev => {
          const newTimer = (prev + 1) % totalCycle;
          
          if (newTimer < inhale) {
            setBreathingPhase('inhale');
          } else if (newTimer < inhale + hold) {
            setBreathingPhase('hold');
          } else {
            setBreathingPhase('exhale');
          }
          
          return newTimer;
        });
      }, 1000);
    }
    
    return () => clearInterval(breathInterval);
  }, [isActive, guidance.breathPattern]);

  const startMeditation = () => {
    setIsActive(true);
    setTimeLeft(selectedDuration);
    setIsCompleted(false);
  };

  const pauseMeditation = () => {
    setIsActive(!isActive);
  };

  const resetMeditation = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
    setBreathingTimer(0);
    setBreathingPhase('inhale');
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedDuration - timeLeft) / selectedDuration) * 100;

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold gently...';
      case 'exhale':
        return 'Breathe out slowly...';
    }
  };

  if (isCompleted) {
    return (
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Meditation Complete!</h2>
          <p className="text-green-100 mb-6">
            You've successfully completed your mindfulness break. Take a moment to notice how you feel.
          </p>
          <div className="space-y-4">
            <Button 
              onClick={onComplete}
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Return to Studies
            </Button>
            <Button 
              onClick={resetMeditation}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Meditate Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={`bg-gradient-to-r ${guidance.color} text-white shadow-lg`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="h-6 w-6" />
            <h2 className="text-xl font-bold">{guidance.title}</h2>
          </div>
          <p className="text-white/90 mb-4">{guidance.instruction}</p>
          
          {isActive && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Session Progress</span>
                <span>{formatTime(timeLeft)} remaining</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/20" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Duration Selection */}
      {!isActive && (
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle>Choose Your Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {durations.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => setSelectedDuration(duration.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedDuration === duration.value
                      ? 'border-purple-500 bg-purple-50 text-purple-800'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl font-bold mb-1">{duration.label}</div>
                    <div className="text-sm text-gray-600">{duration.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Breathing Guide */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Breathing Circle */}
            <div className="relative mx-auto w-48 h-48 flex items-center justify-center">
              <div 
                className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                  breathingPhase === 'inhale' ? 'scale-100 border-blue-400' :
                  breathingPhase === 'hold' ? 'scale-100 border-purple-400' :
                  'scale-75 border-green-400'
                } ${isActive ? 'opacity-100' : 'opacity-30'}`}
              />
              <div 
                className={`w-32 h-32 rounded-full bg-gradient-to-r ${guidance.color} transition-all duration-1000 flex items-center justify-center ${
                  breathingPhase === 'inhale' ? 'scale-110' :
                  breathingPhase === 'hold' ? 'scale-110' :
                  'scale-90'
                } ${isActive ? 'opacity-100' : 'opacity-50'}`}
              >
                <Waves className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Breathing Instruction */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {isActive ? getBreathingInstruction() : 'Ready to begin?'}
              </h3>
              <p className="text-sm text-gray-600">
                {isActive 
                  ? `${guidance.breathPattern.inhale}s in • ${guidance.breathPattern.hold}s hold • ${guidance.breathPattern.exhale}s out`
                  : 'Follow the breathing pattern when you start'
                }
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isActive && timeLeft === selectedDuration ? (
                <Button 
                  onClick={startMeditation}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Meditation
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={pauseMeditation}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    <span>{isActive ? 'Pause' : 'Resume'}</span>
                  </Button>
                  
                  <Button 
                    onClick={resetMeditation}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mindfulness Tips */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Mindfulness Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-center">
            <p className="text-sm text-gray-700">
              💫 Focus on your breath, let thoughts come and go naturally
            </p>
            <p className="text-sm text-gray-700">
              🌿 If your mind wanders, gently bring attention back to breathing
            </p>
            <p className="text-sm text-gray-700">
              ✨ There's no perfect way to meditate - just be present
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
