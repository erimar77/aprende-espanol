'use client';

import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { speak, stopSpeaking, isSpeaking } from '@/lib/speech';
import { Teacher } from '@/lib/types';

interface TeacherBubbleProps {
  teacher: Teacher;
  message: string;
  messageTranslation?: string;
  showTranslation?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function TeacherBubble({
  teacher,
  message,
  messageTranslation,
  showTranslation = true,
  size = 'medium',
  className = '',
}: TeacherBubbleProps) {
  const [speaking, setSpeaking] = useState(false);
  const [showTrans, setShowTrans] = useState(false);

  const sizeClasses = {
    small: {
      avatar: 'w-16 h-16',
      bubble: 'max-w-sm text-sm',
      container: 'gap-3',
    },
    medium: {
      avatar: 'w-24 h-24',
      bubble: 'max-w-md text-base',
      container: 'gap-4',
    },
    large: {
      avatar: 'w-32 h-32',
      bubble: 'max-w-lg text-lg',
      container: 'gap-5',
    },
  };

  const sizes = sizeClasses[size];

  const handleSpeak = async () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      try {
        await speak(message);
      } catch (error) {
        console.error('Speech error:', error);
      }
      setSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return (
    <div className={`flex items-end ${sizes.container} ${className}`}>
      {/* Teacher Avatar */}
      <div className="flex-shrink-0">
        <div className={`relative ${sizes.avatar} rounded-full overflow-hidden border-4 border-secondary-400 shadow-lg`}>
          <Image
            src={teacher.imageUrl}
            alt={teacher.name}
            fill
            className="object-cover"
            sizes={size === 'large' ? '128px' : size === 'medium' ? '96px' : '64px'}
          />
        </div>
        <p className="text-center mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {teacher.name}
        </p>
      </div>

      {/* Speech Bubble */}
      <div className={`speech-bubble ${sizes.bubble} flex-1`}>
        <div className="flex justify-between items-start gap-2">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {message}
          </p>
          <button
            onClick={handleSpeak}
            className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={speaking ? 'Stop speaking' : 'Listen to pronunciation'}
          >
            {speaking ? (
              <VolumeX className="w-5 h-5 text-primary-500" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-500 hover:text-primary-500" />
            )}
          </button>
        </div>

        {showTranslation && messageTranslation && (
          <div className="mt-2">
            <button
              onClick={() => setShowTrans(!showTrans)}
              className="text-xs text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {showTrans ? 'Hide translation' : 'Show translation'}
            </button>
            {showTrans && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 italic">
                {messageTranslation}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
