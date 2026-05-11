// Number drills data for Spanish learning

export interface NumberWord {
  value: number;
  spanish: string;
  type: 'cardinal' | 'ordinal';
}

export interface TimeExpression {
  hour: number;
  minute: number;
  spanish: string;
  english: string;
}

export interface DateWord {
  id: string;
  spanish: string;
  english: string;
  type: 'day' | 'month' | 'season';
}

export interface MathProblem {
  id: string;
  num1: number;
  num2: number;
  operation: '+' | '-' | 'x';
  answer: number;
  questionSpanish: string;
}

// Cardinal numbers 0-100
export const cardinalNumbers: NumberWord[] = [
  { value: 0, spanish: 'cero', type: 'cardinal' },
  { value: 1, spanish: 'uno', type: 'cardinal' },
  { value: 2, spanish: 'dos', type: 'cardinal' },
  { value: 3, spanish: 'tres', type: 'cardinal' },
  { value: 4, spanish: 'cuatro', type: 'cardinal' },
  { value: 5, spanish: 'cinco', type: 'cardinal' },
  { value: 6, spanish: 'seis', type: 'cardinal' },
  { value: 7, spanish: 'siete', type: 'cardinal' },
  { value: 8, spanish: 'ocho', type: 'cardinal' },
  { value: 9, spanish: 'nueve', type: 'cardinal' },
  { value: 10, spanish: 'diez', type: 'cardinal' },
  { value: 11, spanish: 'once', type: 'cardinal' },
  { value: 12, spanish: 'doce', type: 'cardinal' },
  { value: 13, spanish: 'trece', type: 'cardinal' },
  { value: 14, spanish: 'catorce', type: 'cardinal' },
  { value: 15, spanish: 'quince', type: 'cardinal' },
  { value: 16, spanish: 'dieciséis', type: 'cardinal' },
  { value: 17, spanish: 'diecisiete', type: 'cardinal' },
  { value: 18, spanish: 'dieciocho', type: 'cardinal' },
  { value: 19, spanish: 'diecinueve', type: 'cardinal' },
  { value: 20, spanish: 'veinte', type: 'cardinal' },
  { value: 21, spanish: 'veintiuno', type: 'cardinal' },
  { value: 22, spanish: 'veintidós', type: 'cardinal' },
  { value: 23, spanish: 'veintitrés', type: 'cardinal' },
  { value: 24, spanish: 'veinticuatro', type: 'cardinal' },
  { value: 25, spanish: 'veinticinco', type: 'cardinal' },
  { value: 26, spanish: 'veintiséis', type: 'cardinal' },
  { value: 27, spanish: 'veintisiete', type: 'cardinal' },
  { value: 28, spanish: 'veintiocho', type: 'cardinal' },
  { value: 29, spanish: 'veintinueve', type: 'cardinal' },
  { value: 30, spanish: 'treinta', type: 'cardinal' },
  { value: 31, spanish: 'treinta y uno', type: 'cardinal' },
  { value: 32, spanish: 'treinta y dos', type: 'cardinal' },
  { value: 40, spanish: 'cuarenta', type: 'cardinal' },
  { value: 50, spanish: 'cincuenta', type: 'cardinal' },
  { value: 60, spanish: 'sesenta', type: 'cardinal' },
  { value: 70, spanish: 'setenta', type: 'cardinal' },
  { value: 80, spanish: 'ochenta', type: 'cardinal' },
  { value: 90, spanish: 'noventa', type: 'cardinal' },
  { value: 100, spanish: 'cien', type: 'cardinal' },
  { value: 101, spanish: 'ciento uno', type: 'cardinal' },
  { value: 200, spanish: 'doscientos', type: 'cardinal' },
  { value: 300, spanish: 'trescientos', type: 'cardinal' },
  { value: 400, spanish: 'cuatrocientos', type: 'cardinal' },
  { value: 500, spanish: 'quinientos', type: 'cardinal' },
  { value: 600, spanish: 'seiscientos', type: 'cardinal' },
  { value: 700, spanish: 'setecientos', type: 'cardinal' },
  { value: 800, spanish: 'ochocientos', type: 'cardinal' },
  { value: 900, spanish: 'novecientos', type: 'cardinal' },
  { value: 1000, spanish: 'mil', type: 'cardinal' },
];

// Ordinal numbers 1-10
export const ordinalNumbers: NumberWord[] = [
  { value: 1, spanish: 'primero', type: 'ordinal' },
  { value: 2, spanish: 'segundo', type: 'ordinal' },
  { value: 3, spanish: 'tercero', type: 'ordinal' },
  { value: 4, spanish: 'cuarto', type: 'ordinal' },
  { value: 5, spanish: 'quinto', type: 'ordinal' },
  { value: 6, spanish: 'sexto', type: 'ordinal' },
  { value: 7, spanish: 'séptimo', type: 'ordinal' },
  { value: 8, spanish: 'octavo', type: 'ordinal' },
  { value: 9, spanish: 'noveno', type: 'ordinal' },
  { value: 10, spanish: 'décimo', type: 'ordinal' },
];

// Common time expressions
export const timeExpressions: TimeExpression[] = [
  { hour: 1, minute: 0, spanish: 'Es la una', english: "It's one o'clock" },
  { hour: 2, minute: 0, spanish: 'Son las dos', english: "It's two o'clock" },
  { hour: 3, minute: 0, spanish: 'Son las tres', english: "It's three o'clock" },
  { hour: 4, minute: 0, spanish: 'Son las cuatro', english: "It's four o'clock" },
  { hour: 5, minute: 0, spanish: 'Son las cinco', english: "It's five o'clock" },
  { hour: 6, minute: 0, spanish: 'Son las seis', english: "It's six o'clock" },
  { hour: 7, minute: 0, spanish: 'Son las siete', english: "It's seven o'clock" },
  { hour: 8, minute: 0, spanish: 'Son las ocho', english: "It's eight o'clock" },
  { hour: 9, minute: 0, spanish: 'Son las nueve', english: "It's nine o'clock" },
  { hour: 10, minute: 0, spanish: 'Son las diez', english: "It's ten o'clock" },
  { hour: 11, minute: 0, spanish: 'Son las once', english: "It's eleven o'clock" },
  { hour: 12, minute: 0, spanish: 'Son las doce', english: "It's twelve o'clock" },
  { hour: 12, minute: 0, spanish: 'Es mediodía', english: "It's noon" },
  { hour: 0, minute: 0, spanish: 'Es medianoche', english: "It's midnight" },
  { hour: 1, minute: 15, spanish: 'Es la una y cuarto', english: "It's quarter past one" },
  { hour: 2, minute: 15, spanish: 'Son las dos y cuarto', english: "It's quarter past two" },
  { hour: 3, minute: 30, spanish: 'Son las tres y media', english: "It's half past three" },
  { hour: 4, minute: 30, spanish: 'Son las cuatro y media', english: "It's half past four" },
  { hour: 5, minute: 45, spanish: 'Son las seis menos cuarto', english: "It's quarter to six" },
  { hour: 6, minute: 45, spanish: 'Son las siete menos cuarto', english: "It's quarter to seven" },
  { hour: 7, minute: 10, spanish: 'Son las siete y diez', english: "It's ten past seven" },
  { hour: 8, minute: 20, spanish: 'Son las ocho y veinte', english: "It's twenty past eight" },
  { hour: 9, minute: 40, spanish: 'Son las diez menos veinte', english: "It's twenty to ten" },
  { hour: 10, minute: 50, spanish: 'Son las once menos diez', english: "It's ten to eleven" },
];

// Days of the week
export const daysOfWeek: DateWord[] = [
  { id: 'monday', spanish: 'lunes', english: 'Monday', type: 'day' },
  { id: 'tuesday', spanish: 'martes', english: 'Tuesday', type: 'day' },
  { id: 'wednesday', spanish: 'miércoles', english: 'Wednesday', type: 'day' },
  { id: 'thursday', spanish: 'jueves', english: 'Thursday', type: 'day' },
  { id: 'friday', spanish: 'viernes', english: 'Friday', type: 'day' },
  { id: 'saturday', spanish: 'sábado', english: 'Saturday', type: 'day' },
  { id: 'sunday', spanish: 'domingo', english: 'Sunday', type: 'day' },
];

// Months of the year
export const monthsOfYear: DateWord[] = [
  { id: 'january', spanish: 'enero', english: 'January', type: 'month' },
  { id: 'february', spanish: 'febrero', english: 'February', type: 'month' },
  { id: 'march', spanish: 'marzo', english: 'March', type: 'month' },
  { id: 'april', spanish: 'abril', english: 'April', type: 'month' },
  { id: 'may', spanish: 'mayo', english: 'May', type: 'month' },
  { id: 'june', spanish: 'junio', english: 'June', type: 'month' },
  { id: 'july', spanish: 'julio', english: 'July', type: 'month' },
  { id: 'august', spanish: 'agosto', english: 'August', type: 'month' },
  { id: 'september', spanish: 'septiembre', english: 'September', type: 'month' },
  { id: 'october', spanish: 'octubre', english: 'October', type: 'month' },
  { id: 'november', spanish: 'noviembre', english: 'November', type: 'month' },
  { id: 'december', spanish: 'diciembre', english: 'December', type: 'month' },
];

// Seasons
export const seasons: DateWord[] = [
  { id: 'spring', spanish: 'la primavera', english: 'spring', type: 'season' },
  { id: 'summer', spanish: 'el verano', english: 'summer', type: 'season' },
  { id: 'fall', spanish: 'el otoño', english: 'fall/autumn', type: 'season' },
  { id: 'winter', spanish: 'el invierno', english: 'winter', type: 'season' },
];

// Pre-generated math problems
export const mathProblems: MathProblem[] = [
  { id: 'math1', num1: 2, num2: 3, operation: '+', answer: 5, questionSpanish: 'Dos más tres son...' },
  { id: 'math2', num1: 5, num2: 4, operation: '+', answer: 9, questionSpanish: 'Cinco más cuatro son...' },
  { id: 'math3', num1: 7, num2: 2, operation: '+', answer: 9, questionSpanish: 'Siete más dos son...' },
  { id: 'math4', num1: 8, num2: 6, operation: '+', answer: 14, questionSpanish: 'Ocho más seis son...' },
  { id: 'math5', num1: 10, num2: 5, operation: '+', answer: 15, questionSpanish: 'Diez más cinco son...' },
  { id: 'math6', num1: 15, num2: 10, operation: '+', answer: 25, questionSpanish: 'Quince más diez son...' },
  { id: 'math7', num1: 9, num2: 4, operation: '-', answer: 5, questionSpanish: 'Nueve menos cuatro son...' },
  { id: 'math8', num1: 12, num2: 7, operation: '-', answer: 5, questionSpanish: 'Doce menos siete son...' },
  { id: 'math9', num1: 20, num2: 8, operation: '-', answer: 12, questionSpanish: 'Veinte menos ocho son...' },
  { id: 'math10', num1: 15, num2: 6, operation: '-', answer: 9, questionSpanish: 'Quince menos seis son...' },
  { id: 'math11', num1: 3, num2: 4, operation: 'x', answer: 12, questionSpanish: 'Tres por cuatro son...' },
  { id: 'math12', num1: 5, num2: 5, operation: 'x', answer: 25, questionSpanish: 'Cinco por cinco son...' },
  { id: 'math13', num1: 6, num2: 3, operation: 'x', answer: 18, questionSpanish: 'Seis por tres son...' },
  { id: 'math14', num1: 7, num2: 2, operation: 'x', answer: 14, questionSpanish: 'Siete por dos son...' },
  { id: 'math15', num1: 4, num2: 8, operation: 'x', answer: 32, questionSpanish: 'Cuatro por ocho son...' },
];

// Price expressions for money drills
export interface PriceExpression {
  amount: number;
  spanish: string;
  english: string;
}

export const priceExpressions: PriceExpression[] = [
  { amount: 1.50, spanish: 'un sol con cincuenta céntimos', english: '1.50 soles' },
  { amount: 2.75, spanish: 'dos soles con setenta y cinco céntimos', english: '2.75 soles' },
  { amount: 5.00, spanish: 'cinco soles', english: '5.00 soles' },
  { amount: 10.50, spanish: 'diez soles con cincuenta céntimos', english: '10.50 soles' },
  { amount: 15.25, spanish: 'quince soles con veinticinco céntimos', english: '15.25 soles' },
  { amount: 20.00, spanish: 'veinte soles', english: '20.00 soles' },
  { amount: 25.99, spanish: 'veinticinco soles con noventa y nueve céntimos', english: '25.99 soles' },
  { amount: 50.00, spanish: 'cincuenta soles', english: '50.00 soles' },
  { amount: 75.50, spanish: 'setenta y cinco soles con cincuenta céntimos', english: '75.50 soles' },
  { amount: 100.00, spanish: 'cien soles', english: '100.00 soles' },
];

// Helper functions
export function getSpanishNumber(num: number): string {
  const found = cardinalNumbers.find(n => n.value === num);
  if (found) return found.spanish;

  // Handle numbers not in our list (compound numbers)
  if (num > 30 && num < 100) {
    const tens = Math.floor(num / 10) * 10;
    const ones = num % 10;
    const tensWord = cardinalNumbers.find(n => n.value === tens)?.spanish || '';
    const onesWord = ones > 0 ? cardinalNumbers.find(n => n.value === ones)?.spanish || '' : '';
    return onesWord ? `${tensWord} y ${onesWord}` : tensWord;
  }

  return num.toString();
}

export function getRandomNumber(min: number, max: number): NumberWord {
  const filtered = cardinalNumbers.filter(n => n.value >= min && n.value <= max);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getRandomMathProblem(): MathProblem {
  return mathProblems[Math.floor(Math.random() * mathProblems.length)];
}

export function getRandomTimeExpression(): TimeExpression {
  return timeExpressions[Math.floor(Math.random() * timeExpressions.length)];
}

export function formatSpanishDate(day: number, month: string, year: number): string {
  const monthWord = monthsOfYear.find(m => m.id === month.toLowerCase())?.spanish || month;
  return `${day} de ${monthWord} de ${year}`;
}
