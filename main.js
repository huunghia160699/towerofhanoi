// script.js
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
const questionElement = document.querySelector("#question p");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");
const resultElement = document.getElementById("result");
const questionImage = document.getElementById("question-image");
const questionCounter = document.getElementById("question-counter");
const totalQuestionsElement = document.getElementById("total-questions");

// Function to get random elements from an array
function getRandomElements(arr) {
  const result = [];
  while (arr.length > 0) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const randomElement = arr[randomIndex];
    result.push(randomElement);
    arr.splice(randomIndex, 1);
  }
  return result;
}

// Function to load a question
function loadQuestion(questions) {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  if (currentQuestion.image) {
    questionImage.src = currentQuestion.image;
    questionImage.style.display = "block";
  } else {
    questionImage.style.display = "none";
  }
  optionsElement.innerHTML = "";
  const randomOptions = getRandomElements(currentQuestion.options);
  randomOptions.forEach((option) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.className = "option-button";
    button.onclick = () => selectOption(option, button, currentQuestion);
    optionsElement.appendChild(button);
  });
  nextButton.style.display = "none";
  questionCounter.innerText = `Câu ${currentQuestionIndex + 1} / ${
    questions.length
  }`;
  totalQuestionsElement.textContent = questions.length; // Update total questions
}

// Function to preview and load questions from a file
function previewFile() {
  const [file] = document.querySelector("input[type=file]").files;
  const reader = new FileReader();
  let parsedQuestions = [];
  reader.onload = (e) => {
    const fileContent = e.target.result;
    const lines = fileContent.split(/\r\n|\n/);
    lines.forEach((line, i) => {
      if ((line != "") & ((i + 1) % 6 == 0)) {
        const question = {
          question: "",
          options: [],
          answer: "",
        };
        question.question = lines[i + 1];
        question.options = [
          lines[i + 2],
          lines[i + 3],
          lines[i + 4],
          lines[i + 5],
        ];
        question.answer = lines[i + 6];
        parsedQuestions.push(question);
        console.log(question);
      }
    });
    questions = getRandomElements(parsedQuestions);
    loadQuestion(questions);
    totalQuestionsElement.textContent = questions.length; // Update total questions
  };
  if (file) {
    reader.readAsText(file);
  }
}

// Function to handle option selection
function selectOption(selectedOption, button, currentQuestion) {
  if (selectedOption === currentQuestion.answer) {
    score++;
    button.classList.add("correct");
  } else {
    button.classList.add("incorrect");
    const correctButton = Array.from(optionsElement.children).find(
      (btn) => btn.innerText == currentQuestion.answer
    );
    if (correctButton) {
      correctButton.classList.add("correct");
    }
  }
  nextButton.style.display = "block";
  blurOptions();
  disableOptions();
}

// Function to blur all options except the correct and incorrect ones
function blurOptions() {
  const buttons = optionsElement.getElementsByClassName("option-button");
  for (let button of buttons) {
    if (
      !button.classList.contains("correct") &&
      !button.classList.contains("incorrect")
    ) {
      button.classList.add("blurred");
    }
  }
}

// Function to disable all option buttons
function disableOptions() {
  const buttons = optionsElement.getElementsByClassName("option-button");
  for (let button of buttons) {
    button.disabled = true;
  }
}

// Event listener for the next button
nextButton.onclick = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion(questions);
  } else {
    showResult();
  }
};

// Function to show the result
function showResult() {
  questionElement.style.display = "none";
  questionImage.style.display = "none";
  optionsElement.style.display = "none";
  nextButton.style.display = "none";
  resultElement.innerText = `Your score: ${score} out of ${questions.length}`;
  resultElement.style.display = "block";
}
