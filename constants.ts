
import { Lesson, ExerciseType } from './types';

export const NALIBO_PHONETICS = `
Nalibo Phonetics (Official Guide):
- A: /a/, E: /e/, I: /i/, O: /o/, U: /u/, Ă: /aʊ/ (Au), Ė: /eʊ/ (Eu).
- Consonants: Ç /tʃ/ (ch), Ş /ʃ/ (sh), Þ /θ/ (th), Ñ /ɲ/ (ny), Ż /ʒ/ (zh), Ř /ɹ/ (American R), Ķ /kl̥/ (voiceless kl), Ń /ŋ/ (ng).
- Glottal Stop: Ø /ʔ/.
- Stress: Second to last syllable unless marked (à, è, ì, ò, ù).
- Silent: 'x' is the only silent letter. No mergers between words.
`;

export const NALIBO_GRAMMAR_SUMMARY = `
Nalibo Grammar Rules (From Official Guide):
1. Sentence Order: Always SVO (Subject Verb Object).
2. Adjective Order: Nouns first, then properties (e.g., "Ge libre roçe" = The red book).
3. Article: "Ge" is the only article (The/A).
4. Particles: La (Subject), Ma (Action/Location), O (And), A (To), Aba (Or), Tama (But), Ba (Also), Xume (With).
   * Particles go AFTER the word they mark.
   * "Ma" and "La" can be dropped in casual speech.
5. Gender: Living things use -a (Male), -o (Female), -e (Neutral). Objects are always neutral.
6. Plural: Add suffix "-ji". Drop gendered ending before adding -ji for groups of mixed gender (e.g. Parenji).
7. Tense:
   * Present: suffix "-'lam".
   * Past: suffix "-ka" (casual) or auxiliary "Habid" (formal).
   * Future: suffix "-ke" (casual) or auxiliary "Habied" (formal).
8. Possession: Attach "'on" (e.g., Li'on = My).
`;

export const LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'Nalibo Greetings & Pronouns',
    level: 'Novice Low',
    icon: '👋',
    canDoStatements: [
      "I can say Hello and Thank You.",
      "I can identify myself and others using Li and Tu."
    ],
    storySegment: 'Kara and Max meet. They exchange simple greetings. Kara notices that Nalibo sounds clear and structured.',
    grammarFocus: 'Pronunciation and Basic SVO (Page 2-7)',
    linguisticNote: {
      title: 'Linguistic Consistency',
      description: 'Nalibo letters always sound the same. There are no silent letters except X.'
    },
    comparisonNote: 'Nalibo pronunciation is similar to Spanish, with pure vowels.',
    vocab: [
      { nalibo: 'Salave', english: 'Hello / Hi / Good Day', category: 'Greeting' },
      { nalibo: 'Graçi', english: 'Thank You', category: 'Greeting' },
      { nalibo: 'Sol', english: 'Yes / Okay', category: 'Response' },
      { nalibo: 'Ne', english: 'No / Disagreement', category: 'Response' },
      { nalibo: 'Li', english: 'I', category: 'Pronoun' },
      { nalibo: 'Tu', english: 'You', category: 'Pronoun' },
      { nalibo: 'Ge', english: 'The / A (Article)', category: 'Grammar' },
      { nalibo: 'Tames', english: 'To Speak', category: 'Verb' }
    ],
    exercises: [
      {
        id: '1-1',
        type: ExerciseType.MATCHING,
        prompt: 'Match core terms from the guide.',
        correctAnswer: 'All matched',
        grammarFocus: 'Pronouns',
        pairs: [
          { left: 'Salave', right: 'Hello' },
          { left: 'Li', right: 'I' },
          { left: 'Tu', right: 'You' },
          { left: 'Graçi', right: 'Thank You' }
        ]
      },
      {
        id: '1-speaking',
        type: ExerciseType.SPEAKING,
        prompt: 'Say: Salave! Graçi.',
        correctAnswer: 'Salave Graçi',
        grammarFocus: 'Basic Greeting Pronunciation',
      },
      {
        id: '1-2',
        type: ExerciseType.SENTENCE_BUILDER,
        prompt: 'Form: "I speak Nalibo" (speak = tames)',
        correctAnswer: 'Li tames Nalibone',
        grammarFocus: 'SVO Order',
        words: [
          { nalibo: 'Li', english: 'I' },
          { nalibo: 'tames', english: 'speak' },
          { nalibo: 'Nalibone', english: 'Nalibo' },
          { nalibo: 'Ge', english: 'The' }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Colors and Placement',
    level: 'Novice Mid',
    icon: '🎨',
    canDoStatements: [
      "I can describe a book's color.",
      "I know that adjectives follow the noun."
    ],
    storySegment: 'Max shows Kara his library. He points to a red book and explains the order of words.',
    grammarFocus: 'Adjectives after Nouns (Page 5)',
    linguisticNote: {
      title: 'Structural Logic',
      description: 'The object is always mentioned before its properties. "Book red", not "Red book".'
    },
    comparisonNote: 'This follows the Romance language pattern like Spanish "ropa azul".',
    vocab: [
      { nalibo: 'Libre', english: 'Book', category: 'Noun' },
      { nalibo: 'Dome', english: 'House', category: 'Noun' },
      { nalibo: 'Roçe', english: 'Red', category: 'Color' },
      { nalibo: 'Blu', english: 'Blue', category: 'Color' },
      { nalibo: 'Gren', english: 'Green', category: 'Color' },
      { nalibo: 'Yale', english: 'Yellow', category: 'Color' },
      { nalibo: 'Bona', english: 'Good', category: 'Adjective' }
    ],
    exercises: [
      {
        id: '2-1',
        type: ExerciseType.MATCHING,
        prompt: 'Match colors and nouns.',
        correctAnswer: 'All matched',
        pairs: [
          { left: 'Libre', right: 'Book' },
          { left: 'Roçe', right: 'Red' },
          { left: 'Blu', right: 'Blue' },
          { left: 'Bona', right: 'Good' }
        ],
        grammarFocus: 'Vocab'
      },
      {
        id: '2-speaking',
        type: ExerciseType.SPEAKING,
        prompt: 'Say: Ge libre roçe (The red book)',
        correctAnswer: 'Ge libre roçe',
        grammarFocus: 'Adjective Pronunciation',
      },
      {
        id: '2-2',
        type: ExerciseType.SENTENCE_BUILDER,
        prompt: 'Form: "The red book"',
        correctAnswer: 'Ge libre roçe',
        grammarFocus: 'Adjective Placement',
        words: [
          { nalibo: 'Ge', english: 'The' },
          { nalibo: 'libre', english: 'book' },
          { nalibo: 'roçe', english: 'red' },
          { nalibo: 'Blu', english: 'blue' }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'The Cafe & Actions',
    level: 'Novice Mid',
    icon: '🍎',
    canDoStatements: [
      "I can use the present tense -'lam.",
      "I can use the Ma particle for actions."
    ],
    storySegment: 'Kara visits a cafe. People are eating (amere) and drinking (drinķa). She practices using the action marker.',
    grammarFocus: "Particles and -'lam (Page 5, 12, 13)",
    linguisticNote: {
      title: 'Action Marker Ma',
      description: 'Ma marks action or location. In casual speech, it can be dropped.'
    },
    comparisonNote: "-'lam is used similarly to '-ing' in English to show something is happening now.",
    vocab: [
      { nalibo: 'Amere', english: 'To Eat', category: 'Verb' },
      { nalibo: 'Drinķa', english: 'To Drink', category: 'Verb' },
      { nalibo: 'Frutes', english: 'Fruit', category: 'Noun' },
      { nalibo: 'Pane', english: 'Bread', category: 'Noun' },
      { nalibo: 'Kafi', english: 'Coffee', category: 'Noun' },
      { nalibo: 'Milç', english: 'Milk', category: 'Noun' },
      { nalibo: 'Aķe', english: 'Water', category: 'Noun' },
      { nalibo: 'Te', english: 'Tea', category: 'Noun' }
    ],
    exercises: [
      {
        id: '3-1',
        type: ExerciseType.MATCHING,
        prompt: 'Match foods and actions.',
        correctAnswer: 'All matched',
        pairs: [
          { left: 'Amere', right: 'To Eat' },
          { left: 'Drinķa', right: 'To Drink' },
          { left: 'Frutes', right: 'Fruit' },
          { left: 'Aķe', right: 'Water' }
        ],
        grammarFocus: 'Vocab'
      },
      {
        id: '3-speaking',
        type: ExerciseType.SPEAKING,
        prompt: "Say: Li ma amere'lam (I am eating)",
        correctAnswer: "Li ma amere'lam",
        grammarFocus: 'Verb Suffix Pronunciation',
      },
      {
        id: '3-2',
        type: ExerciseType.SENTENCE_BUILDER,
        prompt: 'Form: "I am eating fruit"',
        correctAnswer: "Li ma amere'lam ge frutes",
        grammarFocus: 'Action Marking',
        words: [
          { nalibo: 'Li', english: 'I' },
          { nalibo: 'ma', english: 'Action' },
          { nalibo: "amere'lam", english: 'eating' },
          { nalibo: 'ge', english: 'the' },
          { nalibo: 'frutes', english: 'fruit' }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'People and Gender',
    level: 'Novice High',
    icon: '👪',
    canDoStatements: [
      "I can distinguish between a boy (Nina) and a girl (Nino).",
      "I can use gender-neutral forms like Hambene."
    ],
    storySegment: 'Max introduces his family. Kara learns that gender markers -a, -o, and -e only apply to living things.',
    grammarFocus: 'Gender and Suffixes (Page 8, 9, 21)',
    linguisticNote: {
      title: 'Living vs Object',
      description: 'Only humans and animals have gendered endings. A book (libre) never becomes libra or libro.'
    },
    comparisonNote: 'Nalibo uses -a for male and -o for female, and -e for neutral/mixed.',
    vocab: [
      { nalibo: 'Nina', english: 'Boy / Male Child', category: 'People' },
      { nalibo: 'Nino', english: 'Girl / Female Child', category: 'People' },
      { nalibo: 'Hambene', english: 'Child (Neutral)', category: 'People' },
      { nalibo: 'Parena', english: 'Father', category: 'Family' },
      { nalibo: 'Pareno', english: 'Mother', category: 'Family' },
      { nalibo: 'Parene', english: 'Parent (Neutral)', category: 'Family' },
      { nalibo: 'Frata', english: 'Brother', category: 'Family' },
      { nalibo: 'Frato', english: 'Sister', category: 'Family' },
      { nalibo: 'Frate', english: 'Sibling (Neutral)', category: 'Family' }
    ],
    exercises: [
      {
        id: '4-1',
        type: ExerciseType.MATCHING,
        prompt: 'Match family and gender.',
        correctAnswer: 'All matched',
        pairs: [
          { left: 'Hambena', right: 'Boy' },
          { left: 'Hambeno', right: 'Girl' },
          { left: 'Frata', right: 'Brother' },
          { left: 'Frato', right: 'Sister' }
        ],
        grammarFocus: 'Vocab'
      }
    ]
  },
  {
    id: '5',
    title: 'Plurals and Possessions',
    level: 'Novice High',
    icon: '📚',
    canDoStatements: [
      "I can pluralize nouns using -ji.",
      "I can show ownership using 'on."
    ],
    storySegment: 'At the market, Kara asks for "my fruits". She learns how to group items and claim them.',
    grammarFocus: "Plurals and Possession (Page 7, 9, 13)",
    linguisticNote: {
      title: 'Agglutination',
      description: "Plurals (-ji) and Possession ('on) are simple suffixes that attach directly to the noun."
    },
    comparisonNote: 'Unlike English irregular plurals, Nalibo is always regular: drop gender, add -ji.',
    vocab: [
      { nalibo: '-ji', english: 'Plural Suffix', category: 'Grammar' },
      { nalibo: "'on", english: 'Possession Marker', category: 'Grammar' },
      { nalibo: 'Personoji', english: 'People', category: 'Plural' },
      { nalibo: 'Libreji', english: 'Books', category: 'Plural' },
      { nalibo: 'Dore', english: 'Dog', category: 'Noun' },
      { nalibo: 'Kade', english: 'Cat', category: 'Noun' }
    ],
    exercises: [
      {
        id: '5-1',
        type: ExerciseType.SENTENCE_BUILDER,
        prompt: 'Form: "My books" (I = Li)',
        correctAnswer: "Li'on libreji",
        grammarFocus: 'Possession',
        words: [
          { nalibo: "Li'on", english: 'My' },
          { nalibo: 'libreji', english: 'books' },
          { nalibo: 'Tu', english: 'You' },
          { nalibo: 'Ge', english: 'The' }
        ]
      }
    ]
  },
  {
    id: '6',
    title: 'Counting and Math',
    level: 'Intermediate Low',
    icon: '🔢',
    canDoStatements: [
      "I can count to ten in Nalibo.",
      "I can perform basic addition."
    ],
    storySegment: 'Max teaches the Nalibo numbering system. He shows how numbers combine after ten.',
    grammarFocus: 'Numbers and Math Operations (Page 10, 11)',
    linguisticNote: {
      title: 'Decimal System',
      description: 'Nalibo uses a base-10 system. 11 is "Des xune" (Ten one).'
    },
    comparisonNote: 'Addition (Abişon) uses the "o" particle to join the numbers.',
    vocab: [
      { nalibo: 'Cero', english: 'Zero (0)', category: 'Number' },
      { nalibo: 'Xune', english: 'One (1)', category: 'Number' },
      { nalibo: 'Daso', english: 'Two (2)', category: 'Number' },
      { nalibo: 'Tras', english: 'Three (3)', category: 'Number' },
      { nalibo: 'Zaraba', english: 'Four (4)', category: 'Number' },
      { nalibo: 'Cingo', english: 'Five (5)', category: 'Number' },
      { nalibo: 'Maba', english: 'Six (6)', category: 'Number' },
      { nalibo: 'Perotre', english: 'Seven (7)', category: 'Number' },
      { nalibo: 'Ninco', english: 'Eight (8)', category: 'Number' },
      { nalibo: 'Ceko', english: 'Nine (9)', category: 'Number' },
      { nalibo: 'Des', english: 'Ten (10)', category: 'Number' }
    ],
    exercises: [
      {
        id: '6-1',
        type: ExerciseType.MATCHING,
        prompt: 'Match numbers to words.',
        correctAnswer: 'All matched',
        pairs: [
          { left: 'Xune', right: '1' },
          { left: 'Daso', right: '2' },
          { left: 'Tras', right: '3' },
          { left: 'Ceko', right: '9' }
        ],
        grammarFocus: 'Numbers'
      }
    ]
  },
  {
    id: '7',
    title: 'Time: Past and Future',
    level: 'Intermediate Low',
    icon: '⏳',
    canDoStatements: [
      "I can use -ka for the past.",
      "I can use -ke for the future."
    ],
    storySegment: 'Kara reflects on her day. She talks about what she ate yesterday (oika) and what she will eat tomorrow (oike).',
    grammarFocus: 'Tense Markers (Page 6, 23, 24)',
    linguisticNote: {
      title: 'Casual vs Formal Tense',
      description: 'Suffixes -ka and -ke are casual. Auxiliaries Habid and Habied are formal.'
    },
    comparisonNote: 'Tense markers replace the present tense -lam suffix.',
    vocab: [
      { nalibo: 'Oi', english: 'Today', category: 'Time' },
      { nalibo: 'Oike', english: 'Tomorrow', category: 'Time' },
      { nalibo: 'Oika', english: 'Yesterday', category: 'Time' },
      { nalibo: '-ka', english: 'Past Suffix', category: 'Grammar' },
      { nalibo: '-ke', english: 'Future Suffix', category: 'Grammar' },
      { nalibo: 'Habid', english: 'Past Auxiliary (Formal)', category: 'Grammar' },
      { nalibo: 'Habied', english: 'Future Auxiliary (Formal)', category: 'Grammar' }
    ],
    exercises: [
      {
        id: '7-1',
        type: ExerciseType.MATCHING,
        prompt: 'Match verbs to their tense.',
        correctAnswer: 'All matched',
        pairs: [
          { left: 'Amereka', right: 'Ate' },
          { left: 'Amereke', right: 'Will Eat' },
          { left: 'Habid amere', right: 'Ate (Formal)' },
          { left: 'Habied amere', right: 'Will Eat (Formal)' }
        ],
        grammarFocus: 'Tense Rules'
      }
    ]
  },
  {
    id: '8',
    title: 'Advanced Particles',
    level: 'Intermediate Low',
    icon: '🧬',
    canDoStatements: [
      "I can use Tama (but) and Aba (or).",
      "I can use Xume (with)."
    ],
    storySegment: 'Kara has a full conversation. She uses complex connectors to express choices and limitations.',
    grammarFocus: 'The 8 Particles (Page 5, 16, 17)',
    linguisticNote: {
      title: 'Particle Placement',
      description: 'Always put the particle AFTER the word you want to mark.'
    },
    comparisonNote: 'Aba means "or", and Tama means "but" or "however".',
    vocab: [
      { nalibo: 'Tama', english: 'But / However', category: 'Particle' },
      { nalibo: 'Aba', english: 'Or', category: 'Particle' },
      { nalibo: 'Xume', english: 'With / Together', category: 'Particle' },
      { nalibo: 'Ba', english: 'Also', category: 'Particle' },
      { nalibo: 'O', english: 'And', category: 'Particle' },
      { nalibo: 'A', english: 'To (Location)', category: 'Particle' },
      { nalibo: 'La', english: 'Subject Marker', category: 'Particle' }
    ],
    exercises: [
      {
        id: '8-1',
        type: ExerciseType.SENTENCE_BUILDER,
        prompt: 'Form: "I eat fruit with coffee"',
        correctAnswer: "Li ma amere'lam ge frutes xume kafi",
        grammarFocus: 'Particle Logic',
        words: [
          { nalibo: 'Li', english: 'I' },
          { nalibo: 'ma', english: 'Action' },
          { nalibo: "amere'lam", english: 'eating' },
          { nalibo: 'frutes', english: 'fruit' },
          { nalibo: 'xume', english: 'with' },
          { nalibo: 'kafi', english: 'coffee' }
        ]
      }
    ]
  }
];
