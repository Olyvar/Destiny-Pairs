"use strict";

// Create firebase reference
var leaderboardRef = new Firebase("https://destiny-pairs.firebaseio.com/");

var pairsGame = {

    init: function(pairs) {

        pairs.forEach(function (obj) {
            pairs.push(obj);
        });

        var usernameInput = document.getElementById("js-username");
        var startButton = document.querySelector(".js-start-btn");
        var firstScreen = document.querySelector(".caption-game-start");
        startButton.addEventListener("click", enterName);

        function enterName(){
            var username = usernameInput.value;
            startGame(pairs, username);
        }

        function startGame(pairs, username) {

            // retrieve leaderboard from FB and build

            var tableHeader = document.querySelector('.table-header');
            var tableFooter = document.querySelector('.table-footer');
            var leaderboardTable = tableHeader.parentNode;

            leaderboardRef.orderByChild("score").once("value", function(snapshot){

                var htmlString = ""

                snapshot.forEach(function(data){
                    var leaderboardRow = document.createElement('tr');
                    htmlString = buildLeaderboard(data);
                    leaderboardRow.innerHTML = htmlString;
                    leaderboardTable.insertBefore(leaderboardRow, tableHeader.nextSibling);
                });


            });



            var mask = document.querySelector(".mask");
            hide(mask);
            hide(firstScreen);

            var shuffledPairs = shuffle(pairs);

            // ----------- Set up Variables -------------\\
            var gameTime = 60;
            var score = 10000;
            var view = document.getElementById("view");
            var scoreContainer = document.getElementById("js-score");
            var endScoreContainer = document.getElementById("js-end-score");
            updateScore();

            var pairsRemaining = 1;
            var pairsRemainingContainer = document.getElementById("js-pairs-remaining");
            pairsRemainingContainer.innerHTML = pairsRemaining;

            var flipContainer = document.querySelector(".flip-container-template").querySelector(".flip-container");

            // build cards and immediately render
            view.innerHTML = shuffledPairs.map(function(card){
                flipContainer.setAttribute("card", card.name);
                flipContainer.querySelector(".front").style.backgroundImage = "url('" + card.url + "')";
                return flipContainer.outerHTML;
            }).join("");

            var renderedCards = document.querySelectorAll(".flip-container");

            for (var i = 0; i < renderedCards.length; i++) {
                renderedCards[i].addEventListener("click", cardFlipAndCheck);
            }

            // function to run when card is clicked
            function cardFlipAndCheck(e) {
                // check if you are clicking the same card
                if(e.currentTarget.classList.contains("flip")){
                    return;
                }
                e.currentTarget.classList.toggle("flip");
                // Run card flip function element
                twoCardsFlipped(e.currentTarget);
            }

            var elements = [];
            var cardsFlipped = 0;

            function twoCardsFlipped(element) {
                elements.push(element);
                cardsFlipped++;

                if (cardsFlipped === 2) {

                    setTimeout(checkAttributes, 700, elements);

                    // Reset temporary variables
                    elements = [];
                    cardsFlipped = 0;
                }
            }

            function checkAttributes(elements) {
                if (elements[0].getAttribute("card") === elements[1].getAttribute("card")) {

                    increaseScore();

                    elements.forEach(function (pair) {
                        pair.classList.add("fade-out");
                        pair.removeEventListener("click", cardFlipAndCheck);
                    });

                    pairsRemaining--;
                    pairsRemainingContainer.innerHTML = pairsRemaining;

                    if (pairsRemaining === 0) {
                        endScoreContainer.innerHTML = score;
                        gameEnd(true, gameTime);
                    }

                } else {
                    decreaseScore();
                    elements.forEach(function (card) {
                        card.classList.toggle("flip");
                    });
                }
            }

            function gameEnd(gameWon, timeRemaining){
                var gameWonCaption = mask.querySelector(".caption-game-won");
                var gameLostCaption = mask.querySelector(".caption-game-lost");
                show(mask);
                if(gameWon){
                    timeRemainingContainer.innerHTML = timeRemaining;
                    show(gameWonCaption);
                    hide(gameLostCaption);
                    addToLeaderboardArray();
                } else {
                    hide(gameWonCaption);
                    show(gameLostCaption);
                }
                clearInterval(int);
            }

            function decreaseScore(){
                score -= 250;
                updateScore();
            }

            function increaseScore(){
                score += 500;
                updateScore();
            }

            function updateScore(){
                scoreContainer.innerHTML = score;
            }

            // Timer functionality
            var timer = document.getElementById('js-timer');
            timer.innerHTML = gameTime;
            var timeRemainingContainer = document.getElementById("js-time-remaining");

            var int;

            (function countDown(i) {
                int = setInterval(function () {
                    i--;
                    timer.innerHTML = i;

                    score -= 51;
                    updateScore();

                    // Need to track gameTime to output it when game is won
                    gameTime = i;
                    // Out of time if statement
                    if (i === 0) {
                        gameEnd();
                    }
                }, 1000);
            }(gameTime));

            // Restart game functionality

            var restartBtn = document.querySelectorAll(".js-restart");

            for (var i = 0; i < restartBtn.length; i++) {
                restartBtn[i].addEventListener("click", restartGame)
            }

            function restartGame() {
                hide(mask);
                startGame(pairs, username);
            }

            function addToLeaderboardArray(){
                var leaderboardObj = {
                    username: username,
                    score: score,
                    timeRemaining: gameTime
                }
                leaderboardRef.push(leaderboardObj);
                updateLeaderboard();
            }


            function updateLeaderboard(){
                var leaderboardRow = document.createElement('tr');
                leaderboardRef.endAt().limitToLast(1).on("child_added", function(snapshot) {
                    leaderboardRow.innerHTML = buildLeaderboard(snapshot);
                });
                leaderboardTable.insertBefore(leaderboardRow, tableFooter);
            }

            function buildLeaderboard(snapshot){
                var newRow = snapshot.val();
                var htmlString = "<td>" + newRow.username + "</td>" + "<td>" + newRow.score +"</td><td>" + newRow.timeRemaining + " Seconds</td>";
                return htmlString;
            }



        }

    }

};




// Third-party shuffle array function

function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

function hide(element){
    element.classList.add("hidden");
}

function show(element){
    element.classList.remove("hidden");
}