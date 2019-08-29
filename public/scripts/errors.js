"use strict"

/* 
* This function displays the error message.
* 
* @param displayErrorField (HTML Element) - The HTML element that needs to be displayed
* @param displayErrorMessage (String) - The error message that will be displayed
*/
function displayError(displayErrorField, displayErrorMessage)
{   
    displayErrorField.text(displayErrorMessage);
    displayErrorField.css("display", "block");
}

/* 
* This function hides the error message.
* 
* @param hideErrorField (HTML Element) - The HTML element that needs to be hidden
*/
function hideError(hideErrorField)  
{
    hideErrorField.css("display", "none");
}

/* 
* This function displays block of error messages.
* 
* @param displayErrorField (HTML Element) - The HTML element that needs to be displayed
* @param displayErrorMessage (Array) - The error message array that will be displayed
*/
function displayErrors(displayErrorField, displayErrorMessage, errorFound)
{   
    for (let i = 0; i < displayErrorMessage.length; i++)
    {
        displayErrorField.append(displayErrorMessage[i] + "<br />");
    }

    if (errorFound)
    {
        displayErrorField.css("display", "block");
    }
}