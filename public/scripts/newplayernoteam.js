"use strict";

/*
* This function validates all fields on the Player Details Form.
*/
function validatePlayerDetailsForm(teamGender, teamMinAge, teamMaxAge)
{
    $("#invalidData").empty();

    const emailFormat = /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/;
    const phoneFormat = /^\d{3}-\d{3}-\d{4}$/;

    let displayErrorMessage = [];

    let errorFound = false;

    if ($("#membername").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Name";
        errorFound = true;
    }

    if ($("#contactname").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Contact Name";
        errorFound = true;
    }

    if ($("#email").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Email Address";
        errorFound = true;
    }
    else
    {
        if (emailFormat.test($("#email").val()))
        {
        }
        else
        {
            displayErrorMessage[displayErrorMessage.length] = "Invalid Email Address (nnnn@nnn.nnn)";
            errorFound = true;
        }
    }

    if ($("input[name='gender']:checked").val() == null)
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Gender";
        errorFound = true;
    }
    else
    {
        if (teamGender == "Any")
        {
        }
        else
        {
            if ($("input[name='gender']:checked").val() != teamGender)
            {
                displayErrorMessage[displayErrorMessage.length] = "Player's Gender not allowed on this Team.";
                errorFound = true;
            }
        }
    }

    if ($("#age").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Age";
        errorFound = true;
    }
    else
    {
        if ((isNaN($("#age").val())) || ($("#age").val() < teamMinAge))
        {
            displayErrorMessage[displayErrorMessage.length] = "Player is too young for Team. Min Age is " + teamMinAge + ".";
            errorFound = true;
        }
        else
        {
            if ($("#age").val() > teamMaxAge)
            {
                displayErrorMessage[displayErrorMessage.length] = "Player is too old for Team. Max Age is " + teamMaxAge + ".";
                errorFound = true;
            }
        }
    }

    if ($("#phone").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Phone Number";
        errorFound = true;
    }
    else
    {
        if (phoneFormat.test($("#phone").val()))
        {
        }
        else
        {
            displayErrorMessage[displayErrorMessage.length] = "Invalid Phone Number (999-999-9999)";
            errorFound = true;
        }
    }

    if ($("#position").val() == "None")
    {
        displayErrorMessage[displayErrorMessage.length] = "Must select a Position";
        errorFound = true;
    }

    if ($("input[name='shoots']:checked").val() == null)
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Shoots";
        errorFound = true;
    }

    // Call Display Errors Function (errors.js)
    displayErrors($("#invalidData"), displayErrorMessage, errorFound);

    return errorFound;
}

//Connect Events to HTML Elements
$(function ()
{
    let teamGender;
    let teamMinAge;
    let teamMaxAge;
    let popOverGender;

    $("*", "#addPlayerForm").prop("disabled", true);

    let page = sessionStorage.getItem("page");

    let leagues = JSON.parse(sessionStorage.getItem("leagues"));

    let leaguesLength = leagues.length;

    for (let i = 0; i < leaguesLength; i++)
    {
        let option = $("<option>",
            {
                val: leagues[i].Code,
                text: leagues[i].Name
            })
        $("#leaguecode").append(option);
    }

    $("#leaguecode").on("change", function ()
    {
        if ($("#leaguecode").val() == "None")
        {
            $("*", "#addPlayerForm").prop('disabled', true);
            $("#teamFullDiv").hide();
            $("#teamname").empty();
            $("#saveTeamBtn").hide();
            $('#popoverData').popover('dispose');

            let option = $("<option>", { val: "None", text: "Select one" })
            $("#teamname").append(option);
        }
        else
        {
            $("#teamname").empty();
            $('#popoverData').popover('dispose');

            let option = $("<option>", { val: "None", text: "Select one" })
            $("#teamname").append(option);

            // Get all data from API All Teams
            $.getJSON("/api/teams",
                function (teams)
                {
                    let teamsLength = teams.length;

                    for (let i = 0; i < teamsLength; i++)
                    {
                        if (teams[i].League == $("#leaguecode").val())
                        {
                            let option = $("<option>",
                                {
                                    val: teams[i].TeamId,
                                    text: teams[i].TeamName
                                })
                            $("#teamname").append(option);
                        }
                    }
                })
        }
    })

    $("#teamname").on("change", function ()
    {
        if ($("#teamname").val() == "None")
        {
            $("*", "#addPlayerForm").prop('disabled', true);
            $("#teamFullDiv").hide();
            $("#saveTeamBtn").hide();
            $("#teamgender").val("");
            $("#minmemberage").val("");
            $("#maxmemberage").val("");
            $('#popoverData').popover('dispose');
        }
        else
        {
            // Get all data from Teams by Team Id JSON file
            $.getJSON("/api/teams/" + $("#teamname").val(),
                function (details)
                {
                    teamGender = details.TeamGender
                    teamMinAge = details.MinMemberAge;
                    teamMaxAge = details.MaxMemberAge;

                    if (details.TeamGender == "Any")
                    {
                        popOverGender = "Coed";
                    }
                    
                    $('#popoverData').popover('dispose');

                    if (details.Members.length == details.MaxTeamMembers)
                    {
                        $("*", "#addPlayerForm").prop('disabled', true);
                        $("#teamFullDiv").show();
                        $("#saveTeamBtn").hide();

                        $("#popoverData").popover({
                            content: "<b>Min Age - " + teamMinAge + "<br/>Max Age - " + teamMaxAge + "</br>Gender - " + popOverGender + "</b>",
                            html: true
                        });
                    }
                    else
                    {
                        $("*", "#addPlayerForm").prop('disabled', false);
                        $("#teamFullDiv").hide();
                        $("#saveTeamBtn").show();
                        
                        $("#popoverData").popover({
                            content: "<b>Min Age - " + teamMinAge + "<br/>Max Age - " + teamMaxAge + "</br>Gender - " + popOverGender + "</b>",
                            html: true
                        });
                        
                    }
                })
        }
    })

    $("#buttonsDiv").append($("<a>", {
        href: "#",
        id: "saveTeamBtn",
        text: "Save",
        class: "col-md-2 btn btn-success btn-sm mb-1 mr-1",
        role: "button"
    }))

    $("#saveTeamBtn").hide();

    $("#buttonsDiv").append($("<a>", {
        href: page + ".html",
        id: "cancelBtn",
        text: "Cancel",
        class: "col-md-2 btn btn-danger btn-sm mb-1",
        role: "button"
    }))

    // Save Player Details Button click
    $("#saveTeamBtn").on("click", function ()
    {
        let errorFound = validatePlayerDetailsForm(teamGender, teamMinAge, teamMaxAge);

        if (errorFound)
        {
            return
        }

        // Call Hide Error Function (errors.js)
        hideError($("#invalidData"));

        // Post Add Player Form to API Teams
        $.post("/api/teams/" + $("#teamname").val() + "/members/", $("#addPlayerForm").serialize(),
            function (data)
            { })

            .done(function ()
            {
                $("#savedModalText").html("Player has been successfully added.")
                    .addClass("text-primary");
                $("#modalBody").append("<b>Division: </b>" + $("#leaguecode").val())
                    .append("<br />")
                    .append("<b>Team Name: </b>" + $("#teamname  option:selected").text())
                    .append("<br />")
                    .append("<b>Player Name: </b>" + $("#membername").val());
                $("#savedModal").modal("show");

                // Ok Button click
                $("#okBtn").on("click", function ()
                {
                    location.href = "detailsteam.html?id=" + $("#teamname").val();
                })
            })

            .fail(function ()
            {
                $("#savedModalText").html("Failed to Add Player to Team, please try again.")
                    .addClass("text-danger");
                $("#savedModal").modal("show");
            })

        return false;
    })
})