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
        href: "detailsplayer.html?&id=" + teams.Members[i].MemberId,
        id: "editBtn" + [i],
        //   text: "Edit",
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

            // Disable all Team Details Fields
            $("*", "#teamDetailsForm").prop('disabled', true);

            // Team Information Fieldset
            $("#TeamId").val(objs.TeamId);
            $("#TeamName").val(objs.TeamName);
            $("#League").val(objs.League);
            $("#TeamGender").val(objs.TeamGender);
            $("#MaxTeamMembers").val(objs.MaxTeamMembers);
            $("#MinMemberAge").val(objs.MinMemberAge);
            $("#MaxMemberAge").val(objs.MaxMemberAge);

            // Manager Information Fieldset
            $("#ManagerName").val(objs.ManagerName);
            $("#ManagerPhone").val(objs.ManagerPhone);
            $("#ManagerEmail").val(objs.ManagerEmail);

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
                text: "Edit Team Details",
                class: "col-md-2 btn btn-success btn-sm mb-1 mr-1",
                role: "button"
            }))

            $("#buttonsDiv").append($("<a>", {
                href: "filterteams.html",
                text: "Back",
                class: "col-md-2 btn btn-primary btn-sm mb-1",
                role: "button"
            }))

            // Edit Team Details Button click
            $("#showAllBtn").on("click", function ()
            {
                $("#teams").empty();
                $("#selectDivision").val("All");
                //   displayCourseCatalog("none");

                // Get all data from API All Teams
                $.getJSON("/api/teams",
                    function (allTeams)
                    {
                        let allTeamsList = allTeams;
                        let allTeamsLength = allTeamsList.length;

                        // Call Create Table Head Row Function
                        insertHeadRow()

                        $("#teams").append("<tbody>");

                        for (let i = 0; i < allTeamsLength; i++)
                        {
                            insertRow(allTeamsList, i);
                        }
                    })
            })

            return;
        })
})