'use client';

import { useState, useEffect } from 'react';
import {
  Image,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Volume2,
  Check,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  Mic
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { describeScenes, DescribeScene } from '@/data/describe-scenes';
import { speak } from '@/lib/speech';
import { useGamification } from '@/context/GamificationContext';

type Phase = 'describe' | 'feedback';

export default function DescribePage() {
  const { earnXP, recordSkill } = useGamification();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('describe');
  const [userDescription, setUserDescription] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [xpAwarded, setXpAwarded] = useState(false);

  const scene = describeScenes[currentIndex];

  // Reset state when scene changes
  useEffect(() => {
    setPhase('describe');
    setUserDescription('');
    setShowHints(false);
    setShowVocabulary(false);
    setCheckedItems(new Set());
    setXpAwarded(false);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < describeScenes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleShowFeedback = () => {
    setPhase('feedback');
    if (!xpAwarded) {
      const used = getUsedVocabulary();
      const targets = scene.vocabularyTargets.length;
      const hitVocabHalf = targets > 0 && used.size / targets >= 0.5;
      earnXP('exercise_complete', undefined, { type: 'describe' });
      recordSkill('vocabulary', hitVocabHalf);
      setXpAwarded(true);
    }
  };

  const handleTryAgain = () => {
    setPhase('describe');
    setUserDescription('');
    setCheckedItems(new Set());
  };

  const handleCheckItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const handleSpeakModel = async () => {
    await speak(scene.modelDescription, 0.85);
  };

  // Check which vocabulary words were used in the description
  const getUsedVocabulary = () => {
    if (!userDescription) return new Set<number>();
    const lowerDesc = userDescription.toLowerCase();
    const used = new Set<number>();
    scene.vocabularyTargets.forEach((vocab, index) => {
      if (lowerDesc.includes(vocab.spanish.toLowerCase().replace('el ', '').replace('la ', '').replace('los ', '').replace('las ', ''))) {
        used.add(index);
      }
    });
    return used;
  };

  const usedVocabulary = getUsedVocabulary();

  const getDifficultyColor = (difficulty: DescribeScene['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'color': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      case 'number': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'position': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'object': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'action': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'description': return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          ¿Qué Ves? - Describe the Image
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Practice describing what you see out loud in Spanish. Speak your description, then check how you did!
        </p>
      </div>


      {/* Progress & Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Imagen {currentIndex + 1} de {describeScenes.length}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(scene.difficulty)}`}>
            {scene.difficulty}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex === describeScenes.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              {scene.titleEs}
              <span className="text-sm font-normal text-gray-500">({scene.title})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Scene Image */}
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-4 overflow-hidden">
              <img
                src={scene.imageUrl}
                alt={scene.titleEs}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Speak Prompt */}
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 text-center">
              <Mic className="w-8 h-8 mx-auto mb-2 text-primary-500" />
              <p className="text-primary-800 dark:text-primary-300 font-medium">
                ¡Habla en voz alta!
              </p>
              <p className="text-primary-600 dark:text-primary-400 text-sm">
                Describe lo que ves en español
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Description & Feedback Section */}
        <div className="space-y-4">
          {/* Helpers - Sentence Starters & Vocabulary */}
          {phase === 'describe' && (
            <>
              {/* Sentence Starters */}
              {scene.sentenceStarters && (
                <Card>
                  <CardContent className="py-4">
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Frases para empezar (Sentence starters)
                        </span>
                      </div>
                      {showHints ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {showHints && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {scene.sentenceStarters.map((starter, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm border border-yellow-200 dark:border-yellow-800"
                          >
                            {starter}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Vocabulary Targets */}
              <Card>
                <CardContent className="py-4">
                  <button
                    onClick={() => setShowVocabulary(!showVocabulary)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Vocabulario sugerido ({scene.vocabularyTargets.length} palabras)
                      </span>
                    </div>
                    {showVocabulary ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {showVocabulary && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {scene.vocabularyTargets.map((vocab, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 rounded-lg text-sm ${getCategoryColor(vocab.category)}`}
                          title={vocab.english}
                        >
                          {vocab.spanish}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Optional Text Area */}
              <Card>
                <CardContent className="py-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Opcional: Escribe tu descripción (Optional: Write your description)
                  </label>
                  <textarea
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Veo... Hay... El/La... está..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Writing is optional, but helps track which vocabulary you used!
                  </p>
                </CardContent>
              </Card>

              {/* Show Feedback Button */}
              <Button
                onClick={handleShowFeedback}
                className="w-full"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Ver Retroalimentación (See Feedback)
              </Button>
            </>
          )}

          {/* Feedback Phase */}
          {phase === 'feedback' && (
            <>
              {/* Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ✓ Lista de verificación (Checklist)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    ¿Mencionaste estos elementos? (Did you mention these elements?)
                  </p>
                  <div className="space-y-2">
                    {scene.checklist.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleCheckItem(i)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                          checkedItems.has(i)
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          checkedItems.has(i)
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {checkedItems.has(i) && <Check className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{item.spanish}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.english}</p>
                          {item.hint && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-0.5">{item.hint}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-center text-gray-700 dark:text-gray-300">
                      Marcaste <span className="font-bold text-primary-600">{checkedItems.size}</span> de {scene.checklist.length} elementos
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Vocabulary Used */}
              {userDescription && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      📝 Vocabulario usado (Vocabulary Used)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {scene.vocabularyTargets.map((vocab, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 rounded-lg text-sm ${
                            usedVocabulary.has(i)
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 ring-2 ring-green-500'
                              : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500'
                          }`}
                        >
                          {vocab.spanish}
                          {usedVocabulary.has(i) && <Check className="w-3 h-3 inline ml-1" />}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Usaste <span className="font-bold text-green-600">{usedVocabulary.size}</span> de {scene.vocabularyTargets.length} palabras sugeridas
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Model Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>📖 Descripción modelo (Model Description)</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSpeakModel}
                      title="Escuchar"
                    >
                      <Volume2 className="w-5 h-5" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-4">
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                      {scene.modelDescription}
                    </p>
                  </div>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      Ver traducción (See translation)
                    </summary>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 italic pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      {scene.modelTranslation}
                    </p>
                  </details>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleTryAgain}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Intentar de nuevo
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentIndex === describeScenes.length - 1}
                  className="flex-1"
                >
                  Siguiente imagen
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scene Selection */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Todas las imágenes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {describeScenes.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(i)}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  i === currentIndex
                    ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-xs text-gray-500">{i + 1}</span>
                <p className="text-sm font-medium truncate">{s.titleEs}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded ${getDifficultyColor(s.difficulty)}`}>
                  {s.difficulty}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
