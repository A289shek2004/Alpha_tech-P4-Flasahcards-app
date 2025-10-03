const initialFlashcards = [
  {
    id: 1,
    question: "What is JavaScript?",
    answer: "JavaScript is a programming language used to create dynamic and interactive web content."
  },
  {
    id: 2,
    question: "What does HTML stand for?",
    answer: "HyperText Markup Language - the standard markup language for creating web pages."
  },
  {
    id: 3,
    question: "What is CSS used for?",
    answer: "CSS (Cascading Style Sheets) is used to style and layout web pages."
  },
  {
    id: 4,
    question: "What is a variable?",
    answer: "A variable is a container for storing data values in programming."
  },
  {
    id: 5,
    question: "What is an API?",
    answer: "API stands for Application Programming Interface - a way for applications to communicate with each other."
  },
  {
    id: 6,
    question: "What is DOM?",
    answer: "DOM (Document Object Model) is a programming interface for web documents that represents the page structure."
  },
  {
    id: 7,
    question: "What is React?",
    answer: "React is a JavaScript library for building user interfaces, developed by Facebook."
  },
  {
    id: 8,
    question: "What is a function?",
    answer: "A function is a reusable block of code designed to perform a particular task."
  },
  {
    id: 9,
    question: "What is JSON?",
    answer: "JSON (JavaScript Object Notation) is a lightweight data-interchange format that's easy to read and write."
  },
  {
    id: 10,
    question: "What is Git?",
    answer: "Git is a distributed version control system for tracking changes in source code during development."
  },
  {
    id: 11,
    question: "What is Node.js?",
    answer: "Node.js is a JavaScript runtime built on Chrome's V8 engine that allows JavaScript to run on the server."
  },
  {
    id: 12,
    question: "What is an array?",
    answer: "An array is a data structure that stores a collection of elements, typically of the same type."
  },
  {
    id: 13,
    question: "What is responsive design?",
    answer: "Responsive design is an approach to web design that makes web pages render well on different devices and screen sizes."
  },
  {
    id: 14,
    question: "What is a loop?",
    answer: "A loop is a programming construct that repeats a block of code until a specified condition is met."
  },
  {
    id: 15,
    question: "What is debugging?",
    answer: "Debugging is the process of finding and fixing errors or bugs in software code."
  }
];

let flashcards = [];
let currentCardIndex = 0;
let isAnimating = false;

const flashcardContainer = document.getElementById('flashcard-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const cardCounter = document.getElementById('card-counter');
const addCardForm = document.getElementById('add-card-form');
const questionInput = document.getElementById('question-input');
const answerInput = document.getElementById('answer-input');

function init() {
  loadFlashcards();
  renderAllCards();
  setupEventListeners();
}

function loadFlashcards() {
  const savedFlashcards = localStorage.getItem('flashcards');

  if (savedFlashcards) {
    flashcards = JSON.parse(savedFlashcards);
  } else {
    flashcards = [...initialFlashcards];
    saveFlashcards();
  }
}

function saveFlashcards() {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

function createCardElement(card, index) {
  const flashcard = document.createElement('div');
  flashcard.className = 'flashcard';
  flashcard.dataset.index = index;

  flashcard.innerHTML = `
    <div class="flashcard-face flashcard-front">
      <div class="card-label">Question</div>
      <p>${card.question}</p>
    </div>
    <div class="flashcard-face flashcard-back">
      <div class="card-label">Answer</div>
      <p>${card.answer}</p>
    </div>
  `;

  flashcard.addEventListener('click', () => {
    if (parseInt(flashcard.dataset.index) === currentCardIndex) {
      flashcard.classList.toggle('flipped');
    }
  });

  return flashcard;
}

function renderAllCards() {
  flashcardContainer.innerHTML = '';

  if (flashcards.length === 0) {
    flashcardContainer.innerHTML = `
      <div class="flashcard card-0">
        <div class="flashcard-face flashcard-front">
          <div class="card-label">No Cards</div>
          <p>Add your first flashcard below!</p>
        </div>
        <div class="flashcard-face flashcard-back">
          <div class="card-label">No Cards</div>
          <p>Add your first flashcard below!</p>
        </div>
      </div>
    `;
    cardCounter.textContent = '0 / 0';
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  const visibleCards = 3;

  for (let i = 0; i < Math.min(flashcards.length, visibleCards + 2); i++) {
    const cardIndex = (currentCardIndex + i) % flashcards.length;
    const card = flashcards[cardIndex];
    const cardElement = createCardElement(card, cardIndex);

    if (i === 0) {
      cardElement.classList.add('card-0');
    } else if (i === 1) {
      cardElement.classList.add('card-1');
    } else if (i === 2) {
      cardElement.classList.add('card-2');
    } else {
      cardElement.classList.add('card-next');
    }

    flashcardContainer.appendChild(cardElement);
  }

  cardCounter.textContent = `${currentCardIndex + 1} / ${flashcards.length}`;
  cardCounter.classList.add('updated');
  setTimeout(() => cardCounter.classList.remove('updated'), 400);

  prevBtn.disabled = flashcards.length <= 1;
  nextBtn.disabled = flashcards.length <= 1;
}

function nextCard() {
  if (flashcards.length === 0 || isAnimating) return;

  isAnimating = true;
  currentCardIndex = (currentCardIndex + 1) % flashcards.length;

  const cards = flashcardContainer.querySelectorAll('.flashcard');
  cards.forEach(card => card.classList.add('animating'));

  cards[0]?.classList.replace('card-0', 'card-prev');
  cards[1]?.classList.replace('card-1', 'card-0');
  cards[2]?.classList.replace('card-2', 'card-1');

  setTimeout(() => {
    renderAllCards();
    isAnimating = false;
  }, 500);
}

function prevCard() {
  if (flashcards.length === 0 || isAnimating) return;

  isAnimating = true;
  currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;

  const cards = flashcardContainer.querySelectorAll('.flashcard');
  cards.forEach(card => card.classList.add('animating'));

  setTimeout(() => {
    renderAllCards();
    isAnimating = false;
  }, 500);
}

// Add new flashcard
function addFlashcard(e) {
  e.preventDefault();

  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!question || !answer) {
    alert('Please enter both a question and an answer.');
    return;
  }

  // Create new flashcard
  const newCard = {
    id: Date.now(),
    question,
    answer
  };

  // Add to array
  flashcards.push(newCard);

  // Save to localStorage
  saveFlashcards();

  currentCardIndex = flashcards.length - 1;
  renderAllCards();

  // Clear form
  questionInput.value = '';
  answerInput.value = '';

  const addBtn = addCardForm.querySelector('.add-btn');
  const originalText = addBtn.textContent;
  addBtn.textContent = 'Card Added!';
  addBtn.style.background = '#4caf50';
  addBtn.classList.add('success');

  setTimeout(() => {
    addBtn.textContent = originalText;
    addBtn.style.background = '';
    addBtn.classList.remove('success');
  }, 1500);
}

function setupEventListeners() {
  prevBtn.addEventListener('click', prevCard);
  nextBtn.addEventListener('click', nextCard);
  addCardForm.addEventListener('submit', addFlashcard);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevCard();
    } else if (e.key === 'ArrowRight') {
      nextCard();
    } else if (e.key === ' ') {
      e.preventDefault();
      const activeCard = flashcardContainer.querySelector('.card-0');
      if (activeCard) {
        activeCard.classList.toggle('flipped');
      }
    }
  });
}

// Start the app
init();
