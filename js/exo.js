import { updateProgressBar, updateProgressBarPairs } from './components/progressBar.js';
import { RandomPairs } from './components/randomPairs.js';
import { CountdownTimer } from './components/countdownTimer.js';
import { getOperatorSymbols } from './components/operatorSymbols.js';
import { QuizLocalStorage } from './components/localStorage.js';
import { todoListItem } from "./components/todoList.js";
class Quiz {
    constructor(options) {
        this.numOfQuestions = options.numOfQuestions;
        this.secondsChrono = options.secondsChrono;
        this.countdownMode = options.countdownMode;
        this.selectedValues = options.selectedValues;
        this.operationType = options.operationType;
        this.saveResult = options.saveResult;
        this.pairs = new RandomPairs(this.numOfQuestions, this.selectedValues).pairs.map(pair => ({ factors: pair }));
        this.currentQuestionIndex = 0;
        this.remainingDuration = this.secondsChrono;
        this.numCorrectAnswers = 0;
        this.numIncorrectAnswers = 0;
        this.currentPair = null;
        this.submitHandler = null;
        this.progressBar = document.querySelector('.pb-count-pairs');
        this.updateCounter(); // appel de la méthode pour initialiser la div du compteur

        this.timer = new CountdownTimer(
            this.secondsChrono,
            (duration) => {
                this.remainingDuration = duration;
                this.updateCounter(); // appel de la méthode à chaque fois que le compteur est mis à jour
            },
            () => {
                if (this.countdownMode === "all") {
                    this.timerFinished = true;
                }
                this.submitAnswer();
            },
            'changing'
        );
        // Récupération des éléments HTML
        this.accueilSection = document.getElementById("accueil");
        this.exercicesSection = document.getElementById("exercices");
        this.resultatsSection = document.getElementById("resultats");

        this.quizProperties = {
            operationType: this.operationType,
            countdownMode: this.countdownMode,
            secondsChrono: this.secondsChrono,
            numOfQuestions: this.numOfQuestions
        };
        const { operatorSymbolString, operatorSymbol } = getOperatorSymbols(this.operationType);
        this.operatorSymbolString = operatorSymbolString;
        this.operatorSymbol = operatorSymbol;
    }
    // méthode pour mettre à jour la div du compteur
    updateCounter() {
        const counterDiv = document.querySelector('#countdown span');
        counterDiv.textContent = this.remainingDuration;
        if (this.remainingDuration <= 5) {
            counterDiv.style.color = "#dc3545";
        } else {
            counterDiv.style.color = "#007bff";
        }
    }
    start() {
        this.afficherExercices();
        for (let i = 0; i < this.pairs.length; i++) {
            this.pairs[i] = this.createExerciseObject(this.pairs[i], this.operationType);
        }
        if (this.countdownMode === "all") {
            this.timer.start();
        }
        this.showQuestion();
    }

    stop() {
        if (this.countdownMode === "all") {
            this.timer.stop();
            if (this.numCorrectAnswers + this.numIncorrectAnswers < this.numOfQuestions) {
                // Calcul du score
                let score = `${this.numCorrectAnswers + this.numIncorrectAnswers} / ${this.numOfQuestions}`;

                // Modifier le texte et la classe du modal pour afficher le score et utiliser la classe 'danger'
                $('#modalMessage').text(`Temps écoulé. Votre score : ${score}`).removeClass('text-success').addClass('text-danger');

                // Lancer le modal
                $('#modalChronoFinished').modal('show');
            } else {
                // Modifier le texte et la classe du modal pour afficher le message de réussite et utiliser la classe 'success'
                $('#modalMessage').text('Bravo !').removeClass('text-danger').addClass('text-success');

                // Lancer le modal
                $('#modalChronoFinished').modal('show');
            }
        }
        if (!this.isQuizFinished) {
            this.isQuizFinished = true;
            this.afficherRésultats();
            //Enleve les nulls
            this.pairs = this.pairs.filter(pair => pair.answer !== null);
            // Mettre à jour les informations des paires
            const date = new Date();
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString();
            const quizData = {
                pairs: this.pairs,
                quizProperties: {
                    ...this.quizProperties,
                    date: formattedDate + " à " + formattedTime,
                    id: Date.parse(date)
                }
            };
            // Afficher le score final todoListItem
            const fullList = false;
            const quizResults = new todoListItem(quizData, fullList);
            document.querySelector("#todolist").append(quizResults.result.element);
            //si des réponses existes ont enregistre localStorage
            if (quizResults.result.hasAnswerProp && this.saveResult) {
                QuizLocalStorage.saveResult(quizData);
            }
        }
    }

    submitAnswer() {
        const form = document.querySelector("#formExo");
        const answerStr = form.getx.value.trim(); // trim() pour supprimer les espaces inutiles
        if (this.timerFinished && this.countdownMode === "all" && answerStr === '') {
            this.stop();
        } else {
            const answer = answerStr === '' ? 0 : parseInt(answerStr);
            form.reset();
            this.checkAnswer(answer);
        }
    }
    showQuestion() {
        this.currentPair = this.pairs[this.currentQuestionIndex];
        const [a, b] = this.currentPair.factors;
        const getx = document.getElementById("getx");
        // Récupérer l'élément cible
        var elementCible = document.querySelector('section');

        // Écouteur d'événement pour détecter quand l'utilisateur entre dans un champ de saisie
        getx.addEventListener('focus', function () {
            // Attendre 300 millisecondes (ou ajustez le délai selon vos besoins)
            setTimeout(function () {
                // Faire défiler l'élément cible en haut de la fenêtre
                elementCible.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        });
        getx.focus();
        // Récupération de l'élément span correspondant à l'opérateur
        const operationTypeSpan = document.getElementById("operation");
        operationTypeSpan.textContent = this.operatorSymbolString;
        //Mise à jour des facteurs
        document.getElementById("a").textContent = a;
        document.getElementById("b").textContent = b;
        if (this.countdownMode === "single") {
            this.timer.start();
        }
        updateProgressBarPairs(this.currentQuestionIndex + 1, this.pairs.length);
        const form = document.querySelector("#formExo");
        form.removeEventListener("submit", this.submitHandler); // Supprime l'événement submit précédent
        this.submitHandler = (event) => {
            event.preventDefault();
            this.submitAnswer();
        };
        form.addEventListener("submit", this.submitHandler);
    }
    checkAnswer(answer) {
        const [a, b] = this.currentPair.factors;
        const product = eval(`${a} ${this.operatorSymbol} ${b}`);
        const isCorrect = answer === product;
        //on arrête le compteur si il est par question
        if (this.countdownMode === "single") {
            this.timer.stop();
        }

        // Mettre à jour la réponse de la paire avec la réponse de l'utilisateur
        this.currentPair.answer = answer;

        const answerElement = document.getElementById("answer-alert");
        answerElement.className = "";
        answerElement.innerHTML = ''; // Vider le contenu de l'élément
        if (isCorrect) {
            this.numCorrectAnswers++;
            const icon = document.createElement("i");
            icon.classList.add("bi", "bi-check-circle-fill", "me-2");
            answerElement.append(icon, `Bravo ${a} ${this.operatorSymbolString} ${b} = ${product}`);
            answerElement.classList.add("alert", "alert-success", "form-exo", "m-2");
        } else {
            // Augmenter le nombre de réponses fausses et mettre à jour la barre de progression
            this.numIncorrectAnswers++;
            const icon = document.createElement("i");
            icon.classList.add("bi", "bi-exclamation-triangle-fill", "me-2");
            answerElement.append(icon, `Attention! ${a} ${this.operatorSymbolString} ${b} = ${product}`);
            answerElement.classList.add("alert", "alert-danger", "form-exo", "m-2");
        }



        // Mettre à jour la barre de progression
        const successBar = document.querySelector('.progress-bar.bg-success');
        const dangerBar = document.querySelector('.progress-bar.bg-danger');
        updateProgressBar(successBar, dangerBar, this.numCorrectAnswers, this.numIncorrectAnswers);

        // Passer à la prochaine question
        this.nextQuestion();
    }
    createExerciseObject(pair, operationType) {
        const [a, b] = pair.factors;
        let exerciseObj = {
            factors: [a, b],
            answer: null
        };
        switch (operationType) {
            case "addition":
                break;
            case "soustraction":
                exerciseObj.factors[0] = a + b;
                exerciseObj.factors[1] = a;
                break;
            case "multiplication":
                break;
            case "division":
                exerciseObj.factors[0] = a * b;
                exerciseObj.factors[1] = a;
                break;
            default:
                break;
        }
        return exerciseObj;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (!this.timerFinished && this.currentQuestionIndex < this.pairs.length) {
            this.showQuestion();
        } else {
            this.stop();
        }
    }
    afficherAccueil() {
        // affiche la section accueil
        this.exercicesSection.style.display = "none";
        this.resultatsSection.style.display = "none";
        this.accueilSection.style.display = "block";
    }
    afficherExercices() {
        // affiche la section exercices
        this.accueilSection.style.display = "none";
        this.resultatsSection.style.display = "none";
        this.exercicesSection.style.display = "block";
    }
    afficherRésultats() {
        // affiche la section résultats
        document.getElementById("accueil").style.display = "none";
        document.getElementById("exercices").style.display = "none";
        document.getElementById("resultats").style.display = "block";
    }
}

// Récupération des éléments HTML
const accueilSection = document.getElementById("accueil");
const exercicesSection = document.getElementById("exercices");
const resultatsSection = document.getElementById("resultats");

function afficherAccueil() {
    exercicesSection.style.display = "none";
    resultatsSection.style.display = "none";
    accueilSection.style.display = "block";
}

window.onload = () => {
    afficherAccueil();
}
const checkboxes = document.querySelectorAll("input[type='checkbox'][id^='inlineCheckbox']");
// Tout cocher
document.getElementById('checkAll').addEventListener('click', function () {
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }
});

// Tout décocher
document.getElementById('uncheckAll').addEventListener('click', function () {
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
});

// Modifie le select seconds-chrono quand on click sur countdown-mode-all
document.getElementById('countdown-mode-all').addEventListener('click', function () {
    const secondsChronoElement = document.querySelector('#seconds-chrono');
    secondsChronoElement.value = 60;
});

// Modifie le select seconds-chrono quand on click sur countdown-mode-all
document.getElementById('countdown-mode-single').addEventListener('click', function () {
    const secondsChronoElement = document.querySelector('#seconds-chrono');
    secondsChronoElement.value = 15;
});

const formOption = document.getElementById("countdown-form");

formOption.addEventListener("submit", function (event) {
    event.preventDefault();
    const operationType = document.getElementById("operation-type").value;
    const numOfQuestions = parseInt(document.getElementById("number-of-questions").value);
    const secondsChrono = parseInt(document.getElementById("seconds-chrono").value);
    const countdownMode = document.querySelector('input[name="countdown-mode"]:checked').value; // Chrono pour 1 ou toute les question value = "single" ou "all"
    const checkboxes = document.querySelectorAll("input[type='checkbox'][id^='inlineCheckbox'][value]"); // Sélection de toutes les cases à cocher
    const saveResult = document.getElementById('save-result').checked;
    const selectedValues = Array.from(checkboxes) // Conversion de la NodeList en tableau
        .filter(checkbox => checkbox.checked) // Filtrage des cases cochées
        .map(checkbox => parseInt(checkbox.value)); // Récupération des valeurs en tant qu'entiers
    const quizOptions = {
        numOfQuestions,
        secondsChrono,
        countdownMode,
        selectedValues,
        operationType,
        saveResult
    };
    const quiz = new Quiz(quizOptions);
    quiz.start();
});
