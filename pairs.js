// ---------- MODEL ----------- \\

var pairs = [
    {name: "crotas-end", url: "pairs-images/crotas-end.jpg"},
    {name: "nightstalker", url: "pairs-images/nightstalker.jpg"},
    {name: "handcannon", url: "pairs-images/handcannon.jpg"},
    {name: "handcannon", url: "pairs-images/handcannon.jpg"},
    {name: "nightstalker", url: "pairs-images/nightstalker.jpg"},
    {name: "hunter", url: "pairs-images/hunter.jpg"},
    {name: "guardians", url: "pairs-images/guardians.jpg"},
    {name: "main-destiny", url: "pairs-images/main-destiny.jpg"},
    {name: "hunter", url: "pairs-images/hunter.jpg"},
    {name: "guardians", url: "pairs-images/guardians.jpg"},
    {name: "main-destiny", url: "pairs-images/main-destiny.jpg"},
    {name: "crotas-end", url: "pairs-images/crotas-end.jpg"}
];

// ----------- CONTROLLER ----------- \\



// ----------- VIEW -------------\\

function startGame() {

    // configurable game timer
    var gameTime = 60;


    //--- countdown timer ---//
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


    var cardTemplate = "<div class='flip-container'><div class='flipper'><div class='back'></div><div class='front'></div></div></div>";

    var view = document.getElementById("view");
    var cards = "";

    var pairsRemaining = (pairs.length / 2);
    var pairsRemainingContainer = document.getElementById("js-pairs-remaining");
    pairsRemainingContainer.innerHTML = pairsRemaining;




    pairs.forEach(function () {
        cards += cardTemplate;
    });

    view.innerHTML = cards;

    var allCards = document.querySelectorAll(".flip-container");

    function checkAttributes(cardOneVal, cardTwoVal, elements) {
        if (cardOneVal === cardTwoVal) {
            elements.forEach(function (v) {
                v.classList.add("fade-out");
                v.removeEventListener("click", cardFlipAndCheck);
            });

            pairsRemaining--;
            pairsRemainingContainer.innerHTML = pairsRemaining;
            if(pairsRemaining === 0){
                gameWon(gameTime);
            }
        } else {
            elements.forEach(function (v) {
                v.classList.toggle("flip");
            })
        }
    }

    var tempCardArray = [];
    var elements = [];
    var cardsFlipped = 0;

    function twoCardsFlipped(customAttribute, element) {
        tempCardArray.push(customAttribute);
        elements.push(element);
        cardsFlipped++;

        if (cardsFlipped === 2) {
            //
            setTimeout(checkAttributes, 700, tempCardArray[0], tempCardArray[1], elements);

            // reset variables
            elements = [];
            tempCardArray = [];
            cardsFlipped = 0;
        }
    }

// function to run when card is clicked
    var cardFlipAndCheck = function (e) {
        e.target.parentNode.parentNode.classList.toggle("flip");
        // Run card flip function passing the value of the custom attribute to the two temp vars to check the pairs
        twoCardsFlipped(e.target.parentNode.parentNode.getAttribute("card"), e.target.parentNode.parentNode);
    }

// Loop over cards, adding the correct background image, correct custom attribute, and adding the event listener to flip the card
    for (var i = 0; i < allCards.length; i++) {
        allCards[i].setAttribute("card", pairs[i].name);
        allCards[i].firstChild.lastChild.style.backgroundImage = "url('" + pairs[i].url + "')";
        allCards[i].addEventListener("click", cardFlipAndCheck);
    }



    function gameWon(timeRemaining){
        mask.classList.remove("hidden");
        mask.firstElementChild.nextElementSibling.classList.remove("hidden");
        timeRemainingContainer.innerHTML = timeRemaining;
        clearInterval(int);
    }

}

startGame();

var restartBtn = document.getElementById("js-restart");
restartBtn.addEventListener("click", function(e){
    e.target.parentNode.parentNode.classList.add("hidden");
    startGame();
});



	