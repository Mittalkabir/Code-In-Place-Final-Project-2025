
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Star, Target, TrendingUp, Award, Lightbulb, Sparkles, ArrowRight } from 'lucide-react';

interface MotivationalPromptsProps {
  emotion: string;
  sessionTime: number;
}

export const MotivationalPrompts: React.FC<MotivationalPromptsProps> = ({ 
  emotion, 
  sessionTime 
}) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [showMotivation, setShowMotivation] = useState(true);

  const getEmotionPrompts = (emotion: string) => {
    const prompts = {
      frustrated: [
        {
          title: "Every Expert Was Once a Beginner",
          message: "Frustration is a sign you're pushing your boundaries. That's exactly where growth happens. Take a breath and remember - every challenge you overcome makes you stronger.",
          action: "Break this problem into smaller, manageable steps",
          icon: Star,
          color: "from-orange-400 to-red-400"
        },
        {
          title: "Progress Over Perfection",
          message: "You don't have to understand everything perfectly right now. Focus on making progress, not achieving perfection. Each small step forward matters.",
          action: "Write down one thing you've learned today",
          icon: TrendingUp,
          color: "from-orange-400 to-yellow-400"
        }
      ],
      bored: [
        {
          title: "Curiosity Ignites Learning",
          message: "Boredom is your brain asking for a challenge! What if you could teach this concept to someone else? What questions would they ask?",
          action: "Find one surprising fact about this topic",
          icon: Lightbulb,
          color: "from-yellow-400 to-orange-400"
        },
        {
          title: "Connect the Dots",
          message: "Make this material relevant to your life. How does this knowledge connect to your goals, interests, or future plans?",
          action: "Think of a real-world application for what you're learning",
          icon: Target,
          color: "from-purple-400 to-pink-400"
        }
      ],
      happy: [
        {
          title: "Ride the Wave of Positivity",
          message: "Your positive energy is perfect for tackling challenging concepts! This is when your brain is most receptive to new information.",
          action: "Challenge yourself with the hardest topic on your list",
          icon: Zap,
          color: "from-green-400 to-blue-400"
        },
        {
          title: "Share Your Energy",
          message: "Your enthusiasm is contagious! Consider how you could help others learn this material too. Teaching reinforces your own understanding.",
          action: "Explain this concept in your own words",
          icon: Sparkles,
          color: "from-pink-400 to-purple-400"
        }
      ],
      focused: [
        {
          title: "You're in the Zone",
          message: "This level of focus is precious! You're experiencing what psychologists call 'flow state' - where learning becomes effortless and deep.",
          action: "Dive deeper into the most complex aspect of your topic",
          icon: Target,
          color: "from-blue-400 to-purple-400"
        },
        {
          title: "Maximize This Moment",
          message: "Your concentration is peak right now. This is the perfect time for active recall and connecting new concepts to existing knowledge.",
          action: "Test yourself without looking at your notes",
          icon: Award,
          color: "from-indigo-400 to-blue-400"
        }
      ],
      sad: [
        {
          title: "Learning Heals",
          message: "Sometimes the best way to lift our spirits is through accomplishment. Each new thing you learn is a gift you give to your future self.",
          action: "Start with something small and build momentum",
          icon: Star,
          color: "from-blue-400 to-indigo-400"
        },
        {
          title: "You're Stronger Than You Know",
          message: "The fact that you're here, continuing to learn despite feeling down, shows incredible resilience. That's a superpower.",
          action: "Acknowledge one thing you've accomplished recently",
          icon: TrendingUp,
          color: "from-purple-400 to-blue-400"
        }
      ],
      neutral: [
        {
          title: "Steady Wins the Race",
          message: "Your calm, steady approach to learning is incredibly powerful. Consistent progress beats sporadic bursts of effort every time.",
          action: "Set a small, achievable goal for the next 15 minutes",
          icon: Target,
          color: "from-gray-400 to-blue-400"
        },
        {
          title: "The Power of Consistent Effort",
          message: "Being in a neutral state means you can approach learning objectively. This is perfect for building solid foundations.",
          action: "Focus on understanding rather than memorizing",
          icon: TrendingUp,
          color: "from-blue-400 to-green-400"
        }
      ]
    };

    return prompts[emotion as keyof typeof prompts] || prompts.neutral;
  };

  const getAchievements = (sessionTime: number) => {
    const achievements = [];
    
    if (sessionTime >= 300) achievements.push({ title: "5 Minute Milestone", icon: "🎯" });
    if (sessionTime >= 900) achievements.push({ title: "Quarter Hour Hero", icon: "⭐" });
    if (sessionTime >= 1800) achievements.push({ title: "30 Minute Champion", icon: "🏆" });
    if (sessionTime >= 3600) achievements.push({ title: "Hour of Power", icon: "🚀" });
    
    return achievements;
  };

  const prompts = getEmotionPrompts(emotion);
  const achievements = getAchievements(sessionTime);
  const prompt = prompts[currentPrompt];
  const PromptIcon = prompt.icon;

  const nextPrompt = () => {
    setCurrentPrompt((prev) => (prev + 1) % prompts.length);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Main Motivational Card */}
      <Card className={`bg-gradient-to-r ${prompt.color} text-white shadow-lg`}>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-white/20 rounded-full">
                <PromptIcon className="h-8 w-8" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-3">{prompt.title}</h2>
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                {prompt.message}
              </p>
            </div>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Action Step:</p>
                    <p className="text-sm text-white/80">{prompt.action}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button 
                onClick={nextPrompt}
                variant="secondary"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                Next Inspiration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Stats */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Your Progress Today</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {formatTime(sessionTime)}
              </div>
              <p className="text-sm text-blue-700">Study Time</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {Math.floor(sessionTime / 300)}
              </div>
              <p className="text-sm text-green-700">Focus Blocks</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-1 capitalize">
                {emotion}
              </div>
              <p className="text-sm text-purple-700">Current Mood</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Award className="h-8 w-8 mx-auto" />
              <h3 className="text-xl font-bold">Achievements Unlocked!</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {achievements.map((achievement, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30 px-3 py-1"
                  >
                    {achievement.icon} {achievement.title}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Tips */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>Learning Boost Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-yellow-800">Use the Feynman Technique</p>
                <p className="text-sm text-yellow-700">Explain concepts in simple terms as if teaching a child</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-800">Create Mental Connections</p>
                <p className="text-sm text-blue-700">Link new information to what you already know</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-800">Practice Active Recall</p>
                <p className="text-sm text-green-700">Test yourself regularly without looking at notes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
