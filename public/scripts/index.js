"use strict";

//Connect Events to HTML Elements
$(function ()
{
    // Get all data from API Leagues
    $.getJSON("/api/leagues",
        function (leagues)
        {
            let leaguesLength = leagues.length;
      
            sessionStorage.setItem("leagues", JSON.stringify(leagues));
                   
            for (let i = 0; i < leaguesLength; i++)
            {
                // Dynamically create hockey divisions (Name and Description)
                $("#hockeyDivisions").append($("<div>", {
                    id: leagues[i].Code,
                    class: "col-sm-3"
                }))

                $("#hockeyDivisions div:last").append($("<h2>", {
                    text: leagues[i].Name,
                }))

                $("#hockeyDivisions div:last").append($("<p>", {
                    text: leagues[i].Description,
                }))
            }
        })
})