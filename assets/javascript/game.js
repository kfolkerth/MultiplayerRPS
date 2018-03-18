
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
    }

    function updateState() {
        
        console.log("update");
        database.ref().once("value", function(snapshot) {

            if(snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists()) {
                playerOne = snapshot.child("playerOne").val();
                updatePlayerDisplay(playerOne);
                playerTwo = snapshot.child("playerTwo").val();
                updatePlayerDisplay(playerTwo);
            } else if (snapshot.child("playerOne").exists()) {
                updatePlayerDisplay(snapshot.child("playerOne").val());
                playerOne = snapshot.child("playerOne").val();
            } else if (snapshot.child("playerTwo").exists()) {
                playerTwo = snapshot.child("playerTwo").val();
                updatePlayerDisplay(playerTwo);
            }
        });

    }

    function updatePlayerDisplay(player) {
        if (player.position === 1) {
            $("#player-1-name").text(player.name);
        } else {
            $("#player-2-name").text(player.name);
        }
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

    database.ref().on("value", updateState);

    window.onbeforeunload = function() {
        console.log("unload");
        if (userPlayer === 1) {
            database.ref("playerOne").remove();
            playerOne = undefined;
            $("#player-1-name").text("Waiting for Player");
        } else if (userPlayer === 2) {
            database.ref("playerTwo").remove();
            playerOne = undefined;
            $("#player-2-name").text("Waiting for Player");
        }
    };

    updateState();

})();