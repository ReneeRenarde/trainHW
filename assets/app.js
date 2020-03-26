$(document).ready(function(){
    
  //FIREBASE=========================================================
   // Your web app's Firebase configuration
   var firebaseConfig = {
    apiKey: "AIzaSyAP4iSvAf12ZShUenOj89Enh0f7PeZVZEU",
    authDomain: "tryagain-trains.firebaseapp.com",
    databaseURL: "https://tryagain-trains.firebaseio.com",
    projectId: "tryagain-trains",
    storageBucket: "tryagain-trains.appspot.com",
    messagingSenderId: "639684800919",
    appId: "1:639684800919:web:720987a74fe706e201d4d2"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

    //VARIABLES=========================================================
    var database = firebase.database();

    //CONVERT TRAIN TIME================================================
    var currentTime = moment();
    console.log("Current Time: " + currentTime);

    //FUNCTIONS=========================================================

    // // Prevent Default
    // $("#submit").on("click", function(event) {
    //     event.preventDefault();

    // CAPTURE BUTTON CLICK
    $("#submit").on("click", function() {
    
    //grabs user input
        var name = $('#nameInput').val().trim();
        var dest = $('#destInput').val().trim();
        var time = $('#timeInput').val().trim();
        var freq = $('#freqInput').val().trim();
    
    // Creates local "temporary" object for holding train data
    var trainAdded =   {
            name: name,
            destination: dest,
            time: time,
            freqruency: freq,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
    };
    
    // push train data to database
    database.ref().push(trainAdded)

        // NO REFRESH
        $("input").val('');
        return false;
    });
    
    //ON CLICK CHILD FUNCTION
    database.ref().on("child_added", function(childSnapshot){
        // console.log(childSnapshot.val());
        var name = childSnapshot.val().name;
        var dest = childSnapshot.val().dest;
        var time = childSnapshot.val().time;
        var freq = childSnapshot.val().freq;
    
        console.log("Name: " + name);
        console.log("Destination: " + dest);
        console.log("Time: " + time);
        console.log("Frequency: " + freq);
        //console.log(moment().format("HH:mm"));
    
    //CONVERT TRAIN TIME================================================
        var freq = parseInt(freq);
       
        //CURRENT TIME
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment().format('HH:mm'));
       
        //FIRST TIME: PUSHED BACK ONE YEAR TO COME BEFORE CURRENT TIME
        // var dConverted = moment(time,'hh:mm').subtract(1, 'years');
        var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
        console.log("DATE CONVERTED: " + dConverted);
        var trainTime = moment(dConverted).format('HH:mm');
        console.log("TRAIN TIME : " + trainTime);
        
        //DIFFERENCE B/T THE TIMES 
        var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
        var tDifference = moment().diff(moment(tConverted), 'minutes');
        console.log("DIFFERENCE IN TIME: " + tDifference);
      
        //REMAINDER 
        var tRemainder = tDifference % freq;
        console.log("TIME REMAINING: " + tRemainder);
      
        //MINUTES UNTIL NEXT TRAIN
        var minsAway = freq - tRemainder;
        console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
      
        //NEXT TRAIN
        var nextTrain = moment().add(minsAway, 'minutes');
        console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
        
    
     //TABLE DATA
     //APPEND TO DISPLAY IN TRAIN TABLE
    $('#currentTime').text(currentTime);
    $('#trainTable').append(
            "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
            "</td><td id='destDisplay'>" + childSnapshot.val().dest +
            "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
            "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
            "</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
     },
    
    function(errorObject){
        console.log("Read failed: " + errorObject.code)
    });
    
    // database.ref().orderByChild("timeAdded").limitToLast(1).on("child_added", function(snapshot){
    //     // Change the HTML to reflect
    //     $("#nameDisplay").html(snapshot.val().name);
    //     $("#destDisplay").html(snapshot.val().dest);
    //     $("#timeDisplay").html(snapshot.val().time);
    //     $("#freqDisplay").html(snapshot.val().freq);
    // })
    
    }); //END DOCUMENT.READY