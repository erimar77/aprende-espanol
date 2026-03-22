'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { RotateCcw, Trophy, Check, Eye, EyeOff, Volume2 } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { speak } from '@/lib/speech';
import { useGamification } from '@/context/GamificationContext';

// Word categories for puzzles
interface WordCategory {
  id: string;
  name: string;
  nameSpanish: string;
  icon: string;
  words: { spanish: string; english: string }[];
}

const wordCategories: WordCategory[] = [
  {
    id: 'family',
    name: 'Family',
    nameSpanish: 'Familia',
    icon: '👨‍👩‍👧‍👦',
    words: [
      { spanish: 'MADRE', english: 'mother' },
      { spanish: 'PADRE', english: 'father' },
      { spanish: 'HIJO', english: 'son' },
      { spanish: 'HIJA', english: 'daughter' },
      { spanish: 'HERMANO', english: 'brother' },
      { spanish: 'HERMANA', english: 'sister' },
      { spanish: 'ABUELA', english: 'grandmother' },
      { spanish: 'ABUELO', english: 'grandfather' },
      { spanish: 'PRIMO', english: 'cousin' },
      { spanish: 'TIA', english: 'aunt' },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    nameSpanish: 'Comida',
    icon: '🍎',
    words: [
      { spanish: 'PAN', english: 'bread' },
      { spanish: 'LECHE', english: 'milk' },
      { spanish: 'POLLO', english: 'chicken' },
      { spanish: 'ARROZ', english: 'rice' },
      { spanish: 'QUESO', english: 'cheese' },
      { spanish: 'FRUTA', english: 'fruit' },
      { spanish: 'CARNE', english: 'meat' },
      { spanish: 'HUEVO', english: 'egg' },
      { spanish: 'SOPA', english: 'soup' },
      { spanish: 'AGUA', english: 'water' },
    ],
  },
  {
    id: 'animals',
    name: 'Animals',
    nameSpanish: 'Animales',
    icon: '🐾',
    words: [
      { spanish: 'PERRO', english: 'dog' },
      { spanish: 'GATO', english: 'cat' },
      { spanish: 'CABALLO', english: 'horse' },
      { spanish: 'PATO', english: 'duck' },
      { spanish: 'VACA', english: 'cow' },
      { spanish: 'CERDO', english: 'pig' },
      { spanish: 'MONO', english: 'monkey' },
      { spanish: 'RANA', english: 'frog' },
      { spanish: 'LOBO', english: 'wolf' },
      { spanish: 'OSO', english: 'bear' },
    ],
  },
  {
    id: 'colors',
    name: 'Colors',
    nameSpanish: 'Colores',
    icon: '🎨',
    words: [
      { spanish: 'ROJO', english: 'red' },
      { spanish: 'AZUL', english: 'blue' },
      { spanish: 'VERDE', english: 'green' },
      { spanish: 'BLANCO', english: 'white' },
      { spanish: 'NEGRO', english: 'black' },
      { spanish: 'ROSA', english: 'pink' },
      { spanish: 'GRIS', english: 'gray' },
      { spanish: 'MORADO', english: 'purple' },
      { spanish: 'NARANJA', english: 'orange' },
      { spanish: 'DORADO', english: 'golden' },
    ],
  },
  {
    id: 'body',
    name: 'Body',
    nameSpanish: 'Cuerpo',
    icon: '🦴',
    words: [
      { spanish: 'MANO', english: 'hand' },
      { spanish: 'PIE', english: 'foot' },
      { spanish: 'CABEZA', english: 'head' },
      { spanish: 'OJO', english: 'eye' },
      { spanish: 'NARIZ', english: 'nose' },
      { spanish: 'BOCA', english: 'mouth' },
      { spanish: 'BRAZO', english: 'arm' },
      { spanish: 'DEDO', english: 'finger' },
      { spanish: 'PELO', english: 'hair' },
      { spanish: 'OREJA', english: 'ear' },
    ],
  },
  {
    id: 'house',
    name: 'House',
    nameSpanish: 'Casa',
    icon: '🏠',
    words: [
      { spanish: 'COCINA', english: 'kitchen' },
      { spanish: 'SALA', english: 'living room' },
      { spanish: 'CAMA', english: 'bed' },
      { spanish: 'MESA', english: 'table' },
      { spanish: 'SILLA', english: 'chair' },
      { spanish: 'PUERTA', english: 'door' },
      { spanish: 'VENTANA', english: 'window' },
      { spanish: 'PISO', english: 'floor' },
      { spanish: 'TECHO', english: 'ceiling' },
      { spanish: 'PARED', english: 'wall' },
    ],
  },
];

const GRID_SIZE = 12;
const DIRECTIONS = [
  [0, 1],   // right
  [1, 0],   // down
  [1, 1],   // diagonal down-right
  [-1, 0],  // up
  [0, -1],  // left
  [-1, 1],  // diagonal up-right
  [1, -1],  // diagonal down-left
];

function generateGrid(words: { spanish: string; english: string }[]): {
  grid: string[][];
  placements: Map<string, { row: number; col: number; dr: number; dc: number }>;
} {
  const grid: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => '')
  );
  const placements = new Map<string, { row: number; col: number; dr: number; dc: number }>();

  // Sort words longest first for better placement
  const sorted = [...words].sort((a, b) => b.spanish.length - a.spanish.length);

  // Try to place up to 8 words
  const toPlace = sorted.slice(0, 8);

  for (const word of toPlace) {
    const placed = tryPlaceWord(grid, word.spanish);
    if (placed) {
      placements.set(word.spanish, placed);
    }
  }

  // Fill empty cells with random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return { grid, placements };
}

function tryPlaceWord(
  grid: string[][],
  word: string
): { row: number; col: number; dr: number; dc: number } | null {
  const shuffledDirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);

  for (let attempt = 0; attempt < 100; attempt++) {
    const dir = shuffledDirs[attempt % shuffledDirs.length];
    const [dr, dc] = dir;

    const maxRow = dr === 0 ? GRID_SIZE - 1 : dr > 0 ? GRID_SIZE - word.length : word.length - 1;
    const maxCol = dc === 0 ? GRID_SIZE - 1 : dc > 0 ? GRID_SIZE - word.length : word.length - 1;
    const minRow = dr === 0 ? 0 : dr > 0 ? 0 : word.length - 1;
    const minCol = dc === 0 ? 0 : dc > 0 ? 0 : word.length - 1;

    if (minRow > maxRow || minCol > maxCol) continue;

    const row = minRow + Math.floor(Math.random() * (maxRow - minRow + 1));
    const col = minCol + Math.floor(Math.random() * (maxCol - minCol + 1));

    let canPlace = true;
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) {
        canPlace = false;
        break;
      }
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
        canPlace = false;
        break;
      }
    }

    if (canPlace) {
      for (let i = 0; i < word.length; i++) {
        grid[row + dr * i][col + dc * i] = word[i];
      }
      return { row, col, dr, dc };
    }
  }

  return null;
}

type GameState = 'select' | 'playing' | 'complete';

export default function WordFindPage() {
  const { earnXP, recordSkill } = useGamification();
  const [gameState, setGameState] = useState<GameState>('select');
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | null>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  const [placements, setPlacements] = useState<Map<string, { row: number; col: number; dr: number; dc: number }>>(new Map());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [showHints, setShowHints] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectStart, setSelectStart] = useState<{ row: number; col: number } | null>(null);
  const [xpAwarded, setXpAwarded] = useState(false);

  const placedWords = useMemo(() => {
    if (!selectedCategory) return [];
    return selectedCategory.words.filter(w => placements.has(w.spanish));
  }, [selectedCategory, placements]);

  const startGame = (category: WordCategory) => {
    setSelectedCategory(category);
    const { grid: newGrid, placements: newPlacements } = generateGrid(category.words);
    setGrid(newGrid);
    setPlacements(newPlacements);
    setFoundWords(new Set());
    setSelectedCells(new Set());
    setHighlightedCells(new Set());
    setShowHints(false);
    setGameState('playing');
    setXpAwarded(false);
  };

  // Award XP when all words are found
  useEffect(() => {
    if (gameState === 'complete' && placedWords.length > 0 && foundWords.size === placedWords.length && !xpAwarded) {
      earnXP('exercise_complete', undefined, { type: 'wordfind' });
      recordSkill('vocabulary', true);
      setXpAwarded(true);
    }
  }, [gameState, foundWords.size, placedWords.length, xpAwarded, earnXP, recordSkill]);

  const getCellsForWord = (word: string): string[] => {
    const placement = placements.get(word);
    if (!placement) return [];
    const cells: string[] = [];
    for (let i = 0; i < word.length; i++) {
      cells.push(`${placement.row + placement.dr * i}-${placement.col + placement.dc * i}`);
    }
    return cells;
  };

  const handleCellClick = (row: number, col: number) => {
    if (!isSelecting) {
      // Start selection
      setIsSelecting(true);
      setSelectStart({ row, col });
      setSelectedCells(new Set([`${row}-${col}`]));
    } else if (selectStart) {
      // Complete selection - check if it forms a word
      setIsSelecting(false);

      // Get direction from start to current
      const dr = Math.sign(row - selectStart.row);
      const dc = Math.sign(col - selectStart.col);

      // Build the word from start to end
      const cells: string[] = [];
      let r = selectStart.row;
      let c = selectStart.col;
      let word = '';

      while (true) {
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) break;
        cells.push(`${r}-${c}`);
        word += grid[r][c];
        if (r === row && c === col) break;
        r += dr;
        c += dc;

        // Safety limit
        if (cells.length > GRID_SIZE) break;
      }

      // Check if word matches any placed word
      const matchedWord = placedWords.find(
        w => w.spanish === word || w.spanish === word.split('').reverse().join('')
      );

      if (matchedWord && !foundWords.has(matchedWord.spanish)) {
        const newFound = new Set(foundWords);
        newFound.add(matchedWord.spanish);
        setFoundWords(newFound);

        const wordCells = getCellsForWord(matchedWord.spanish);
        const newHighlighted = new Set(highlightedCells);
        wordCells.forEach(c => newHighlighted.add(c));
        setHighlightedCells(newHighlighted);

        // Check if all found
        if (newFound.size === placedWords.length) {
          setGameState('complete');
        }
      }

      setSelectedCells(new Set());
      setSelectStart(null);
    }
  };

  const handleCellHover = (row: number, col: number) => {
    if (!isSelecting || !selectStart) return;

    const dr = Math.sign(row - selectStart.row);
    const dc = Math.sign(col - selectStart.col);

    // Only allow straight lines
    if (dr !== 0 && dc !== 0 && Math.abs(row - selectStart.row) !== Math.abs(col - selectStart.col)) return;
    if (dr === 0 && dc === 0) {
      setSelectedCells(new Set([`${selectStart.row}-${selectStart.col}`]));
      return;
    }

    const cells = new Set<string>();
    let r = selectStart.row;
    let c = selectStart.col;
    while (true) {
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) break;
      cells.add(`${r}-${c}`);
      if (r === row && c === col) break;
      r += dr;
      c += dc;
      if (cells.size > GRID_SIZE) break;
    }
    setSelectedCells(cells);
  };

  const revealWord = (word: string) => {
    const cells = getCellsForWord(word);
    const newHighlighted = new Set(highlightedCells);
    cells.forEach(c => newHighlighted.add(c));
    setHighlightedCells(newHighlighted);

    const newFound = new Set(foundWords);
    newFound.add(word);
    setFoundWords(newFound);

    if (newFound.size === placedWords.length) {
      setGameState('complete');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sopa de Letras / Word Find
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Find hidden Spanish words in the letter grid
        </p>
      </div>

      {/* Category Selection */}
      {gameState === 'select' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wordCategories.map(cat => (
            <Card
              key={cat.id}
              hover
              className="cursor-pointer"
              onClick={() => startGame(cat)}
            >
              <CardContent className="text-center py-6">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <CardTitle>{cat.name}</CardTitle>
                <p className="text-sm text-primary-500 font-medium">{cat.nameSpanish}</p>
                <CardDescription className="mt-1">{cat.words.length} words</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Playing State */}
      {(gameState === 'playing' || gameState === 'complete') && selectedCategory && (
        <div className="space-y-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedCategory.icon}</span>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">{selectedCategory.nameSpanish}</h2>
                <p className="text-sm text-gray-500">{foundWords.size} / {placedWords.length} found</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowHints(!showHints)}>
                {showHints ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showHints ? 'Hide' : 'Hints'}
              </Button>
              <button
                onClick={() => setGameState('select')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${(foundWords.size / placedWords.length) * 100}%` }}
            />
          </div>

          {/* Complete Banner */}
          {gameState === 'complete' && (
            <Card>
              <CardContent className="text-center py-6">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <CardTitle className="text-xl">¡Encontraste todas las palabras! 🎉</CardTitle>
                <div className="flex justify-center gap-3 mt-4">
                  <Button onClick={() => startGame(selectedCategory)}>
                    <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                  </Button>
                  <Button variant="secondary" onClick={() => setGameState('select')}>
                    New Category
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Grid */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div
                    className="grid gap-0.5 sm:gap-1 select-none"
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                  >
                    {grid.map((row, r) =>
                      row.map((cell, c) => {
                        const key = `${r}-${c}`;
                        const isHighlighted = highlightedCells.has(key);
                        const isSelected = selectedCells.has(key);

                        return (
                          <button
                            key={key}
                            onClick={() => handleCellClick(r, c)}
                            onMouseEnter={() => handleCellHover(r, c)}
                            className={`aspect-square flex items-center justify-center text-xs sm:text-sm font-bold rounded transition-colors ${
                              isHighlighted
                                ? 'bg-green-500 text-white'
                                : isSelected
                                ? 'bg-primary-400 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            {cell}
                          </button>
                        );
                      })
                    )}
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-3">
                    Click a starting letter, then click the ending letter to select a word
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Word List */}
            <div>
              <Card>
                <CardContent>
                  <CardTitle className="text-lg mb-3">Words to Find</CardTitle>
                  <div className="space-y-2">
                    {placedWords.map(word => {
                      const isFound = foundWords.has(word.spanish);
                      return (
                        <div
                          key={word.spanish}
                          className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                            isFound
                              ? 'bg-green-50 dark:bg-green-900/20'
                              : 'bg-gray-50 dark:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isFound && <Check className="w-4 h-4 text-green-500" />}
                            <div>
                              <p className={`font-medium ${
                                isFound
                                  ? 'text-green-700 dark:text-green-400 line-through'
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {showHints || isFound ? word.spanish : '???'}
                              </p>
                              <p className="text-xs text-gray-500">{word.english}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => speak(word.spanish)}
                              className="p-1 text-gray-400 hover:text-primary-500 rounded"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            {!isFound && showHints && (
                              <button
                                onClick={() => revealWord(word.spanish)}
                                className="text-xs text-gray-400 hover:text-primary-500 px-1"
                                title="Reveal"
                              >
                                reveal
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
