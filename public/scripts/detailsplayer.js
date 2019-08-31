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
        position: $("#position").val(),
        shoots: $("input[name='shoots']:checked").val()
    }
    return oldData;
}

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
        if ((isNaN($("#age").val())) || ($("#age").val() < 18))
        {
            displayErrorMessage[displayErrorMessage.length] = "Player is too young for Team.";
            errorFound = true;
        }
        else
        {
            if ($("#age").val() > 70)
            {
                displayErrorMessage[displayErrorMessage.length] = "Player is too old for Team.";
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

    // Disable all Player Details Fields
    $("*", "#editPlayerForm").prop('disabled', true);

    // Get all data from Teams by Team Id JSON file
    $.getJSON("/api/teams/" + teamSelected,
        function (details)
        {
            let objs = details;

            let leagues = JSON.parse(sessionStorage.getItem("leagues"));

            let leaguesLength = leagues.length;

            for (let i = 0; i < leaguesLength; i++)
            {
                if (objs.League = leagues[i].Code)
                {
                    $("#leaguecode").val(leagues[i].Name);
                    break;
                }
            }

            $("#teamname").val(objs.TeamName);
            
            let playersLength = objs.Members.length;

            for (let i = 0; i < playersLength; i++)
            {
                if (playerSelected == objs.Members[i].MemberId)
                {
                    // Team Information Fieldset
                    $("#membername").val(objs.Members[i].MemberName);
                    $("#contactname").val(objs.Members[i].ContactName);
                    $("#email").val(objs.Members[i].Email);
                    $("input[name='gender']").val(objs.Members[i].Gender).prop("checked", true);
                    $("#age").val(objs.Members[i].Age);
                    $("#phone").val(objs.Members[i].Phone);
                    $("#position option").find(function ()
                    {
                        return ($(this).val() == objs.Members[i].Position);
                    }).attr("selected", "selected");

                    // "#Goalie").attr("selected", "selected")
                    // $("#position").selectmenu('refresh').val(objs.Members[i].Position).attr("selected", "selected");
                    $("input[name='shoots']").val(objs.Members[i].Shoots).prop("checked", true);
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
                let oldData = savePlayerData();

                // Enable all Team Details Fields except Team ID
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
                let errorFound = validatePlayerDetailsForm();

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
            })
            return;
        })
})
