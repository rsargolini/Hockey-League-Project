"use strict";

/*
* This function validates all fields on the Player Details Form.
*/
function validatePlayerDetailsForm()
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

    // Call Display Errors Function (errors.js)
    displayErrors($("#invalidData"), displayErrorMessage, errorFound);

    return errorFound;
}

//Connect Events to HTML Elements
$(function ()
{
    let urlParams = new URLSearchParams(location.search);
    let playerSelected = urlParams.get("playerid");

    // Disable all Player Details Fields
    $("*", "#editPlayerForm").prop('disabled', true);

    let teamData = JSON.parse(sessionStorage.getItem("teamData"));

    let teamDataMembersLength = teamData.Members.length;

    let leagues = JSON.parse(sessionStorage.getItem("leagues"));

    let leaguesLength = leagues.length;

    for (let i = 0; i < leaguesLength; i++)
    {
        if (teamData.League = leagues[i].Code)
        {
            $("#leaguecode").val(leagues[i].Name);
            break;
        }
    }

    $("#teamname").val(teamData.TeamName);

    for (let i = 0; i < teamDataMembersLength; i++)
    {
        if (playerSelected == teamData.Members[i].MemberId)
        {
            // Team Information Fieldset
            $("#membername").val(teamData.Members[i].MemberName);
            $("#contactname").val(teamData.Members[i].ContactName);
            $("#email").val(teamData.Members[i].Email);
            $("#gender").val(teamData.Members[i].Gender);
            $("#age").val(teamData.Members[i].Age);
            $("#phone").val(teamData.Members[i].Phone);
            $("#position").val(teamData.Members[i].Position);
            $("#shoots").val(teamData.Members[i].Shoots);
            break;
        }
    }

    let oldMemberName = $("#membername").val();
    let oldContactName = $("#contactname").val();
    let oldEmail = $("#email").val();
    let oldGender = $("#gender").val();
    let oldAge = $("#age").val();
    let oldPhone = $("#phone").val();
    let oldPosition = $("#position").val();  
    let oldShoots = $("#shoots").val();

    $("#buttonsDiv").append($("<a>", {
        href: "#",
        id: "editPlayerBtn",
        text: "Edit",
        class: "col-md-2 btn btn-success btn-sm mb-1 mr-1",
        role: "button"
    }))

    $("#buttonsDiv").append($("<a>", {
        href: "#",
        id: "savePlayerBtn",
        text: "Save",
        class: "col-md-2 btn btn-success btn-sm mb-1 mr-1",
        role: "button"
    }))

    $("#savePlayerBtn").hide();

    $("#buttonsDiv").append($("<a>", {
        href: "detailsteams.html",
        id: "backBtn",
        text: "Back",
        class: "col-md-2 btn btn-primary btn-sm mb-1",
        role: "button"
    }))

    $("#buttonsDiv").append($("<a>", {
        href: "#",
        id: "cancelBtn",
        text: "Cancel",
        class: "col-md-2 btn btn-danger btn-sm mb-1",
        role: "button"
    }))

    $("#cancelBtn").hide();

    // Save Player Details Button click
    $("#saveTeamBtn").on("click", function ()
    {
        let errorFound = validatePlayerDetailsForm();

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
                $("#savedModalText").html("Failed to Add Player to Team, please try again.")
                    .addClass("text-danger");
                $("#savedModal").modal("show");
            })

        return false;
    })
})