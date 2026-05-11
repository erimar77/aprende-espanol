import { NextRequest, NextResponse } from 'next/server';
import { nouns } from '@/data/nouns';
import { verbs } from '@/data/verbs';
import { adjectives } from '@/data/adjectives';
import { adverbs } from '@/data/adverbs';
import { spawn } from 'child_process';
import path from 'path';
import { cookies } from 'next/headers';
import { getSessionByToken } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

// PDF generation is heavy: 5 requests/min per IP.
const worksheetLimiter = rateLimit({ interval: 60_000, limit: 5 });

const PYTHON_TIMEOUT_MS = 30_000;
const PYTHON_MAX_OUTPUT_BYTES = 10 * 1024 * 1024;

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

/**
 * Run the Python worksheet generator as a child process. Uses spawn (not
 * execSync) so we don't block the Node event loop while Python runs —
 * concurrent requests can be served instead of being serialized behind a
 * 30-second blocking call.
 */
function runPython(scriptPath: string, input: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const child = spawn('python3', [scriptPath]);
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let stdoutBytes = 0;
    let settled = false;

    const finish = (err: Error | null, value?: Buffer) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (err) reject(err); else resolve(value!);
    };

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish(new Error('Python script timed out'));
    }, PYTHON_TIMEOUT_MS);

    child.stdout.on('data', (chunk: Buffer) => {
      stdoutBytes += chunk.length;
      if (stdoutBytes > PYTHON_MAX_OUTPUT_BYTES) {
        child.kill('SIGKILL');
        finish(new Error('Worksheet output exceeded max size'));
        return;
      }
      stdoutChunks.push(chunk);
    });

    child.stderr.on('data', (chunk: Buffer) => stderrChunks.push(chunk));
    child.on('error', err => finish(err));
    child.on('close', code => {
      if (code !== 0) {
        const err = new Error(`python3 exited with code ${code}`) as Error & { stderr: string };
        err.stderr = Buffer.concat(stderrChunks).toString();
        finish(err);
        return;
      }
      finish(null, Buffer.concat(stdoutChunks));
    });

    child.stdin.write(input);
    child.stdin.end();
  });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const limit = worksheetLimiter(ip);
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded: 5 worksheets per minute' },
      { status: 429 }
    );
  }

  // Authentication check - verify user has a valid session.
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('spanish_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const session = await getSessionByToken(sessionToken);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

    const scriptPath = path.join(process.cwd(), 'scripts', 'generate-worksheet.py');
    const pdfBuffer = await runPython(scriptPath, config);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="spanish-worksheet-${Date.now()}.pdf"`,
      },
    });
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';
    let stderr = '';

    if (error instanceof Error) {
      errorMessage = error.message;
      if ('stderr' in error && typeof (error as { stderr?: unknown }).stderr === 'string') {
        stderr = (error as { stderr: string }).stderr;
      }
    }

    console.error('Worksheet generation error:', errorMessage);
    if (stderr) console.error('stderr:', stderr);
    return NextResponse.json(
      { error: 'Failed to generate worksheet' },
      { status: 500 }
    );
  }
}
