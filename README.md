# AprendeEspanol

An interactive Spanish learning web application for A1-level beginners.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Screenshots

<p align="center">
  <img src="screenshots/homepage.png" alt="Homepage" width="400">
  <img src="screenshots/conversations.png" alt="Conversations" width="400">
</p>
<p align="center">
  <img src="screenshots/vocabulary.png" alt="Vocabulary" width="400">
  <img src="screenshots/flashcards.png" alt="Flashcards" width="400">
</p>

> See the [screenshots folder](./screenshots/) for more images and instructions on capturing your own.

## Features

### Vocabulary
- **500+ Spanish words** organized by category (family, food, animals, colors, and more)
- Nouns with gender and plural forms
- Adjectives and adverbs
- Example sentences with translations
- Text-to-speech pronunciation

### Verb Conjugations
- **100+ Spanish verbs** with full conjugation tables
- Present, preterite, imperfect, and future tenses
- Regular, irregular, stem-changing, and reflexive verbs
- Search and filter functionality
- Gerund and past participle forms

### Grammar Lessons
- **10+ structured lessons** for A1-level learners
- Interactive exercises with instant feedback
- Multiple-choice, fill-in-the-blank, and translation exercises
- Progress tracking per lesson

### Conversation Practice
- **17 real-life dialogue scenarios**
- Progressive unlock system (complete one to unlock the next)
- Multiple response choices with feedback
- Cultural notes about Spanish-speaking countries
- Difficulty levels from beginner to advanced

### Flashcard System
- Spaced repetition algorithm for optimal learning
- Practice Spanish-to-English or English-to-Spanish
- Configurable deck size and word types
- Session statistics and progress tracking

### Numbers & Time Drills
- Number recognition (0-1000)
- Telling time in Spanish
- Days, months, and seasons
- Math problems in Spanish

### Additional Features
- Dark/light theme toggle
- Progress persistence with localStorage
- 8 virtual teachers with unique specialties
- Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/aprende-espanol.git
cd aprende-espanol

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
spanish-project/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── conversations/     # Conversation practice
│   ├── vocabulary/        # Vocabulary browser
│   ├── verbs/             # Verb conjugations
│   ├── grammar/           # Grammar lessons
│   ├── flashcards/        # Flashcard practice
│   ├── practice/          # Number/time drills
│   ├── review/            # Review weak areas
│   └── test/              # Assessment test
├── components/
│   ├── ui/                # Reusable UI components
│   └── layout/            # Layout components (Header, TeacherBubble)
├── context/               # React Context providers
│   ├── ProgressContext    # User progress tracking
│   └── ThemeContext       # Dark/light mode
├── data/                  # Learning content
│   ├── nouns.ts          # 500+ nouns
│   ├── adjectives.ts     # Adjectives
│   ├── adverbs.ts        # Adverbs
│   ├── verbs.ts          # 100+ verbs with conjugations
│   ├── grammar-lessons.ts # Grammar content & exercises
│   ├── conversations.ts  # Dialogue scenarios
│   ├── teachers.ts       # Teacher profiles
│   └── number-drills.ts  # Number/time data
├── lib/                   # Utilities
│   ├── types.ts          # TypeScript interfaces
│   ├── speech.ts         # Text-to-speech
│   └── storage.ts        # localStorage management
└── public/               # Static assets
```

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State:** React Context API
- **Storage:** Browser localStorage

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Test your changes locally before submitting
- Update documentation if needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Teacher avatar images from [Unsplash](https://unsplash.com/)
- Icons from [Lucide](https://lucide.dev/)
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
