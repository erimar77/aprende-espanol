import { NextRequest, NextResponse } from 'next/server';
import { nouns } from '@/data/nouns';
import { verbs } from '@/data/verbs';
import { adjectives } from '@/data/adjectives';
import { adverbs } from '@/data/adverbs';
import { execSync } from 'child_process';
import path from 'path';

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getWordPool(wordType: string) {
  switch (wordType) {
    case 'nouns': return nouns;
    case 'adjectives': return adjectives;
    case 'adverbs': return adverbs;
    case 'verbs': return []; // verbs handled separately
    case 'mixed':
    default:
      return shuffleArray([...nouns, ...adjectives, ...adverbs]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sections = ['vocab_matching', 'fill_blank', 'conjugation', 'translation'],
      wordType = 'mixed',
      difficulty = 'mixed',
      itemsPerSection = 10,
      seed = null,
    } = body;

    // Gather word data
    const wordPool = getWordPool(wordType);
    const selectedWords = shuffleArray(wordPool).slice(0, Math.max(40, itemsPerSection * 4));
    const selectedVerbs = shuffleArray([...verbs]).slice(0, 15);

    // Serialize words for Python (strip to essential fields)
    const wordsForPython = selectedWords.map(w => ({
      id: w.id,
      spanish: w.spanish,
      english: w.english,
      gender: w.gender || null,
      category: w.category,
      example: w.example || null,
      exampleTranslation: w.exampleTranslation || null,
    }));

    const verbsForPython = selectedVerbs.map(v => ({
      id: v.id,
      infinitive: v.infinitive,
      english: v.english,
      type: v.type,
      example: v.example || null,
      exampleTranslation: v.exampleTranslation || null,
      conjugation: {
        present: v.conjugation.present,
        preterite: v.conjugation.preterite,
      },
    }));

    const config = JSON.stringify({
      sections,
      wordType,
      difficulty,
      itemsPerSection,
      seed: seed || Math.floor(1000 + Math.random() * 9000),
      words: wordsForPython,
      verbs: verbsForPython,
    });

    // Call Python script
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate-worksheet.py');
    const pdfBuffer = execSync(`python3 "${scriptPath}"`, {
      input: config,
      maxBuffer: 10 * 1024 * 1024, // 10MB
      timeout: 30000,
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="spanish-worksheet-${Date.now()}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Worksheet generation error:', error.message);
    console.error('stderr:', error.stderr?.toString());
    return NextResponse.json(
      { error: 'Failed to generate worksheet', detail: error.message },
      { status: 500 }
    );
  }
}
