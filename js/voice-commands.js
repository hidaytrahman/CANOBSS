$(document).ready(function () {

    $("#speak-out").on("click", function () {
        $(this).addClass('listner-activated');
        if (annyang) {
            // Let's define our first command. First the text we expect, and then the function it should call
            var commands = {

                'good morning': function () {
                    alert('Hey Good morning');
                },

                'show me notification': function () {
                    alert('notification');
                }
                ,
                'show me my network': function () {
                    alert('network');
                },
                'what has changed in my network': function () {
                    alert('changed in my network');
                },
                'what are top five anomalous nodes': function () {
                    alert('Its anomalous nodes');
                }
                ,
                'All the nodes in the database limit to 2': function () {
                    alert('limit to 2');
                }
                ,
                'all the nodes connected with the node 1.2.3.4': function () {
                    alert('node 1.2.3.4');
                }

            };

            // Add our commands to annyang
            annyang.addCommands(commands);

            setInterval(function () {
                console.log('isListening()', annyang.isListening());
            }, 1000)



            // Start listening. You can call this here, or attach this call to an event, button, etc.
            annyang.start({
                continuous: false
            });


            annyang.addCallback('resultMatch', function (userSaid, commandText, phrases) {
                console.log(userSaid); // sample output: 'hello'
                $("#write-command").val(userSaid);
            });
        } else {
            alert('Issue with MIC');
        }
    });

});
