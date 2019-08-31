"use strict";

/*
* This function validates all fields on the Player Details Form.
*/
function validatePlayerDetailsForm(teamGender)
{
    $("#invalidData").empty();

    const emailFormat = /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/;
    const phoneFormat = /^\d{3}-\d{3}-\d{4}$/;

    let displayErrorMessage = [];

    let errorFound = false;

    if (membername.value.trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Name";
        errorFound = true;
    }

    if (contactname.value.trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Contact Name";
        errorFound = true;
    }

    if (email.value.trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Email Address";
        errorFound = true;
    }
    else
    {
        if (emailFormat.test(email.value))
        {
        }
        else
        {
            displayErrorMessage[displayErrorMessage.length] = "Inavlid Email Address (nnnn@nnn.nnn)";
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
        if ($("input[name='gender']:checked").val() != teamGender)
        {
            displayErrorMessage[displayErrorMessage.length] = "Player's Gender not allowed on this Team.";
        errorFound = true;
        }
    }

    if ((isNaN(age.value)) || (age.value < 18) || (age.value > 70))
    {
        displayErrorMessage[displayErrorMessage.length] = "Player is too young for Team.";
        errorFound = true;
    }
    else
    {
        if (age.value > 70)
        {
            displayErrorMessage[displayErrorMessage.length] = "Player is too old for Team.";
            errorFound = true;
        }
    }

    if (phone.value.trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Phone Number";
        errorFound = true;
    }
    else
    {
        if (phoneFormat.test(phone.value))
        {
        }
        else
        {
            displayErrorMessage[displayErrorMessage.length] = "Invalid Phone Number (999-999-9999)";
            errorFound = true;
        }
    }

    if (position.value == "None")
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
    let urlParams = new URLSearchParams(location.search);
    let teamSelected = urlParams.get("id");

    let teams = JSON.parse(sessionStorage.getItem("teams"));

    let teamsLength = teams.length;

    let leagues = JSON.parse(sessionStorage.getItem("leagues"));

    let leaguesLength = leagues.length;

    let leagueCode;
    let teamGender;

    for (let i = 0; i < teamsLength; i++)
    {
        if (teams[i].TeamId == teamSelected)
        {
            $("#teamname").val(teams[i].TeamName);
            leagueCode = (teams[i].League);
            teamGender = (teams[i].TeamGender)

            for (let i = 0; i < leaguesLength; i++)
            {
                if (leagueCode = leagues[i].Code)
                {
                    $("#leaguecode").val(leagues[i].Name);
                    break;
                }
            }
            break;
        }
    }

    $("#buttonsDiv").append($("<a>", {
        href: "#",
        id: "saveTeamBtn",
        text: "Save",
        class: "col-md-2 btn btn-success btn-sm mb-1 mr-1",
        role: "button"
    }))

    $("#buttonsDiv").append($("<a>", {
        href: "detailsteam.html?id=" + teamSelected,
        id: "cancelBtn",
        text: "Cancel",
        class: "col-md-2 btn btn-danger btn-sm mb-1",
        role: "button"
    }))

    // Save Player Details Button click
    $("#saveTeamBtn").on("click", function ()
    {
        let errorFound = validatePlayerDetailsForm(teamGender);

        if (errorFound)
        {
            return
        }

        // Call Hide Error Function (errors.js)
        hideError($("#invalidData"));

        // Post Add Player Form to API Teams
        $.post("/api/teams/" + teamSelected + "/members/", $("#addPlayerForm").serialize(),
            function (data)
            { })

            .done(function ()
            {
                console.log($("#addPlayerForm").serialize())
                $("#savedModalText").html("Player has been successfully added.")
                    .addClass("text-primary");
                $("#modalBody").append("<b>Team Name: </b>" + $("#teamname").val())
                    .append("<br />")
                    .append("<b>Player Name: </b>" + $("#membername").val());
                $("#savedModal").modal("show");

                // Ok Button click
                $("#okBtn").on("click", function ()
                {
                    location.href = "detailsteam.html?id=" + teamSelected;
                })
            })

            .fail(function ()
            {
                console.log($("#addPlayerForm").serialize())
                $("#savedModalText").html("Failed to Add Player to Team, please try again.")
                    .addClass("text-danger");
                $("#savedModal").modal("show");
            })

        return false;
    })
})