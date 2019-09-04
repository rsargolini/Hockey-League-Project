"use strict";

/*
* This function validates all fields on the Add Team Details Form.
*/
function validateTeamDetailsForm(objs)
{
    $("#invalidData").empty();

    const emailFormat = /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/;
    const phoneFormat = /^\d{3}-\d{3}-\d{4}$/;
    const leagueMinPlayers = 10;
    const leagueMaxPlayers = 18;
    const leagueMinAge = 18;
    const leagueMaxAge = 70;

    let displayErrorMessage = [];

    let errorFound = false;

    // Team Name Validation
    if ($("#teamname").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Name";
        errorFound = true;
    }

    // Team Division Validation
    if ($("#leaguecode").val() == "None")
    {
        displayErrorMessage[displayErrorMessage.length] = "Please select a Division";
        errorFound = true;
    }

    // Team Gender Validation
    if ($("#teamgender").val() == "None")
    {
        displayErrorMessage[displayErrorMessage.length] = "Please select a Gender";
        errorFound = true;
    }

    // Team Max Players Validation
    if ($("#maxteammembers").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Max Players";
        errorFound = true;
    }
    else
    {
        if ((Number($("#maxteammembers").val()) < leagueMinPlayers) ||
            (Number($("#maxteammembers").val()) > leagueMaxPlayers))
        {
            displayErrorMessage[displayErrorMessage.length] = "Max Players only between 10 and 18 allowed.";
            errorFound = true;
        }
    }

    // Team Minimum Age Validation
    if ($("#minmemberage").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Min Age";
        errorFound = true;
    }
    else
    {
        if (Number($("#minmemberage").val()) < leagueMinAge)
        {
            displayErrorMessage[displayErrorMessage.length] = "Min Age must be 18 or greater.";
            errorFound = true;
        }
    }

    // Team Maximum Age Validation
    if ($("#maxmemberage").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Max Age";
        errorFound = true;
    }
    else
    {
        if ((Number($("#maxmemberage").val()) > leagueMaxAge) ||
            (Number($("#maxmemberage").val()) < leagueMinAge))
        {
            displayErrorMessage[displayErrorMessage.length] = "Max Age must be between 18 and 70.";
            errorFound = true;
        }

        if ($("#minmemberage").val().trim() == "")
        {
        }
        else
        {
            if (Number($("#maxmemberage").val()) < Number($("#minmemberage").val()))
            {
                displayErrorMessage[displayErrorMessage.length] = "Max Age must be greater than or equal to Min Age.";
                errorFound = true;
            }
        }
    }

    // Team Manager Name Validation
    if ($("#managername").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Manager Name";
        errorFound = true;
    }

    // Team Manager Phone Number Validation
    if ($("#managerphone").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Manager Phone Number";
        errorFound = true;
    }
    else
    {
        if (phoneFormat.test($("#managerphone").val()))
        {
        }
        else
        {
            displayErrorMessage[displayErrorMessage.length] = "Invalid Manager Phone Number (999-999-9999)";
            errorFound = true;
        }
    }

    // Team Manager Email Validation
    if ($("#manageremail").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Manager Email Address";
        errorFound = true;
    }
    else
    {
        if (emailFormat.test($("#manageremail").val()))
        {
        }
        else
        {
            displayErrorMessage[displayErrorMessage.length] = "Invalid Manager Email Address (nnnn@nnn.nnn)";
            errorFound = true;
        }
    }

    // Call Display Errors Function (errors.js)
    displayErrors($("#invalidData"), displayErrorMessage, errorFound);

    return errorFound;
}

//Connect Events to HTML Elements
$(function ()
{
    sessionStorage.setItem("page", "newteam");

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

    $("#buttonsDiv").append($("<a>", {
        href: "#",
        id: "saveTeamBtn",
        text: "Save",
        class: "col-md-2 btn btn-success btn-sm mb-1 mr-1",
        role: "button"
    }));

    $("#buttonsDiv").append($("<a>", {
        href: "filterteams.html",
        id: "cancelBtn",
        text: "Cancel",
        class: "col-md-2 btn btn-danger btn-sm mb-1",
        role: "button"
    }));

    // Save Team Details Button click
    $("#saveTeamBtn").on("click", function ()
    {
        let errorFound = validateTeamDetailsForm();

        if (errorFound)
        {
            return;
        }

        // Call Hide Error Function (errors.js)
        hideError($("#invalidData"));

        let postData;

        // Post Add Team Form to API Teams
        $.post("/api/teams", $("#teamDetailsForm").serialize(),
            function (data)
            {
                postData = JSON.parse(data);
            })

            .done(function ()
            {
                $("#savedModalText").html("Team has been successfully added.")
                    .addClass("text-primary");
                $("#modalBody").append("<b>Division: </b>" + $("#leaguecode").val())
                    .append("<br />")
                    .append("<b>Team Name: </b>" + $("#teamname").val());
                $("#savedModal").modal("show");

                // Ok Button click
                $("#okBtn").on("click", function ()
                {
                    location.href = "detailsteam.html?id=" + postData.TeamId;
                })
            })

            .fail(function ()
            {
                $("#savedModalText").html("Update has failed, please try again.")
                    .addClass("text-danger");
                $("#savedModal").modal("show");
            })

        return false;
    })
})