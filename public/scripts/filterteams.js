"use strict";

/* This function display or hides Course Catalog image.
*
* @param imgStatus (String) - "block" or "initial"
*/
function performTeamSearch(teams, teamsLength)
{
    $("#teams").empty();

    // Call Create Table Head Row Function
    insertHeadRow()

    $("#teams").append("<tbody>");

    for (let i = 0; i < teamsLength; i++)
    {
        if (($("#selectDivision option:selected").val() == "All") && (($("#selectGender option:selected").val() == "All")))
        {
            insertRow(teams, i);
        }
        else
        {
            if (($("#selectDivision option:selected").val() == teams[i].League) && ($("#selectGender option:selected").val() == "All"))
            {
                insertRow(teams, i);
            }
            else
            {
                if (($("#selectGender option:selected").val() == teams[i].TeamGender) && ($("#selectDivision option:selected").val() == "All"))
                {
                    insertRow(teams, i);
                }
                else
                {
                    if (($("#selectDivision option:selected").val() == teams[i].League) && ($("#selectGender option:selected").val() == teams[i].TeamGender))
                    {
                        insertRow(teams, i);
                    }
                }
            }
        }
    }
}

/* 
* This function inserts a Header Row into the Courses Table.
*/
function insertHeadRow()
{
    $("#teams").append("<thead>");
    $("#teams thead").append("<tr>");
    $("#teams thead tr").append($("<th>", { text: "Teams Name" }))
        .append($("<th>", { text: "Division" }))
        .append($("<th>", { text: "Manager Name" }))
        .append($("<th>", { colspan: "2", text: "Actions", class: "text-center" }));
}

/* 
* This function inserts a new row into the Course Table.
* 
* @param courses (Array) - The Courses array
* @param i (index to array) - The Courses arrays index
* @param allSelect (String) - Populated if "Select All" button clicked
*/
function insertRow(teams, i)
{
    $("#teams tbody").append("<tr>")
    $("#teams tbody tr:last").append($("<td>", { html: teams[i].TeamName }))
        .append($("<td>", { html: teams[i].League }))
        .append($("<td>", { html: teams[i].ManagerName }))
        .append("<td class='filterTeamsBtn'>");

    $("#teams tbody tr:last td:last").append($("<a>", {
        href: "detailsteam.html",
        id: "editBtn" + [i],
        //   text: "Edit",
        class: "btn btn-outline-success btn-sm",
        role: "button"
    }))

    $("#teams tbody tr:last td:last a").append($("<i>", { class: "fa fa-edit" }))
        .append($("<span>", { class: "buttontext", text: "Details" }))

    $("#teams tbody tr:last").append("<td class='filterTeamsBtn'>");
    $("#teams tbody tr:last td:last").append($("<a>", {
        href: "deleteteam.html",
        id: "deleteBtn" + [i],
       // text: "Delete",
        class: "btn btn-outline-danger btn-sm",
        role: "button"
    }))
    
    $("#teams tbody tr:last td:last a").append($("<i>", { class: "far fa-trash-alt" }))
    .append($("<span>", { class: "buttontext", text: "Delete" }))
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

        $("#selectDivision").append(option);
    }

    // Get all data from API All Teams
    $.getJSON("/api/teams",
        function (teams)
        {
            let teamsLength = teams.length;

            performTeamSearch(teams, teamsLength);

            // Select Division Field changed
            $("#selectDivision").on("change", function ()
            {
                performTeamSearch(teams, teamsLength);
            })

            // Select Gender Field changed
            $("#selectGender").on("change", function ()
            {
                performTeamSearch(teams, teamsLength);
            })

        })

    // Show All Button click
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

    // Add a New Team Button click
    $("#addTeamBtn").on("click", function ()
    {
        location.assign("newteam.html");
    })

    // Back Button click
    $("#backBtn").on("click", function ()
    {
        location.assign("index.html");
    })
})