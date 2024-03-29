"use strict";

/*
* This function saves original data for refresh.
*/
function saveTeamData()
{
    let oldData = {
        teamid: $("#teamid").val(),
        teamname: $("#teamname").val(),
        leaguecode: $("#leaguecode option:selected").val(),
        teamgender: $("#teamgender option:selected").val(),
        maxteammembers: $("#maxteammembers").val(),
        minmemberage: $("#minmemberage").val(),
        maxmemberage: $("#maxmemberage").val(),
        managername: $("#managername").val(),
        managerphone: $("#managerphone").val(),
        manageremail: $("#manageremail").val()
    }
    return oldData;
}

/* 
* This function inserts a Header Row into the Players Table.
*/
function insertPlayerHeadRow()
{
    $("#players").append("<thead>");
    $("#players thead").append("<tr>");
    $("#players thead tr").append($("<th>", { text: "Player Name" }))
        .append($("<th>", { text: "Email Address" }))
        .append($("<th>", { colspan: "2", text: "Actions", class: "text-center" }));
}

/* 
* This function inserts Data Rows into the Players Table.
*
* @param details (Array) - Team Details array
* @param i (index to array) - Team Details array index
*/
function insertPlayerRow(details, i)
{
    $("#players tbody").append("<tr>")
    $("#players tbody tr:last").append($("<td>", { html: details.Members[i].MemberName }))
        .append($("<td>", { html: details.Members[i].Email }))
        .append("<td class='playersBtn'>");


    $("#players tbody tr:last td:last").append($("<a>", {
        href: "detailsplayer.html?&id=" + details.TeamId + "&playerid=" + details.Members[i].MemberId,
        id: "editBtn" + [i],
        class: "btn btn-outline-success btn-sm",
        role: "button"
    }))

    $("#players tbody tr:last td:last a").append($("<i>", { class: "fa fa-edit" }))
        .append($("<span>", { class: "buttonText", text: "Details" }))

    $("#players tbody tr:last").append("<td class='playersBtn'>");
    $("#players tbody tr:last td:last").append($("<a>", {
        href: "#",
        id: "deleteBtn" + [i],
        class: "btn btn-outline-danger btn-sm",
        role: "button"
    }))

    $("#players tbody tr:last td:last a").append($("<i>", { class: "far fa-trash-alt" }))
        .append($("<span>", { class: "buttonText", text: "Delete" }))
}

/*
* This function changes all required labels when edit button clicked.
*/
function addRequiredLabels()
{
    $("#nameLabel").text("Name*");
    $("#maxPlayersLabel").text("Max Players* (10-18)");
    $("#minAgeLabel").text("Min Age* (>17)");
    $("#maxAgeLabel").text("Max Age* (<71)");
    $("#mgrNameLabel").text("Name*");
    $("#mgrPhoneLabel").text("Phone*");
    $("#mgrEmailLabel").text("Email*");
}

/*
* This function removes asterisk from required labels when not in edit mode.
*/
function removeRequiredLabels()
{
    $("#nameLabel").text("Name");
    $("#maxPlayersLabel").text("Max Players");
    $("#minAgeLabel").text("Min Age");
    $("#maxAgeLabel").text("Max Age");
    $("#mgrNameLabel").text("Name");
    $("#mgrPhoneLabel").text("Phone");
    $("#mgrEmailLabel").text("Email");
}

/*
* This function validates all fields on the Team Details Form.
*/
function validateTeamDetailsForm(details)
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

    // Team Gender vs Existing Player Genders Validation
    if (isThereAnyGenderChangeConflicts($("#teamgender").val(), details))
    {
        displayErrorMessage[displayErrorMessage.length] = "Gender Change Conflict Found";
        errorFound = true;
    }

    // Team Maximum Players Validation
    if ($("#maxteammembers").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Max Players";
        errorFound = true;
    }
    else
    {
        if (Number($("#maxteammembers").val()) < Number(leagueMinPlayers) ||
            (Number($("#maxteammembers").val()) > Number(leagueMaxPlayers)))
        {
            displayErrorMessage[displayErrorMessage.length] = "Max Players only between 10 and 18 allowed.";
            errorFound = true;
        }
        else
        {
            if (Number($("#maxteammembers").val()) < Number(details.Members.length))
            {
                displayErrorMessage[displayErrorMessage.length] = "Max Players change not allowed, current Players exceed that number.";
                errorFound = true;
            }
        }
    }

    // Team Minimum Age vs Existing Players Ages Validation
    if ($("#minmemberage").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Min Age";
        errorFound = true;
    }
    else
    {
        if (Number($("#minmemberage").val() < Number(leagueMinAge)))
        {
            displayErrorMessage[displayErrorMessage.length] = "Min Age must be 18 or greater.";
            errorFound = true;
        }
        else
        {
            if (Number($("#minmemberage").val()) > getMinAgeOfMember(details))
            {
                displayErrorMessage[displayErrorMessage.length] = "Min Age change not allowed, current Player(s) younger than that age.";
                errorFound = true;
            }
        }
    }

    // Team Maximum Age vs Existing Players Ages Validation
    if ($("#maxmemberage").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Max Age";
        errorFound = true;
    }
    else
    {
        if (Number($("#maxmemberage").val() > Number(leagueMaxAge)) ||
            Number($("#maxmemberage").val() < Number(leagueMinAge)))
        {
            displayErrorMessage[displayErrorMessage.length] = "Max Age must be between 18 and 70.";
            errorFound = true;
        }
        else
        {
            if (Number($("#maxmemberage").val()) < getMaxAgeOfMember(details))
            {
                displayErrorMessage[displayErrorMessage.length] = "Max Age change not allowed, current Player(s) older than that age.";
                errorFound = true;
            }
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

    // Team Manager Phone Validation
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

/*
* This function checks for Gender Change Conflicts.
*/
function isThereAnyGenderChangeConflicts(newTeamGender, details)
{
    if (newTeamGender == "Any")
    {
        // No conflict with switching to Coed
        return false;
    }

    let conflictGender = newTeamGender == "Male" ? "Female" : "Male";

    for (let i = 0; i < details.Members.length; i++)
    {
        // Look for Player whose gender would conflict with new team gender
        if (details.Members[i].Gender == conflictGender) 
        {
            return true;  // found a conflict!
        }
    }

    return false; // no conflicts
}

/*
* This function gets the Minimum Age of existing players.
*/
function getMinAgeOfMember(details)
{
    let minAge = 100000;

    for (let i = 0; i < details.Members.length; i++)
    {
        if (Number(details.Members[i].Age) < minAge) 
        {
            minAge = Number(details.Members[i].Age);
        }
    }
    return minAge;
}

/*
* This function gets the Maximum Age of existing players.
*/
function getMaxAgeOfMember(details)
{
    let maxAge = -1;

    for (let i = 0; i < details.Members.length; i++)
    {
        if (Number(details.Members[i].Age) > maxAge) 
        {
            maxAge = Number(details.Members[i].Age);
        }
    }
    return maxAge;
}

//Connect Events to HTML Elements
$(function ()
{
    let urlParams = new URLSearchParams(location.search);
    let teamSelected = urlParams.get("id");

    // Get all data from Teams by Team Id JSON file
    $.getJSON("/api/teams/" + teamSelected,
        function (details)
        {
            let saveData;

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

            // Disable all Team Details Fields
            $("*", "#teamDetailsForm").prop('disabled', true);

            // Team Information Fieldset
            $("#teamid").val(details.TeamId);
            $("#teamname").val(details.TeamName);
            $("#leaguecode").val(details.League);
            $("#teamgender").val(details.TeamGender);
            $("#maxteammembers").val(details.MaxTeamMembers);
            $("#minmemberage").val(details.MinMemberAge);
            $("#maxmemberage").val(details.MaxMemberAge);

            // Manager Information Fieldset
            $("#managername").val(details.ManagerName);
            $("#managerphone").val(details.ManagerPhone);
            $("#manageremail").val(details.ManagerEmail);

            let playersLength = details.Members.length;

            if (playersLength >= 1)
            {
                // Call Create Table Head Row Function
                insertPlayerHeadRow();

                $("#players").append("<tbody>");

                for (let i = 0; i < playersLength; i++)
                {
                    insertPlayerRow(details, i);
                }
            }

            let selectedPlayer;

            for (let i = 0; i < playersLength; i++)
            {
                $("#deleteBtn" + [i]).on("click", function ()
                {
                    $("#deleteModalBody").empty();
                    $("#deletePlayerModalText").html("Are you sure you want to delete this Player?")
                        .addClass("text-danger");
                    $("#deleteModalBody").append("<b>Team Name: </b>" + details.TeamName)
                        .append("<br />")
                        .append("<b>Player Name: </b>" + details.Members[i].MemberName);
                    $("#deletePlayerModal").modal("show");
                    selectedPlayer = [i];
                })
            }

            // Confirm Delete Button click
            $("#modalConfirmBtn").on("click", function ()
            {
                // Delete Player to API Teams
                $.ajax({
                    url: "/api/teams/" + details.TeamId + "/members/" + details.Members[selectedPlayer].MemberId,
                    method: "DELETE"
                })
                    .done(function ()
                    {
                        $("#deletePlayerModal").modal("hide");
                        location.reload();
                    })

                    .fail(function ()
                    {
                        $("#savedModalText").html("Deletion has failed, please try again.")
                            .addClass("text-danger");
                        $("#savedModal").modal("show");
                    })
            })

            $("#buttonsDiv").append($("<a>", {
                href: "#",
                id: "editTeamBtn",
                text: "Edit",
                class: "col-md-2 btn btn-success btn-sm mb-1 mr-1",
                role: "button"
            }))

            $("#buttonsDiv").append($("<a>", {
                href: "#",
                id: "saveTeamBtn",
                text: "Save",
                class: "col-md-2 btn btn-success btn-sm mb-1 mr-1",
                role: "button"
            }));

            $("#saveTeamBtn").hide();

            $("#addPlayerBtnDiv").append($("<a>", {
                href: "newplayer.html?id=" + teamSelected,
                id: "addPlayerBtn",
                text: "Add Player",
                class: "col-md-1 btn btn-success btn-sm mb-2 mr-1",
                role: "button"
            }));

            if (Number($("#maxteammembers").val()) == playersLength)
            {
                $("#addPlayerBtn").hide();
                $("#teamFullDiv").show();
            }
            else
            {
                $("#addPlayerBtn").show();
                $("#teamFullDiv").hide();
            }

            $("#buttonsDiv").append($("<a>", {
                href: "filterteams.html",
                id: "backBtn",
                text: "Back",
                class: "col-md-2 btn btn-primary btn-sm mb-1",
                role: "button"
            }));

            $("#buttonsDiv").append($("<a>", {
                href: "#",
                id: "cancelBtn",
                text: "Cancel",
                class: "col-md-2 btn btn-danger btn-sm mb-1",
                role: "button"
            }));

            $("#cancelBtn").hide();

            // Edit Team Details Button click
            $("#editTeamBtn").on("click", function ()
            {
                saveData = saveTeamData();

                // Enable all Team Details Fields except Team ID
                $("*", "#teamDetailsForm").prop('disabled', false);
                $("#teamid").prop('readonly', true);
                $("#requireNoteEdit").show();
                $("#teamname").focus();

                addRequiredLabels();

                $("#editTeamBtn").hide();
                $("#saveTeamBtn").show();

                $("#backBtn").hide();
                $("#cancelBtn").show();
            })

            // Save Team Details Button click
            $("#saveTeamBtn").on("click", function ()
            {
                let errorFound = validateTeamDetailsForm(details);

                if (errorFound)
                {
                    return;
                }

                // Call Hide Error Function (errors.js)
                hideError($("#invalidData"));

                // Put (Update) Form to API Teams
                $.ajax({
                    url: "/api/teams",
                    method: "PUT",
                    data: $("#teamDetailsForm").serialize()
                })
                    .done(function ()
                    {
                        $("#modalBody").empty();
                        $("#savedModalText").html("Team has been successfully updated.")
                            .addClass("text-primary");
                        $("#modalBody").append("<b>Division: </b>" + $("#leaguecode").val())
                            .append("<br />")
                            .append("<b>Team Name: </b>" + $("#teamname").val());
                        $("#savedModal").modal("show");

                        // Disable all Team Details Fields except Team ID
                        $("*", "#teamDetailsForm").prop('disabled', true);

                        removeRequiredLabels();

                        $("#editTeamBtn").show();
                        $("#saveTeamBtn").hide();
                        $("#requireNoteEdit").hide();

                        $("#backBtn").show();
                        $("#cancelBtn").hide();

                        if (Number($("#maxteammembers").val()) == playersLength)
                        {
                            $("#addPlayerBtn").hide();
                            $("#teamFullDiv").show();
                        }
                        else
                        {
                            $("#addPlayerBtn").show();
                            $("#teamFullDiv").hide();
                        }
                    })

                    .fail(function ()
                    {
                        $("#savedModalText").html("Update has failed, please try again.")
                            .addClass("text-danger");
                        $("#savedModal").modal("show");
                    })
            })

            // Cancel Button click
            $("#cancelBtn").on("click", function ()
            {
                // Disable all Team Details Fields except Team ID
                $("*", "#teamDetailsForm").prop('disabled', true);

                // Call Hide Error Function (errors.js)
                hideError($("#invalidData"));

                removeRequiredLabels();

                $("#editTeamBtn").show();
                $("#saveTeamBtn").hide();
                $("#requireNoteEdit").hide();

                $("#backBtn").show();
                $("#cancelBtn").hide();

                // Refresh Original Data
                $("#teamid").val(saveData.teamid);
                $("#teamname").val(saveData.teamname);
                $("#leaguecode").val(saveData.leaguecode);
                $("#teamgender").val(saveData.teamgender);
                $("#maxteammembers").val(saveData.maxteammembers);
                $("#minmemberage").val(saveData.minmemberage);
                $("#maxmemberage").val(saveData.maxmemberage);
                $("#managername").val(saveData.managername);
                $("#managerphone").val(saveData.managerphone);
                $("#manageremail").val(saveData.manageremail);
            })
        })
    return;
})