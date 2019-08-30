"use strict";

/* 
* This function inserts a Header Row into the Student Table.
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
* This function insert rows into the Student Table.
*
* @param courses (Array) - The Courses array
* @param i (index to array) - The Courses arrays index
*/
function insertPlayerRow(teams, i)
{
    $("#players tbody").append("<tr>")
    $("#players tbody tr:last").append($("<td>", { html: teams.Members[i].MemberName }))
        .append($("<td>", { html: teams.Members[i].Email }))
        .append("<td class='playersBtn'>");


    $("#players tbody tr:last td:last").append($("<a>", {
        href: "detailsplayer.html?&playerid=" + teams.Members[i].MemberId,
        id: "editBtn" + [i],
        class: "btn btn-outline-success btn-sm",
        role: "button"
    }))

    $("#players tbody tr:last td:last a").append($("<i>", { class: "fa fa-edit" }))
        .append($("<span>", { class: "buttontext", text: "Details" }))

    $("#players tbody tr:last").append("<td class='playersBtn'>");
    $("#players tbody tr:last td:last").append($("<a>", {
        href: "deleteteam.html",
        id: "deleteBtn" + [i],
        // text: "Delete",
        class: "btn btn-outline-danger btn-sm",
        role: "button"
    }))

    $("#players tbody tr:last td:last a").append($("<i>", { class: "far fa-trash-alt" }))
        .append($("<span>", { class: "buttontext", text: "Delete" }))
}

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

    if (teamname.value.trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Name";
        errorFound = true;
    }

    if (isThereAnyGenderChangeConflicts(teamgender.value, objs))
    {
        displayErrorMessage[displayErrorMessage.length] = "Gender Change Conflict Found";
        errorFound = true;
    }

    if ((isNaN(maxteammembers.value)) || (maxteammembers.value <= 9) || (maxteammembers.value > 18))
    {
        displayErrorMessage[displayErrorMessage.length] = "Max Players only between 10 and 18 allowed.";
        errorFound = true;
    }
    else
    {
        if (Number(maxteammembers.value) < objs.Members.length)
        {
            displayErrorMessage[displayErrorMessage.length] = "Max Players change not allowed, current Players exceed that number.";
            errorFound = true;
        }
    }

    if ((isNaN(minmemberage.value)) || (minmemberage.value < 18))
    {
        displayErrorMessage[displayErrorMessage.length] = "Min Age must be greater than 17.";
        errorFound = true;
    }
    else
    {
        if (Number(minmemberage.value) > getMinAgeOfMember(objs))
        {
            displayErrorMessage[displayErrorMessage.length] = "Min Age change not allowed, current Player(s) younger then that age.";
            errorFound = true;
        }
    }

    if ((isNaN(maxmemberage.value)) || (maxmemberage.value > 70) ||
        (maxmemberage.value < minmemberage.value))
    {
        displayErrorMessage[displayErrorMessage.length] = "Max Age must be less than or equal to 70.";
        errorFound = true;
    }
    else
    {
        if (Number(maxmemberage.value) < getMaxAgeOfMember(objs))
        {
            displayErrorMessage[displayErrorMessage.length] = "Max Age change not allowed, current Player(s) older then that age.";
            errorFound = true;
        }
    }

    if (managername.value.trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Manager Name";
        errorFound = true;
    }

    if (managerphone.value.trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Manager Phone Number";
        errorFound = true;
    }
    else
    {
        if (phoneFormat.test(managerphone.value))
        {
        }
        else
        {
            displayErrorMessage[displayErrorMessage.length] = "Invalid Manager Phone Number (999-999-9999)";
            errorFound = true;
        }
    }

    if (manageremail.value.trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Manager Email Address";
        errorFound = true;
    }
    else
    {
        if (emailFormat.test(manageremail.value))
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

function isThereAnyGenderChangeConflicts(newTeamGender, objs)
{
    if (newTeamGender == "Any")
    {
        // No conflict with team switching to Coed
        return false;
    }

    let conflictGender = newTeamGender == "Male" ? "Female" : "Male";

    for (let i = 0; i < objs.Members.length; i++)
    {
        // Look for Player whose gender would conflict with new team gender
        if (objs.Members[i].Gender == conflictGender) 
        {
            return true;  // found a conflict!
        }
    }

    return false; // no conflicts
}

function getMinAgeOfMember(objs)
{
    let minAge = 100000;

    for (let i = 0; i < objs.Members.length; i++)
    {
        if (Number(objs.Members[i].Age) < minAge) 
        {
            minAge = Number(objs.Members[i].Age);
        }
    }
    return minAge;
}

function getMaxAgeOfMember(objs)
{
    let maxAge = -1;

    for (let i = 0; i < objs.Members.length; i++)
    {
        if (Number(objs.Members[i].Age) > maxAge) 
        {
            maxAge = Number(objs.Members[i].Age);
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
            let objs = details;

            let leagues = JSON.parse(sessionStorage.getItem("leagues"));

            console.log(details)
            sessionStorage.setItem("teamData", JSON.stringify(details));

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
            $("#teamid").val(objs.TeamId);
            $("#teamname").val(objs.TeamName);
            $("#leaguecode").val(objs.League);
            $("#teamgender").val(objs.TeamGender);
            $("#maxteammembers").val(objs.MaxTeamMembers);
            $("#minmemberage").val(objs.MinMemberAge);
            $("#maxmemberage").val(objs.MaxMemberAge);

            // Manager Information Fieldset
            $("#managername").val(objs.ManagerName);
            $("#managerphone").val(objs.ManagerPhone);
            $("#manageremail").val(objs.ManagerEmail);

            let oldTeamId = objs.TeamId;
            let oldTeamName = objs.TeamName;
            let oldLeague = objs.League;
            let oldTeamGender = objs.TeamGender;
            let oldMaxTeamMembers = objs.MaxTeamMembers;
            let oldMinMemberAge = objs.MinMemberAge;
            let oldMaxMemberAge = objs.MaxMemberAge;
            let oldManagerName = objs.ManagerName;
            let oldManagerPhone = objs.ManagerPhone;
            let oldManagerEmail = objs.ManagerEmail;

            let playersLength = objs.Members.length;

            if (playersLength >= 1)
            {
                $("#playersTitle").slideDown();

                // Call Create Table Head Row Function
                insertPlayerHeadRow();

                $("#players").append("<tbody>");

                for (let i = 0; i < playersLength; i++)
                {
                    insertPlayerRow(objs, i);
                }
            }

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
            }))

            $("#saveTeamBtn").hide();

            $("#addPlayerBtnDiv").append($("<a>", {
                href: "newplayer.html?id=" + teamSelected,
                id: "addPlayerBtn",
                text: "Add Player",
                class: "col-md-1 btn btn-success btn-sm mb-2 mr-1",
                role: "button"
            }))

            if (Number($("#maxteammembers").val()) == playersLength)
            {
                $("#addPlayerBtn").hide();
                $("#teamFullDiv").append($("<p>", { html: "Team is Full", id: "teamFullMessage" }));
                $("#teamFullDiv").show();
            }

            $("#buttonsDiv").append($("<a>", {
                href: "filterteams.html",
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

            // Edit Team Details Button click
            $("#editTeamBtn").on("click", function ()
            {
                // Enable all Team Details Fields except Team ID
                $("*", "#teamDetailsForm").prop('disabled', false);
                $("#teamid").prop('readonly', true);

                $("#editTeamBtn").hide();
                $("#saveTeamBtn").show();

                $("#backBtn").hide();
                $("#cancelBtn").show();
            })

            // Save Team Details Button click
            $("#saveTeamBtn").on("click", function ()
            {
                let errorFound = validateTeamDetailsForm(objs);

                if (errorFound)
                {
                    return
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
                        $("#savedModalText").html("Team #" + $("#teamid").val() + "<br> " + $("#teamname").val() + " has been successfully updated.")
                            .addClass("text-primary");
                        $("#savedModal").modal("show");

                        // Disable all Team Details Fields except Team ID
                        $("*", "#teamDetailsForm").prop('disabled', true);

                        $("#editTeamBtn").show();
                        $("#saveTeamBtn").hide();

                        $("#backBtn").show();
                        $("#cancelBtn").hide();

                        location.reload();
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

                $("#editTeamBtn").show();
                $("#saveTeamBtn").hide();

                $("#backBtn").show();
                $("#cancelBtn").hide();

                $("#teamid").val(oldTeamId);
                $("#teamname").val(oldTeamName);
                $("#leaguecode").val(oldLeague);
                $("#teamgender").val(oldTeamGender);
                $("#maxteammembers").val(oldMaxTeamMembers);
                $("#minmemberage").val(oldMinMemberAge);
                $("#maxmemberage").val(oldMaxMemberAge);
                $("#managername").val(oldManagerName);
                $("#managerphone").val(oldManagerPhone);
                $("#manageremail").val(oldManagerEmail);
            })
            return;
        })
})