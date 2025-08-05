const mInput = document.querySelector( '.BotInput textarea' );
const bBtn = document.querySelector( '.BotInput button' );
const bBox = document.querySelector( ".BotMessages" );
let userID = document.querySelector( "p" );
let message;

// Ensures that menu bar is closed on startup
document.getElementsByClassName( 'BotSidebar' )[ 0 ].classList.toggle( 'collapsed' );

// ----- Place valid API information here -----
const bURL = "Insert API URL here";
const bModel = "Insert properly formatted model name here";
const bAPI = "Insert API key here";
// ----- Place valid API information here -----

// Sets name passed to the LLM (WIP)
let bUser = "Guest";

// Creates list object and adds provided message to a specified class
const bList = ( m, className ) => 
{
    const mList = document.createElement( "list" );
    mList.classList.add( "mess", className );

    let mContent = `<p>${ m }</p>`;
    mList.innerHTML = mContent;

    // Check if user entered special "!ted" command
    if( m == "!ted" || m == "!Ted" || m == "!TED" )
    {
        // Import special image
        let ted = document.createElement( "img" );
        ted.src = "images/uni.jpg"
        ted.width = 320;
        ted.height = 213;
        ted.alt = "test";

        // Add image to the text area
        setTimeout( () => { bBox.appendChild( ted ); }, 600 );
    }

    return mList;
}

const bInput = () => 
{
    message = mInput.value.trim();

    // If the obtained message is invalid, return nothing
    if( !message )
    {
        alert( "Type something!" );
        return;
    }

    bBox.appendChild( bList( message, "outgoing-message" ) );
    bBox.scrollTo( 0, bBox.scrollHeight );

    // If this is set to true, skip LLM response
    let bSkip = false;

    setTimeout( () => { 
        if( message == "!ted" || message == "!Ted" || message == "!TED" )
        {
            iLi = bList( "Uni!", "incoming-message" );
            bSkip = true;
        }
        else if( message.substring( 0, 5 ) == "!echo" )
        {
            message = message.replace( "!echo", "" );
            iLi = bList( "echo: " + message, "incoming-message" );
            bSkip = true;
        }
        else
            iLi = bList( "Thinking...", "incoming-message" );
        
        bBox.appendChild( iLi );
        bBox.scrollTo( 0, bBox.scrollHeight );

        if( bSkip == false )
            bResponse( iLi );
        else
            mInput.value = '';

    }, 600 );
};

const bResponse = ( bIncoming ) => {
    const inputMessage = bIncoming.querySelector( "p" );

    if( localStorage.getItem( "name" ) && localStorage.getItem( "pass" ) )
        bUser = localStorage.getItem( "name" );
    else
        bUser = "Guest";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ bAPI }`
        },
        body: JSON.stringify ( {
            "message": `${ mInput.value }`, 
            "username": `${ bUser }`
        } )
    };

    fetch( bURL, requestOptions )
        .then( res => {
            if( !res.ok ) {
                throw new Error( "Connection Failed" );
            }
            return res.json();
        } )
        .then( data => {
            inputMessage.textContent = data.response;
            mInput.value = '';
        } )
        .catch( ( error ) => {
            inputMessage.classList.add( "error" );
            inputMessage.textContent = "Something on our end broke. Please try again!";
            mInput.value = '';
        } )
        .finally( () => bBox.scrollTo( 0, bBox.scrollHeight ) );
};

function createAccount() 
{
    // Let user provide a username and password
    const givenName = prompt( "Please enter your name" );
    const givenPass = prompt( "Please enter your password" );

    // Check if they entered anything into the prompts
    if( !givenName || !givenPass )
    {
        alert( "A username and password is required!" );
        createAccount(); 
    }
    else
    {
        localStorage.setItem( "name", givenName );
        localStorage.setItem( "pass", givenPass );
        bUser = givenName;
        userID.textContent = `Welcome ${ givenName }!`;
    }
}

function loginAccount()
{
    // Let user provide a username and password
    const givenName = prompt( "Please enter your name" );
    const givenPass = prompt( "Please enter your password" );

    // Check if they entered anything into the prompts
    if( !givenName || !givenPass )
        alert( "This user doesn't exist. You should register!" );
    else
    {
        const savedName = localStorage.getItem( "name" );
        const savedPass = localStorage.getItem( "pass" );

        if( ( savedName != givenName ) || ( savedPass != givenPass ) )
            alert( "Your username or password is incorrect!" )
        else
        {
            bUser = savedName;
            userID.textContent = `Welcome back ${ bUser }!`;
        }
    }
}

function deleteAccount() 
{
    // Ask user if they wish to go through with the deletion
    const userInput = prompt( "Are you sure you want to delete your account? Type 'YES' to confirm" );
    
    if( userInput != "YES" )
        alert( "Deletion cancelled" );
    else
    {
        localStorage.removeItem( "name" );
        localStorage.removeItem( "pass" );
        bUser = "Guest";
        userID.textContent = `Welcome Guest!`;
    }
}

bBtn.addEventListener( "click", bInput );

// If the user presses enter while highlighting the textbox, it will
// act as though they had clicked the "Send" button
mInput.addEventListener( "keypress", function( event ) {
    if( event.key === "Enter" )
    {
        event.preventDefault();
        bBtn.click();
    }
} );

// Check if a username or password is current stored for the user
if( !localStorage.getItem( "name" ) || !localStorage.getItem( "pass" ) )
{
    userID.textContent = `Welcome Guest!`;
    //createAccount();
}
else
{
    bUser = localStorage.getItem( "name" );
    userID.textContent = `Welcome ${ bUser }!`;
}
