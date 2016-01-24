var pairs = [
    {name: "crotas-end", url: "pairs-images/crotas-end.jpg"},
    {name: "nightstalker", url: "pairs-images/nightstalker.jpg"},
    {name: "handcannon", url: "pairs-images/handcannon.jpg"},
    {name: "hunter", url: "pairs-images/hunter.jpg"},
    {name: "guardians", url: "pairs-images/guardians.jpg"},
    {name: "main-destiny", url: "pairs-images/main-destiny.jpg"}
];

// Duplicate each object
pairs.forEach(function(v,i,arr){
    arr.push(v);
});


function startGame() {

    var gameTime = 60;

    //--- timer functionality ---//
    var timer = document.getElementById('js-timer');
    timer.innerHTML = gameTime;
    var mask = document.querySelector(".mask");
    var timeRemainingContainer = document.getElementById("js-time-remaining");

    // define interval variable here to give us access to it later
    var int;

    function countDown(i) {
            int = setInterval(function () {
            i--;
            document.getElementById('js-timer').innerHTML = i;

            // need to track gameTime to output it when game is won
            gameTime = i;

            // out of time if statement
            if (i === 0) {
                clearInterval(int);
                mask.classList.remove("hidden");
                mask.firstElementChild.classList.remove("hidden");
            }
        }, 1000);
    }

    countDown(gameTime);

    // ----------- VIEW -------------\\

    var cardTemplate = "<div class='flip-container'><div class='flipper'><div class='back'></div><div class='front'></div></div></div>";
    var view = document.getElementById("view");
    var cardsHtmlString = "";
    var pairsRemaining = (pairs.length / 2);
    var pairsRemainingContainer = document.getElementById("js-pairs-remaining");
    pairsRemainingContainer.innerHTML = pairsRemaining;

    pairs.forEach(function () {
        cardsHtmlString += cardTemplate;
    });

    view.innerHTML = cardsHtmlString;

    var allCards = document.querySelectorAll(".flip-container");
    var shuffledPairs = shuffle(pairs);

    // Loop over cards, adding the correct background image, correct custom attribute, and adding the event listener to flip the card

    for (var i = 0; i < allCards.length; i++) {
        allCards[i].setAttribute("card", shuffledPairs[i].name);
        allCards[i].firstChild.lastChild.style.backgroundImage = "url('" + shuffledPairs[i].url + "')";
        allCards[i].addEventListener("click", cardFlipAndCheck);
    }

    // function to run when card is clicked
    function cardFlipAndCheck(e) {
        e.currentTarget.classList.toggle("flip");
        // Run card flip function passing the value of the custom attribute to the two temp vars to check the pairs
        twoCardsFlipped(e.currentTarget.getAttribute("card"), e.currentTarget);
    }

    var tempCardArray = [];
    var elements = [];
    var cardsFlipped = 0;

    function twoCardsFlipped(customAttribute, element) {
        tempCardArray.push(customAttribute);
        elements.push(element);
        cardsFlipped++;

        if(cardsFlipped === 2) {

            setTimeout(checkAttributes, 700, tempCardArray[0], tempCardArray[1], elements);

            // reset temporary variables
            elements = [];
            tempCardArray = [];
            cardsFlipped = 0;
        }
    }

    function checkAttributes(cardOneVal, cardTwoVal, elements) {
        if (cardOneVal === cardTwoVal) {
            elements.forEach(function (pair) {
                pair.classList.add("fade-out");
                pair.removeEventListener("click", cardFlipAndCheck);
            });

            pairsRemaining--;
            pairsRemainingContainer.innerHTML = pairsRemaining;

            if (pairsRemaining === 0) {
                gameWon(gameTime);
            }

        } else {
            elements.forEach(function (card) {
                card.classList.toggle("flip");
            });
        }
    }

    function gameWon(timeRemaining) {
        mask.classList.remove("hidden");
        mask.firstElementChild.nextElementSibling.classList.remove("hidden");
        timeRemainingContainer.innerHTML = timeRemaining;
        clearInterval(int);
    }

}

startGame();


// Restart game functionality

var restartBtn = document.querySelectorAll(".js-restart");

for(var i =0; i < restartBtn.length; i++){
    restartBtn[i].addEventListener("click", restartGame)
}

function restartGame(e){
    e.target.parentNode.parentNode.classList.add("hidden");
    startGame();
}



// third-party shuffle array function

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


	