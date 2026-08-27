import './games.css';

const questions = [...document.querySelectorAll('.quiz-question')];
const scoreEl = document.querySelector('#quiz-score');
const progressEl = document.querySelector('#quiz-progress');
const finishEl = document.querySelector('#quiz-finish');
const finalScoreEl = document.querySelector('#final-score');
const finalMessageEl = document.querySelector('#final-message');
const restartButton = document.querySelector('#restart-quiz');

let currentQuestion = 0;
let score = 0;

const updateProgress = () => {
  if (scoreEl) scoreEl.textContent = String(score);
  if (progressEl) progressEl.textContent = `Question ${Math.min(currentQuestion + 1, questions.length)} of ${questions.length}`;
};

const showQuestion = (index) => {
  questions.forEach((question, questionIndex) => {
    question.classList.toggle('is-active', questionIndex === index);
  });
};

questions.forEach((question, questionIndex) => {
  const options = [...question.querySelectorAll('.quiz-option')];
  const feedback = question.querySelector('.quiz-feedback');
  const explanation = question.dataset.explanation || '';

  options.forEach((option) => {
    option.addEventListener('click', () => {
      if (option.disabled) return;

      const correctOption = options.find((item) => item.dataset.correct === 'true');
      const isCorrect = option.dataset.correct === 'true';
      if (isCorrect) score += 1;

      options.forEach((item) => {
        item.disabled = true;
        if (item.dataset.correct === 'true') item.classList.add('correct');
      });
      if (!isCorrect) option.classList.add('incorrect');

      if (feedback) {
        feedback.innerHTML = `<strong>${isCorrect ? 'Correct.' : 'Not quite.'}</strong> ${explanation}`;
      }
      updateProgress();

      setTimeout(() => {
        question.classList.remove('is-active');
        currentQuestion = questionIndex + 1;

        if (currentQuestion < questions.length) {
          showQuestion(currentQuestion);
          updateProgress();
        } else if (finishEl) {
          finishEl.hidden = false;
          if (finalScoreEl) finalScoreEl.textContent = String(score);
          if (progressEl) progressEl.textContent = 'Quiz complete';
          if (finalMessageEl) {
            finalMessageEl.textContent = score === 5
              ? 'Perfect score — your instincts are already working like a defender.'
              : score >= 3
                ? 'Strong start — review the explanations and challenge yourself again.'
                : 'Every missed answer is useful intelligence. Try once more and beat your score.';
          }
        }
      }, 1500);
    });
  });
});

restartButton?.addEventListener('click', () => {
  score = 0;
  currentQuestion = 0;
  finishEl.hidden = true;
  questions.forEach((question) => {
    question.querySelectorAll('.quiz-option').forEach((option) => {
      option.disabled = false;
      option.classList.remove('correct', 'incorrect');
    });
    const feedback = question.querySelector('.quiz-feedback');
    if (feedback) feedback.textContent = '';
  });
  showQuestion(0);
  updateProgress();
});

updateProgress();

const hintOutput = document.querySelector('#cipher-hint-output');
const cipherAnswer = document.querySelector('#cipher-answer');
const hintOne = document.querySelector('#hint-one');
const hintTwo = document.querySelector('#hint-two');
const revealCipher = document.querySelector('#reveal-cipher');

hintOne?.addEventListener('click', () => {
  if (hintOutput) hintOutput.textContent = 'Hint 01: Caesar ciphers move every letter by the same number of places in the alphabet.';
});

hintTwo?.addEventListener('click', () => {
  if (hintOutput) hintOutput.textContent = 'Hint 02: In this puzzle, A became H. Count the distance between those letters.';
});

revealCipher?.addEventListener('click', () => {
  if (cipherAnswer) cipherAnswer.hidden = false;
  if (hintOutput) hintOutput.textContent = 'Decoded! The shift was +7 when encrypting, so decoding means shifting each letter back by 7.';
});
