// script.js
let currentQuestionIndex = 0;
let score = 0;
let su = [];
const questionElement = document.querySelector("#question p");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");
const resultElement = document.getElementById("result");
const questionImage = document.getElementById("question-image");
const questionCounter = document.getElementById("question-counter");
const totalQuestionsElement = document.getElementById("total-questions");

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
  questionCounter.innerText = `Question ${currentQuestionIndex + 1} of ${
    questions.length
  }`;
}

function previewFile() {
  const [file] = document.querySelector("input[type=file]").files;
  const reader = new FileReader();
  let res = [];
  reader.onload = (e) => {
    const file = e.target.result;
    const lines = file.split(/\r\n|\n/);
    lines.forEach((line, i) => {
      if ((line != "") & ((i + 1) % 6 == 0)) {
        const cauhoi = {
          question: "",
          options: [],
          answer: "",
        };
        cauhoi.question = lines[i + 1];
        cauhoi.options = [
          lines[i + 3],
          lines[i + 4],
          lines[i + 5],
          lines[i + 6],
        ];
        cauhoi.answer = lines[i + 2];
        res.push(cauhoi);
        console.log(cauhoi);
      }
    });
    su = getRandomElements(res);
    loadQuestion(su);
    totalQuestionsElement.textContent = su.length; // Update total questions
  };
  if (file) {
    reader.readAsText(file);
  }
}

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
  disableOptions();
}

function disableOptions() {
  const buttons = optionsElement.getElementsByClassName("option-button");
  for (let button of buttons) {
    button.disabled = true;
  }
}

nextButton.onclick = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < su.length) {
    loadQuestion(su);
  } else {
    showResult();
  }
};

function showResult() {
  questionElement.style.display = "none";
  questionImage.style.display = "none";
  optionsElement.style.display = "none";
  nextButton.style.display = "none";
  resultElement.innerText = `Your score: ${score} out of ${su.length}`;
  resultElement.style.display = "block";
}
