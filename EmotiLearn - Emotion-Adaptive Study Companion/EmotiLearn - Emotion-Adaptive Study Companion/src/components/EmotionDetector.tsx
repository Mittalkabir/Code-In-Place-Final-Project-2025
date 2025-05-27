
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: string) => void;
  isActive: boolean;
}

export const EmotionDetector: React.FC<EmotionDetectorProps> = ({ 
  onEmotionDetected, 
  isActive 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [confidence, setConfidence] = useState<number>(0);

  // Simulated emotion detection (in a real app, this would use Hugging Face models)
  const detectEmotion = () => {
    const emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'focused', 'frustrated', 'bored'];
    const weights = [0.2, 0.1, 0.05, 0.1, 0.3, 0.15, 0.05, 0.05]; // Bias toward neutral and focused
    
    let random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < emotions.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        const emotion = emotions[i];
        const conf = Math.random() * 0.4 + 0.6; // 60-100% confidence
        setCurrentEmotion(emotion);
        setConfidence(conf);
        onEmotionDetected(emotion);
        return;
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
        setError('');
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && isCameraOn) {
      // Detect emotion every 3 seconds
      interval = setInterval(detectEmotion, 3000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isCameraOn]);

  useEffect(() => {
    if (isActive && !isCameraOn) {
      startCamera();
    } else if (!isActive && isCameraOn) {
      stopCamera();
    }
  }, [isActive]);

  const getEmotionEmoji = (emotion: string) => {
    const emojis: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      surprised: '😲',
      neutral: '😐',
      focused: '🧠',
      frustrated: '😤',
      bored: '😴'
    };
    return emojis[emotion] || '😐';
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-center p-4">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Emotion Overlay */}
        {isCameraOn && (
          <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getEmotionEmoji(currentEmotion)}</span>
              <span className="capitalize">{currentEmotion}</span>
              <span className="text-xs opacity-75">
                {Math.round(confidence * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={isCameraOn ? stopCamera : startCamera}
          className="flex items-center space-x-2"
        >
          {isCameraOn ? (
            <>
              <CameraOff className="h-4 w-4" />
              <span>Stop Camera</span>
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              <span>Start Camera</span>
            </>
          )}
        </Button>
        
        <div className="text-xs text-gray-500">
          {isCameraOn ? 'Monitoring emotions...' : 'Camera offline'}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" width="320" height="240" />
    </div>
  );
};
