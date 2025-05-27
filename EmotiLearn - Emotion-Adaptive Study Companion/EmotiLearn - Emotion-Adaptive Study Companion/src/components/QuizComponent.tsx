
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Brain, Trophy, ArrowRight } from 'lucide-react';

interface QuizComponentProps {
  emotion: string;
  onModeChange: (mode: 'dashboard' | 'quiz' | 'meditation' | 'focus') => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ emotion, onModeChange }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number[]>([]);

  // Emotion-adaptive question bank
  const getQuestions = (emotion: string): Question[] => {
    const baseQuestions: Question[] = [
      {
        id: 1,
        question: "What is the primary purpose of the mitochondria in a cell?",
        options: ["Protein synthesis", "Energy production", "Waste removal", "DNA storage"],
        correct: 1,
        explanation: "Mitochondria are known as the powerhouses of the cell, converting glucose into ATP energy.",
        difficulty: 'easy'
      },
      {
        id: 2,
        question: "Which programming concept allows a function to call itself?",
        options: ["Iteration", "Recursion", "Inheritance", "Polymorphism"],
        correct: 1,
        explanation: "Recursion is when a function calls itself, typically with modified parameters to eventually reach a base case.",
        difficulty: 'medium'
      },
      {
        id: 3,
        question: "What is the derivative of x² + 3x + 2?",
        options: ["2x + 3", "x² + 3", "2x + 2", "3x + 2"],
        correct: 0,
        explanation: "Using the power rule: d/dx(x²) = 2x, d/dx(3x) = 3, d/dx(2) = 0, so the result is 2x + 3.",
        difficulty: 'medium'
      },
      {
        id: 4,
        question: "Which planet is closest to the Sun?",
        options: ["Venus", "Earth", "Mercury", "Mars"],
        correct: 2,
        explanation: "Mercury is the innermost planet in our solar system, orbiting closest to the Sun.",
        difficulty: 'easy'
      },
      {
        id: 5,
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: 1,
        explanation: "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
        difficulty: 'hard'
      }
    ];

    // Adapt difficulty based on emotion
    if (emotion === 'frustrated' || emotion === 'sad') {
      return baseQuestions.filter(q => q.difficulty === 'easy');
    } else if (emotion === 'bored') {
      return baseQuestions.filter(q => q.difficulty === 'hard');
    } else if (emotion === 'happy' || emotion === 'focused') {
      return baseQuestions; // All difficulties
    }
    
    return baseQuestions.filter(q => q.difficulty !== 'hard'); // Medium and easy
  };

  const [questions] = useState(() => getQuestions(emotion));
  
  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const newAnswered = [...answered, selectedAnswer];
    setAnswered(newAnswered);
    
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      setTimeout(() => onModeChange('dashboard'), 2000);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === questions[currentQuestion].correct;
  const isQuizComplete = currentQuestion === questions.length - 1 && showResult;

  const getEmotionMessage = () => {
    if (emotion === 'frustrated') {
      return "🌱 Take your time - every small step forward is progress!";
    } else if (emotion === 'bored') {
      return "🚀 Let's challenge your mind with some exciting problems!";
    } else if (emotion === 'happy') {
      return "✨ Your positive energy is perfect for learning new things!";
    } else if (emotion === 'focused') {
      return "🎯 Great focus! You're in the perfect state for deep learning.";
    }
    return "💪 You've got this! Let's learn something new together.";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-6 w-6" />
              <h2 className="text-xl font-bold">Interactive Quiz</h2>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          
          <p className="text-green-100 text-sm mb-4">{getEmotionMessage()}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Question {currentQuestion + 1}</span>
            <Badge variant="outline" className={
              questions[currentQuestion].difficulty === 'easy' ? 'border-green-500 text-green-700' :
              questions[currentQuestion].difficulty === 'medium' ? 'border-yellow-500 text-yellow-700' :
              'border-red-500 text-red-700'
            }>
              {questions[currentQuestion].difficulty}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-lg font-medium text-gray-800 leading-relaxed">
              {questions[currentQuestion].question}
            </p>

            <div className="grid gap-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? showResult
                        ? index === questions[currentQuestion].correct
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-red-500 bg-red-50 text-red-800'
                        : 'border-blue-500 bg-blue-50 text-blue-800'
                      : showResult && index === questions[currentQuestion].correct
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <>
                        {index === questions[currentQuestion].correct && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {selectedAnswer === index && index !== questions[currentQuestion].correct && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showResult && (
              <Card className={`${isCorrect ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`font-medium ${isCorrect ? 'text-green-800' : 'text-blue-800'} mb-1`}>
                        {isCorrect ? 'Correct!' : 'Good try!'}
                      </h4>
                      <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-blue-700'}`}>
                        {questions[currentQuestion].explanation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={() => onModeChange('dashboard')}
              >
                Back to Dashboard
              </Button>

              {!showResult ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isQuizComplete ? (
                    <>
                      <Trophy className="h-4 w-4 mr-2" />
                      Complete Quiz
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Display */}
      {isQuizComplete && (
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
            <p className="text-purple-100 mb-4">
              You scored {score} out of {questions.length} questions correctly.
            </p>
            <div className="text-4xl font-bold">
              {Math.round((score / questions.length) * 100)}%
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
