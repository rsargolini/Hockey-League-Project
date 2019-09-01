"use strict";

/*
* This function validates all fields on the Player Details Form.
*/
function savePlayerData()
{
    let oldData = {
        membername: $("#membername").val(),
        contactname: $("#contactname").val(),
        email: $("#email").val(),
        gender: $("input[name='gender']:checked").val(),
        age: $("#age").val(),
        phone: $("#phone").val(),
        position: $("#position  option:selected").val(),
        shoots: $("input[name='shoots']:checked").val()
    }
    return oldData;
}

/*
* This function validates all fields on the Player Details Form.
*/
function validatePlayerDetailsForm(details)
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
            displayErrorMessage[displayErrorMessage.length] = "Inavlid Email Address (nnnn@nnn.nnn)";
            errorFound = true;
        }
    }

    if ($("#age").val().trim() == "")
    {
        displayErrorMessage[displayErrorMessage.length] = "Missing Age";
        errorFound = true;
    }
    else
    {
        if ((isNaN($("#age").val())) || ($("#age").val() < details.MinMemberAge))
        {
            displayErrorMessage[displayErrorMessage.length] = "Player is too young for Team. Min Age is " + details.MinMemberAge + ".";
            errorFound = true;
        }
        else
        {
            if ($("#age").val() > details.MaxMemberAge)
            {
                displayErrorMessage[displayErrorMessage.length] = "Player is too old for Team. Max Age is " + details.MaxMemberAge + ".";
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

    // Call Display Errors Function (errors.js)
    displayErrors($("#invalidData"), displayErrorMessage, errorFound);

    return errorFound;
}

//Connect Events to HTML Elements
$(function ()
{
    let urlParams = new URLSearchParams(location.search);
    let teamSelected = urlParams.get("id");
    let playerSelected = urlParams.get("playerid");

    let saveData;

    // Disable all Player Details Fields
    $("*", "#editPlayerForm").prop('disabled', true);

    // Get all data from Teams by Team Id JSON file
    $.getJSON("/api/teams/" + teamSelected,
        function (details)
        {
            let leagues = JSON.parse(sessionStorage.getItem("leagues"));

            let leaguesLength = leagues.length;

            for (let i = 0; i < leaguesLength; i++)
            {
                if (details.League = leagues[i].Code)
                {
                    $("#leaguecode").val(leagues[i].Name);
                    break;
                }
            }

            $("#teamname").val(details.TeamName);
            
            let playersLength = details.Members.length;

            for (let i = 0; i < playersLength; i++)
            {
                if (playerSelected == details.Members[i].MemberId)
                {
                    // Player Information Fieldset
                    $("#membername").val(details.Members[i].MemberName);
                    $("#contactname").val(details.Members[i].ContactName);
                    $("#email").val(details.Members[i].Email);
                    $("#" + details.Members[i].Gender).prop("checked", true);
                    $("#age").val(details.Members[i].Age);
                    $("#phone").val(details.Members[i].Phone);
                    $("#position").val(details.Members[i].Position);
                    $("#" + details.Members[i].Shoots).prop("checked", true);
                    break;
                }
            }

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
                href: "detailsteam.html?&id=" + teamSelected,
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

            // Edit Player Details Button click
            $("#editPlayerBtn").on("click", function ()
            {
                saveData = savePlayerData();

                // Enable all Team Details Fields except League Code and Team Name
                $("*", "#editPlayerForm").prop('disabled', false);
                $("#leaguecode").prop('readonly', true);
                $("#teamname").prop('readonly', true);

                $("#editPlayerBtn").hide();
                $("#savePlayerBtn").show();

                $("#backBtn").hide();
                $("#cancelBtn").show();
            })

            // Save Player Details Button click
            $("#savePlayerBtn").on("click", function ()
            {
                let errorFound = validatePlayerDetailsForm(details);

                if (errorFound)
                {
                    return
                }

                // Call Hide Error Function (errors.js)
                hideError($("#invalidData"));
                
                // Put (Update) Form to API Teams
                $.ajax({
                    url: "/api/teams/" + teamSelected + "/members",
                    method: "PUT",
                    data: "memberid=" + playerSelected + "&" + $("#editPlayerForm").serialize()
                })
                    .done(function ()
                    {
                        $("#savedModalText").html("Player " + $("#membername").val() + " has been successfully updated.")
                            .addClass("text-primary");
                        $("#savedModal").modal("show");

                        // Disable all Team Details Fields except Team ID
                        $("*", "#editPlayerForm").prop('disabled', true);

                        $("#editPlayerBtn").show();
                        $("#savePlayerBtn").hide();

                        $("#backBtn").show();
                        $("#cancelBtn").hide();
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
                $("*", "#editPlayerForm").prop('disabled', true);

                $("#editPlayerBtn").show();
                $("#savePlayerBtn").hide();

                $("#backBtn").show();
                $("#cancelBtn").hide();

                $("#membername").val(saveData.membername);
                $("#contactname").val(saveData.contactname);
                $("#email").val(saveData.email);
                $("#gender").val(saveData.gender);
                $("#age").val(saveData.age);
                $("#phone").val(saveData.phone);
                $("#position").val(saveData.position);
                $("#shoots").val(saveData.shoots);
            })
            return;
        })
})
