
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBdM92H4MBJ5N1SvTqMBbleOW46qLBPKcU",
    authDomain: "mp-rps-8fccc.firebaseapp.com",
    databaseURL: "https://mp-rps-8fccc.firebaseio.com",
    projectId: "mp-rps-8fccc",
    storageBucket: "",
    messagingSenderId: "680192097997"
};
firebase.initializeApp(config);

(function rpsGame() {

    var database = firebase.database();
    var playerOne = undefined;
    var playerTwo = undefined;
    var userPlayer = 0;


    function Player(name, position) {
        this.name = name;
        this.wins = 0;
        this.losses = 0;
        this.position = position;
        this.choice = null;
    }

    function updateState() {

        database.ref().once("value", function (snapshot) {

            if (snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists()) {
                playerOne = snapshot.child("playerOne").val();
                updatePlayerDisplay(playerOne);
                playerTwo = snapshot.child("playerTwo").val();
                updatePlayerDisplay(playerTwo);
                console.log("both player texts updated");
            } else if (snapshot.child("playerOne").exists()) {
                console.log("updating player one text");
                playerOne = snapshot.child("playerOne").val();
                $("#player-2-name").text("Waiting on Player");
                updatePlayerDisplay(playerOne);
            } else if (snapshot.child("playerTwo").exists()) {
                console.log("updating player two text");
                playerTwo = snapshot.child("playerTwo").val();
                $("#player-1-name").text("Waiting on Player");
                updatePlayerDisplay(playerTwo);
            } else {
                $("#player-1-name").text("Waiting on Player");
                $("#player-2-name").text("Waiting on Player");
            }
        });

    }

    function updatePlayerDisplay(player) {
        if (player.position === 1 && userPlayer === 1) {
            $("#player-1-name").text(player.name);
            addP1Options();
            $("#player-1-stats").text("Wins: " + player.wins + " Losses: " + player.losses);
            database.ref("turn").set(1);
        } else if (player.position === 1) {
            $("#player-1-name").text(player.name);
            $("#player-1-stats").text("Wins: " + player.wins + " Losses: " + player.losses);
        } else if (player.position === 2 && userPlayer === 2) {
            $("#player-2-name").text(player.name);
            addP2Options();
            $("#player-2-stats").text("Wins: " + player.wins + " Losses: " + player.losses);
        } else if (player.position === 2) {
            $("#player-2-name").text(player.name);
            $("#player-2-stats").text("Wins: " + player.wins + " Losses: " + player.losses);
        }
    };

    function addP1Options() {

        var rock = $("<h3>");
        rock.text("Rock");
        rock.attr("data-choice", "rock");
        rock.attr("id", "rock");
        rock.addClass("item");

        var paper = $("<h3>");
        paper.text("Paper");
        paper.attr("data-choice", "paper");
        paper.attr("id", "paper");
        paper.addClass("item");

        var scissors = $("<h3>");
        scissors.text("Scissors");
        scissors.attr("data-choice", "scissors");
        scissors.attr("id", "scissors");
        scissors.addClass("item");

        var choices = $("#player-1-choices");
        choices.empty();
        choices.append(rock);
        choices.append(paper);
        choices.append(scissors);

    };

    function addP2Options() {

        var rock = $("<h3>");
        rock.text("Rock");
        rock.attr("data-choice", "rock");
        rock.attr("id", "rock");
        rock.addClass("item");

        var paper = $("<h3>");
        paper.text("Paper");
        paper.attr("data-choice", "paper");
        paper.attr("id", "paper");
        paper.addClass("item");

        var scissors = $("<h3>");
        scissors.text("Scissors");
        scissors.attr("data-choice", "scissors");
        scissors.attr("id", "scissors");
        scissors.addClass("item");

        var choices = $("#player-2-choices");
        choices.empty();
        choices.append(rock);
        choices.append(paper);
        choices.append(scissors);

    };

    function compareChoices() {

        database.ref().once('value').then(function (snapshot) {

            var p1Choice
            var p2Choice

            p1Choice = snapshot.val().playerOne.choice;
            p2Choice = snapshot.val().playerTwo.choice;

            $("#player-1-item").text("Player one chooses: " + p1Choice);
            $("#player-2-item").text("Player two chooses: " + p2Choice);

            if (p1Choice == "rock") {
                if (p2Choice == "rock") {
                    $("#result").text("Tie Game.");
                } else if (p2Choice == "paper") {
                    $("#result").text("Player One wins.");
                    playerOne.wins++;
                    database.ref("playerOne/wins").set(playerOne.wins);
                    playerTwo.losses++;
                    database.ref("playerTwo/losses").set(playerTwo.losses);
                } else if (p2Choice == "scissors") {
                    $("#result").text("Player Two wins.");
                    playerTwo.wins++;
                    database.ref("playerOne/wins").set(playerTwo.wins);
                    playerOne.losses++;
                    database.ref("playerTwo/losses").set(playerOne.losses);
                }
            } else if (p1Choice == "paper") {
                if (p2Choice == "rock") {
                    $("#result").text("Player One wins.");
                    playerOne.wins++;
                    database.ref("playerOne/wins").set(playerOne.wins);
                    playerTwo.losses++;
                    database.ref("playerTwo/losses").set(playerTwo.losses);
                } else if (p2Choice == "paper") {
                    $("#result").text("Tie Game.");
                } else if (p2Choice == "scissors") {
                    $("#result").text("Player Two wins.");
                    playerTwo.wins++;
                    database.ref("playerOne/wins").set(playerTwo.wins);
                    playerOne.losses++;
                    database.ref("playerTwo/losses").set(playerOne.losses);
                }
            } else if (p1Choice == "scissors") {
                if (p2Choice == "rock") {
                    $("#result").text("Player Two wins.");
                    playerTwo.wins++;
                    database.ref("playerOne/wins").set(playerTwo.wins);
                    playerOne.losses++;
                    database.ref("playerTwo/losses").set(playerOne.losses);
                } else if (p2Choice == "paper") {
                    $("#result").text("Player One wins.");
                    playerOne.wins++;
                    database.ref("playerOne/wins").set(playerOne.wins);
                    playerTwo.losses++;
                    database.ref("playerTwo/losses").set(playerTwo.losses);
                } else if (p2Choice == "scissors") {
                    $("#result").text("Tie Game.");
                }
            }

            setTimeout(reset, 5000);
        });
    };

    function reset() {
        database.ref("turn").set(1);
        $("#player-1-item").text("");
        $("#player-2-item").text("");
        $("#result").text("");
        updateState();

    }

    $("#player-submit").on("click", function (event) {

        if (playerOne === undefined && userPlayer === 0) {
            var playerName = $("#enter-name").val().trim();
            playerOne = new Player(playerName, 1);
            userPlayer = 1;
            $("#player-1-name").text(playerOne.name);
            database.ref("playerOne").set(playerOne);
        } else if (playerTwo === undefined && userPlayer === 0) {
            var playerName = $("#enter-name").val().trim();
            playerTwo = new Player(playerName, 2);
            userPlayer = 2;
            $("#player-2-name").text(playerTwo.name);
            database.ref("playerTwo").set(playerTwo);
        } else {
            $('#fullModal').modal();
        }
        event.preventDefault();
    });

    $(document).on("click", ".item", function () {
        console.log("rps clicked");
        if (userPlayer === 1 && playerTwo !== undefined) {
            playerOne.choice = $(this).attr("data-choice");
            database.ref("playerOne/choice").set(playerOne.choice);
            database.ref("turn").set(2);
        } else if (userPlayer === 2 && turn == 2) {
            playerTwo.choice = $(this).attr("data-choice");
            database.ref("playerTwo/choice").set(playerTwo.choice);
            database.ref("turn").set(3);
        } else {
            $("#noP2Modal").modal();
        }
    });

    window.onbeforeunload = function () {
        if (userPlayer === 1) {
            console.log("player one removed");
            playerOne = undefined;
            database.ref("playerOne").remove();
        } else if (userPlayer === 2) {
            console.log("player two removed");
            playerTwo = undefined;
            database.ref("playerTwo").remove();
        }
        updateState();
    };


    database.ref().on("child_added", function () {
        console.log("player added");
        updateState();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    database.ref().on("child_removed", function () {
        console.log("player removed");
        updateState();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    /*     database.ref("playerOne/choice").on("value", function(snapshot) {
            if (snapshot.val() !== null) {
                $("#player-1-item").text("Player one chooses: " + snapshot.val());
            } else {
                $("#player-1-item").text("");
                $("#player-2-item").text("");
            }
        }); */

    database.ref("turn").on("value", function (snapshot) {
        turn = snapshot.val();

        if (turn == 3) {
            compareChoices();
        }
    });

    updateState();

})();