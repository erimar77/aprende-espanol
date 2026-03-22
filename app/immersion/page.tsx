'use client';

import { useState } from 'react';
import {
  Youtube,
  Podcast,
  Music,
  Newspaper,
  Smartphone,
  ExternalLink,
  Star,
  Filter,
} from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { mediaResources, getFeaturedMedia, MediaResource } from '@/data/spanish-media';

const typeConfig = {
  youtube: { icon: Youtube, label: 'YouTube', color: 'bg-red-500' },
  podcast: { icon: Podcast, label: 'Podcasts', color: 'bg-purple-500' },
  music: { icon: Music, label: 'Music', color: 'bg-green-500' },
  news: { icon: Newspaper, label: 'News', color: 'bg-blue-500' },
  app: { icon: Smartphone, label: 'Apps & Tools', color: 'bg-orange-500' },
};

const levelLabels = {
  beginner: 'Principiante',
  elementary: 'Elemental',
  intermediate: 'Intermedio',
  all: 'Todos los niveles',
};

const levelColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  elementary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  intermediate: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  all: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

function MediaCard({ resource, onResourceClick }: { resource: MediaResource; onResourceClick: () => void }) {
  const config = typeConfig[resource.type];
  const Icon = config.icon;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      onClick={onResourceClick}
    >
      <Card hover className="h-full">
        <CardContent>
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${config.color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              {resource.featured && (
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              )}
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
            </div>
          </div>

          <CardTitle className="group-hover:text-primary-500 transition-colors">
            {resource.title}
          </CardTitle>

          {resource.titleSpanish && resource.titleSpanish !== resource.title && (
            <p className="text-sm text-primary-500 font-medium">
              {resource.titleSpanish}
            </p>
          )}

          <CardDescription className="mt-2 line-clamp-2">
            {resource.description}
          </CardDescription>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${levelColors[resource.level]}`}>
              {levelLabels[resource.level]}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

export default function ImmersionPage() {
  const { earnXP } = useGamification();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredResources = mediaResources.filter(resource => {
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesLevel = selectedLevel === 'all' || resource.level === selectedLevel || resource.level === 'all';
    return matchesType && matchesLevel;
  });

  const featuredResources = getFeaturedMedia();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Inmersión / Immersion
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Curated Spanish media to immerse yourself in the language
        </p>
      </div>

      {/* Featured Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          Destacados / Featured
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredResources.slice(0, 6).map(resource => (
            <MediaCard key={resource.id} resource={resource} onResourceClick={() => earnXP('custom', 5, { type: 'immersion-resource' })} />
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Type Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Tipo / Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {Object.entries(typeConfig).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      selectedType === type
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nivel / Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="elementary">Elementary</option>
              <option value="intermediate">Intermediate</option>
            </select>
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {selectedType === 'all' ? 'Todos los Recursos' : typeConfig[selectedType as keyof typeof typeConfig]?.label}
          <span className="text-gray-400 font-normal ml-2">({filteredResources.length})</span>
        </h2>

        {filteredResources.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredResources.map(resource => (
              <MediaCard key={resource.id} resource={resource} onResourceClick={() => earnXP('custom', 5, { type: 'immersion-resource' })} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No resources match your filters. Try adjusting your selection.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Tips Section */}
      <section className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6 border border-primary-100 dark:border-primary-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          💡 Consejos de Inmersión / Immersion Tips
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold mb-1">Start with comprehensible input</h3>
            <p>Choose content slightly above your level. You should understand 70-80% to learn effectively.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Use dual subtitles</h3>
            <p>Language Reactor lets you see Spanish and English subtitles together on Netflix/YouTube.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Listen actively, then passively</h3>
            <p>First listen with full attention, then replay as background audio while doing other tasks.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Sing along to music</h3>
            <p>Music helps with pronunciation, rhythm, and memorization. Look up lyrics and sing!</p>
          </div>
        </div>
      </section>
    </div>
  );
}
