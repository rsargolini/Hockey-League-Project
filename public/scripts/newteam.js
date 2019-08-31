"use strict";

/*
* This function validates all fields on the Team Details Form.
*/
function validateTeamDetailsForm(objs)
{
    $("#invalidData").empty();

    const emailFormat = /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/;
    const phoneFormat = /^\d{3}-\d{3}-\d{4}$/;

    let displayErrorMessage = [];

    let errorFound = false;

    if ($("#teamname").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Name";
        errorFound = true;
    }

    if ($("#leaguecode").val() == "None")
    {
        displayErrorMessage[displayErrorMessage.length] = "Please select a Division";
        errorFound = true;
    }

    if ($("#teamgender").val() == "None")
    {
        displayErrorMessage[displayErrorMessage.length] = "Please select a Gender";
        errorFound = true;
    }

    if ((isNaN($("#maxteammembers").val())) || ($("#maxteammembers").val() <= 9) || ($("#maxteammembers").val() > 18))
    {
        displayErrorMessage[displayErrorMessage.length] = "Max Players only between 10 and 18 allowed.";
        errorFound = true;
    }

    if ((isNaN($("#minmemberage").val())) || ($("#minmemberage").val() < 18))
    {
        displayErrorMessage[displayErrorMessage.length] = "Min Age must be greater than 17.";
        errorFound = true;
    }

    if ((isNaN($("#maxmemberage").val())) || ($("#maxmemberage").val() > 70) ||
        ($("#maxmemberage").val() < $("#minmemberage").val()))
    {
        displayErrorMessage[displayErrorMessage.length] = "Max Age must be less than or equal to 70.";
        errorFound = true;
    }

    if ($("#managername").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Manager Name";
        errorFound = true;
    }

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
            displayErrorMessage[displayErrorMessage.length] = "Inavlid Manager Email Address (nnnn@nnn.nnn)";
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
    }))

    $("#buttonsDiv").append($("<a>", {
        href: "filterteams.html",
        id: "cancelBtn",
        text: "Cancel",
        class: "col-md-2 btn btn-danger btn-sm mb-1",
        role: "button"
    }))

    // Save Team Details Button click
    $("#saveTeamBtn").on("click", function ()
    {
        let errorFound = validateTeamDetailsForm();

        if (errorFound)
        {
            return
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
                $("#modalBody").append("<b>Team Id: </b>" + postData.TeamId)
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