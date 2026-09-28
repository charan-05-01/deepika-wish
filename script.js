// ======================================================
// PAGE ELEMENTS
// ======================================================

// Area where the balloons float
const balloonArea = document.getElementById("balloonArea");

// Box that shows the message after a balloon is popped
// (it is also the dim overlay)
const message = document.getElementById("message");

// The text inside that box
const messageText = document.getElementById("messageText");

// The whole password box (label + slots)
const passwordDisplay = document.getElementById("passwordDisplay");

// The row that holds one slot per password character
const passwordSlots = document.getElementById("passwordSlots");

// Container that holds the confetti pieces
const confettiLayer = document.getElementById("confettiLayer");

// Password popup + final video elements
const passwordPrompt = document.getElementById("passwordPrompt");
const passwordInput = document.getElementById("passwordInput");
const passwordSubmit = document.getElementById("passwordSubmit");
const passwordError = document.getElementById("passwordError");
const videoScreen = document.getElementById("videoScreen");
const finalVideo = document.getElementById("finalVideo");
const finalMessage = document.getElementById("finalMessage");

// The character/mascot image. It is created here, but its
// picture, size and place on the page are set in setupCharacter()
const character = document.createElement("img");


// ======================================================
// BALLOON MESSAGES
// ======================================================

const balloonMessages = [

    "Some people enter your life quietly and somehow become one of the most important parts of it.",

    "If I had to keep only a few memories from these years, I know some of them would have you in them.",

    "You have this little way of making ordinary moments feel like memories worth keeping.",

    "There are conversations I don't remember word for word, but I remember how happy they made me feel.",

    "One of the nicest things about knowing you is that I never had to pretend to be someone else around you.",

    "Some friendships don't need constant conversations. Even after a while, you can come back and it still feels the same.",

    "I hope you never forget how many small moments you've made special without even realizing it.",

    "If our memories were photographs, I think I'd have a whole album filled with moments I would never want to delete.",

    "Growing older changes many things, but I hope the little things that make you who you are never change.",

    "There are people you meet, people you know, and then there are people who quietly become part of your story.",

    "I don't know what the next few years will look like, but I'm glad some part of my memories will always have you in them.",

    "Some of the best memories were never planned. They just happened while we were busy being ourselves.",

    "Years from now, I hope we can look back at these days and smile at how little we knew about the adventures waiting for us.",

    "You probably don't realize it, but there are moments where your presence alone has made a bad day feel a little lighter.",

    "Not every beautiful memory needs a special occasion. Sometimes it is just a random conversation, a stupid joke, or a moment of silence.",

    "Twenty years is only the beginning. There are still so many stories, places, mistakes, laughs and memories waiting ahead.",

    "I hope the person you become in the future still carries the same little things that made the person I know today so special.",

    "If life ever gets too busy and everything starts changing, I hope we never become strangers to the memories we created together.",

    "Some chapters end, some begin, and some people somehow manage to appear throughout the whole story.",

    "Today isn't just about turning another year older. It's about everything you've experienced, everyone you've met, and everything you've become.",

    "I hope this year gives you moments that make you stop, smile, and think, 'Yeah, this is exactly where I'm supposed to be.'",

    "You don't need to have everything figured out at twenty. You just need enough courage to keep discovering who you are.",

    "Whatever comes next, I hope there are more random laughs, unexpected adventures, unforgettable days and memories we'll talk about years later.",

    "And if you ever wonder whether the little moments mattered, they did. More than you probably realize.",

    "This is just one balloon, but there are so many little reminders waiting to tell you how much this journey means.",

    "Some people don't try to be unforgettable. They just are, without even knowing it.",

    "If happiness had a sound, I think some of it would sound like the random laughs we've shared.",

    "I hope this birthday reminds you how many people are quietly glad that you exist.",

    "There's something comforting about people who make you feel like you belong, even on the days you feel out of place.",

    "No matter how far the years take us, some memories will always feel like they happened just yesterday."
];


// ======================================================
// SOUND
// ======================================================

// Pop sound. "preload" loads it early so it plays instantly.
const popSound = new Audio("universfield-balloon-burst-383750.mp3");

popSound.preload = "auto";


// ======================================================
// SETTINGS (change these to tweak the page)
// ======================================================

// ---------- Balloons ----------

// How many balloons are on the screen at one time
const MAX_VISIBLE_BALLOONS = 7;

// Width of one balloon in pixels (should match your CSS)
const BALLOON_WIDTH = 175;

// Minimum gap between two balloons' final positions
const MIN_DISTANCE = 200;

// How many times we try to find a free spot before giving up
const MAX_POSITION_ATTEMPTS = 100;

// How many balloon images you have.
// 6 means balloon0.png ... balloon5.png
const BALLOON_IMAGE_COUNT = 6;

// How long (ms) a NORMAL message stays on screen
// (a password-reveal message stays until the reveal sequence ends)
const MESSAGE_DURATION = 5000;


// ---------- Password ----------

// The secret password (20 characters = 20 balloons).
// Every balloon that is created gets ONE position of this password.
// Popping that balloon reveals that character in ITS OWN box.
// (Avoid spaces: each character gets its own box.)
const PASSWORD = "DEEPIKAROYAL21102006";

// What is shown in a box that has not been revealed yet
const PASSWORD_PLACEHOLDER = "_";

// true  = each new balloon gets a RANDOM unused position
//         (pop order is unpredictable: e.g. 7th letter, then 15th)
// false = balloons get positions in order 1, 2, 3, ...
//         (first balloon created = first letter, and so on)
const RANDOM_PASSWORD_ASSIGNMENT = true;

// true  = the password box is visible from the start (_ _ _ _ style)
// false = it stays invisible until the first reveal
const SHOW_PASSWORD_FROM_START = true;

// Distance of the password box from the top of the screen.
// Any CSS length works: "4vh", "40px", "3%"
const PASSWORD_DISPLAY_TOP = "4vh";


// ---------- Character ----------

// Path to the character picture. Replace this file any time.
// (If the file cannot be found, a simple smiley is shown instead.)
const CHARACTER_IMAGE = "character.png";

// Width of the character. Any CSS length works.
// clamp(min, preferred, max) keeps it sensible on all screen sizes.
const CHARACTER_SIZE = "clamp(90px, 12vw, 160px)";

// Gap (px) between the bottom of the password box and the
// character's head when it stops
const CHARACTER_GAP_BELOW_PASSWORD = 12;


// ---------- Reveal timing (all in milliseconds) ----------
//
// Each value is "how long to wait AFTER the previous step".
// With the defaults below, the whole sequence looks like this
// (counted from the moment the message appears):
//
//   0.0s  message appears (dim is on)
//  10.0s  confetti launches
//  11.0s  character starts moving up
//  12.4s  character arrives under its password box
//  12.8s  password character is revealed
//  14.2s  character starts leaving
//  15.1s  character is gone
//  15.4s  dim starts fading
//  16.2s  dim gone, balloons clickable again

// Message appears -> confetti launches (time to read the message)
const REVEAL_CONFETTI_DELAY = 10000;

// Confetti launches -> character starts moving
const REVEAL_CHARACTER_DELAY = 1000;

// How long the character takes to travel to the password box
// (this is also the CSS transition length)
const CHARACTER_TRAVEL_TIME = 1400;

// Character arrived -> password character is revealed
const REVEAL_PAUSE_BEFORE_REVEAL = 400;

// Password character revealed -> character starts leaving
const REVEAL_PAUSE_AFTER_REVEAL = 1400;

// How long the character takes to leave the screen
const CHARACTER_EXIT_TIME = 900;

// Character gone -> dim starts fading
const REVEAL_PAUSE_BEFORE_FADE = 300;

// How long the dim takes to fade away
const DIM_FADE_TIME = 800;


// ---------- Final video ----------

// Video file (put it in the same folder as index.html)
const VIDEO_FILE = "birthday.mp4";

// Simple message shown after the video ends
const FINAL_MESSAGE = "Happy Birthday Deepika \u2764\uFE0F Thank you for watching!";

// How long (ms) that message stays before the website closes
const FINAL_MESSAGE_TIME = 5000;

// Funny messages for a wrong password (one is picked at random)
const WRONG_PASSWORD_MESSAGES = [
    "Nope! Even the balloons are laughing at that one \uD83C\uDF88",
    "Wrong password! Did you pop the balloons with your eyes closed? \uD83D\uDE04",
    "Almost... just kidding, not even close! Try again \uD83D\uDE1C",
    "That's not it! The password is hiding in the balloons, not in your imagination \uD83D\uDE05",
    "Oops! Wrong one. Check the letters at the top and try again \uD83E\uDDD0"
];


// ---------- Confetti ----------

// Pieces shot from EACH upper corner
const CONFETTI_PIECES_PER_CORNER = 45;

// How long one piece flies (each piece varies a little around this)
const CONFETTI_DURATION = 2600;

// Pieces start at slightly different times (0 to this many ms)
// so the burst looks natural instead of like one solid block
const CONFETTI_MAX_START_DELAY = 400;

// Colors picked at random for each piece
const CONFETTI_COLORS = [
    "#ff4d6d",
    "#ffd166",
    "#06d6a0",
    "#4cc9f0",
    "#9d4edd",
    "#ff9e00"
];


// ======================================================
// STATE (values that change while the page runs)
// ======================================================

// Index of the next message to show
// Shuffled list of message numbers still to be shown.
// Every message is shown once before any message repeats.
let messageQueue = [];

// Number of the message shown last (so a new round never starts with it)
let lastMessageIndex = -1;

// Timer id for hiding the message (so we can cancel it)
let messageTimer = null;

// What the game is doing right now:
//   "playing"   -> balloons can be popped
//   "revealing" -> the password sequence is running, clicks are ignored
let gameState = "playing";

// Password positions that no balloon has been given yet.
// Example for a 5-letter password at the start: [0, 1, 2, 3, 4]
// Every time a balloon is created, one number is taken out of this list.
let availablePasswordIndexes = [];

// How many password characters have been revealed so far
let revealedCount = 0;


// ======================================================
// PICK A RANDOM BALLOON IMAGE
// ======================================================

function getImage() {

    // Random whole number from 0 to (BALLOON_IMAGE_COUNT - 1)
    const randomInt =
        Math.floor(Math.random() * BALLOON_IMAGE_COUNT);

    // Template literal (backticks + ${}) puts the number in the name.
    // If your files start at 1 (balloon1.png ... balloon6.png),
    // use randomInt + 1 here.
    return `balloon${randomInt}.png`;
}


// ======================================================
// PRELOAD BALLOON IMAGES
// ======================================================
//
// Why it exists: loads every balloon picture once, up front, so the
// browser has them cached before balloons start appearing.
// Called once at the start of the page.
// If a file cannot be loaded, the console (F12) tells you which one.

const preloadedImages = [];

function preloadBalloonImages() {

    for (let i = 0; i < BALLOON_IMAGE_COUNT; i++) {

        const img = new Image();

        img.src = `balloon${i}.png`;

        img.addEventListener("error", function () {
            console.log("Could not load: " + img.src);
        });

        // Keep a reference so the browser does not throw them away
        preloadedImages.push(img);
    }
}


// ======================================================
// MESSAGE STYLES (edit, add or remove freely)
// ======================================================
//
// Each style is one object. Every property is optional:
//   color      : text color
//   fontFamily : font name (must be loaded, see note below)
//   fontSize   : size of the text
//   fontWeight : normal / bold / 300 / 700 ...
//   fontStyle  : normal / italic
//   textShadow : glow or shadow around the text
//
// NOTE: only common fonts work by default. For fancy fonts, add a
// Google Fonts <link> in your HTML <head> first, for example:
// https://fonts.google.com  (pick a font -> copy the <link>)

const messageStyles = [

    {
        color: "#ff4d6d",
        fontFamily: "'Pacifico', cursive",
        fontSize: "1.6rem",
        fontWeight: "normal",
        fontStyle: "normal",
        textShadow: "0 2px 6px rgba(255, 77, 109, 0.35)"
    },

    {
        color: "#6a4c93",
        fontFamily: "'Dancing Script', cursive",
        fontSize: "1.8rem",
        fontWeight: "bold",
        fontStyle: "normal",
        textShadow: "none"
    },

    {
        color: "#0077b6",
        fontFamily: "Georgia, serif",
        fontSize: "1.4rem",
        fontWeight: "normal",
        fontStyle: "italic",
        textShadow: "none"
    },

    {
        color: "#e76f51",
        fontFamily: "'Poppins', sans-serif",
        fontSize: "1.3rem",
        fontWeight: "600",
        fontStyle: "normal",
        textShadow: "0 1px 4px rgba(231, 111, 81, 0.3)"
    },

    {
        color: "#2a9d8f",
        fontFamily: "'Caveat', cursive",
        fontSize: "1.9rem",
        fontWeight: "bold",
        fontStyle: "normal",
        textShadow: "none"
    },

    {
        color: "#d4a017",
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.5rem",
        fontWeight: "bold",
        fontStyle: "italic",
        textShadow: "0 2px 6px rgba(212, 160, 23, 0.3)"
    }
];

// Index of the last style used (so the same style
// doesn't appear twice in a row)
let lastStyleIndex = -1;


// ======================================================
// PICK A RANDOM MESSAGE STYLE
// ======================================================

function getMessageStyle() {

    let index;

    // Keep picking until it is different from the last one
    // (only when there is more than one style to choose from)
    do {
        index = Math.floor(Math.random() * messageStyles.length);
    } while (index === lastStyleIndex && messageStyles.length > 1);

    lastStyleIndex = index;

    return messageStyles[index];
}


// ======================================================
// GET THE NEXT MESSAGE (in order)
// ======================================================

function getNextMessage() {

    // Queue empty: fill it with every message number and shuffle it
    if (messageQueue.length === 0) {

        messageQueue = balloonMessages.map(function (text, index) {
            return index;
        });

        // Fisher-Yates shuffle
        for (let i = messageQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = messageQueue[i];
            messageQueue[i] = messageQueue[j];
            messageQueue[j] = temp;
        }

        // Do not start a new round with the message that ended the last one
        if (messageQueue.length > 1 && messageQueue[0] === lastMessageIndex) {
            const temp = messageQueue[0];
            messageQueue[0] = messageQueue[messageQueue.length - 1];
            messageQueue[messageQueue.length - 1] = temp;
        }
    }

    lastMessageIndex = messageQueue.shift();

    return balloonMessages[lastMessageIndex];
}


// ======================================================
// FIND A SAFE POSITION
// (so balloons don't stop on top of each other)
// ======================================================

function getSafePosition() {

    // Room available for the balloon; never below 0
    const maxLeft =
        Math.max(0, window.innerWidth - BALLOON_WIDTH);

    for (let attempt = 0; attempt < MAX_POSITION_ATTEMPTS; attempt++) {

        // Random horizontal position (in px)
        const left = Math.random() * maxLeft;

        // Random final vertical position (in vh, 15 to 65)
        const stopTopVh = 15 + Math.random() * 50;

        // Convert vh to px so we can measure distance
        const stopTopPx = stopTopVh * window.innerHeight / 100;

        let safe = true;

        // Compare with every balloon already on screen
        const existingBalloons = document.querySelectorAll(".balloon");

        for (const existing of existingBalloons) {

            // Its horizontal position
            const existingLeft = parseFloat(existing.style.left);

            // Its final vertical position (stored as a CSS variable)
            const existingTopVh = parseFloat(
                existing.style.getPropertyValue("--stop-position")
            );

            // Convert to px
            const existingTopPx =
                existingTopVh * window.innerHeight / 100;

            // Straight-line distance between the two positions
            const distance = Math.hypot(
                left - existingLeft,
                stopTopPx - existingTopPx
            );

            // Too close: reject this position and try another
            if (distance < MIN_DISTANCE) {
                safe = false;
                break;
            }
        }

        // Nobody is too close, so use this position
        if (safe) {
            return { left: left, stopTopVh: stopTopVh };
        }
    }

    // Fallback: the screen is crowded and every attempt failed.
    // Return any random position so the page never freezes.
    return {
        left: Math.random() * maxLeft,
        stopTopVh: 15 + Math.random() * 50
    };
}


// ======================================================
// SMALL HELPER: WAIT
// ======================================================
//
// Why it exists: the reveal sequence is a list of steps with pauses
// between them. With wait() we can write those steps in order:
//
//     await wait(500);   // pause here for 500 ms, then continue
//
// instead of nesting many setTimeout() calls inside each other.

function wait(milliseconds) {

    return new Promise(function (resolve) {
        setTimeout(resolve, milliseconds);
    });
}


// ======================================================
// GIVE A PASSWORD POSITION TO A BALLOON
// ======================================================

// Fills the "available" list with every position of the password.
// Called once at start.
// Example: PASSWORD "DEEP" -> [0, 1, 2, 3]
function setupPasswordIndexes() {

    availablePasswordIndexes = [];

    for (let i = 0; i < PASSWORD.length; i++) {
        availablePasswordIndexes.push(i);
    }
}


// Takes ONE unused password position out of the list and returns it.
// Called from createBalloon(): each new balloon asks for its position.
// Returns null when every position has already been given out,
// which means the new balloon is a plain balloon without a character.
//
// Example with RANDOM_PASSWORD_ASSIGNMENT = true and [0, 1, 2, 3]:
//   it might return 2, and the list becomes [0, 1, 3]
// Example with RANDOM_PASSWORD_ASSIGNMENT = false and [0, 1, 2, 3]:
//   it returns 0, and the list becomes [1, 2, 3]
function takePasswordIndex() {

    // Nothing left to give
    if (availablePasswordIndexes.length === 0) {
        return null;
    }

    // Which entry of the list should we take?
    let listPosition = 0;

    if (RANDOM_PASSWORD_ASSIGNMENT) {
        listPosition =
            Math.floor(Math.random() * availablePasswordIndexes.length);
    }

    const passwordIndex = availablePasswordIndexes[listPosition];

    // Remove it from the list so no other balloon gets it
    availablePasswordIndexes.splice(listPosition, 1);

    return passwordIndex;
}


// ======================================================
// CREATE ONE BALLOON
// ======================================================

function createBalloon() {

    const balloon = document.createElement("img");

    // Random image from balloon0.png, balloon1.png, ...
    balloon.src = getImage();

    balloon.alt = "a balloon";

    // Stops the browser from dragging the image around
    balloon.draggable = false;

    // CSS class that styles and animates the balloon
    balloon.classList.add("balloon");

    // If this balloon's picture fails to load, try another image
    // (at most 3 times, so it can never loop forever)
    let imageRetries = 0;

    balloon.addEventListener("error", function () {

        console.log("Could not load: " + balloon.src);

        if (imageRetries < 3) {
            imageRetries++;
            balloon.src = getImage();
        }
    });


    // ---------- Position ----------

    const position = getSafePosition();

    // Horizontal position
    balloon.style.left = position.left + "px";

    // Where the balloon stops floating (used by the CSS animation)
    balloon.style.setProperty(
        "--stop-position",
        position.stopTopVh + "vh"
    );


    // ---------- Random floating speed ----------

    // Between 5 and 9 seconds to float up
    const floatTime = 5 + Math.random() * 4;

    balloon.style.setProperty("--float-time", floatTime + "s");


    // ---------- Secret password position ----------

    // Which character of the password this balloon hides.
    // A number (0 = first character, 1 = second, ...) or null
    // if every character has already been given to other balloons.
    const passwordIndex = takePasswordIndex();


    // ---------- Message ----------

    // The message is chosen when the balloon is POPPED (not created),
    // so messages always appear in order, whichever balloon you click.
    let currentMessage = "";

    // Has THIS balloon been popped already?
    // (This replaces { once: true }: the old option used up the
    // listener even for clicks we now want to ignore while revealing.)
    let isPopped = false;

    // Will THIS balloon's pop start a password reveal?
    // Only balloons that carry a password character do.
    let startsReveal = false;


    // ---------- Click: pop the balloon ----------

    balloon.addEventListener("click", function () {

        // The reveal sequence is running: ignore the click completely
        if (gameState !== "playing") {
            return;
        }

        // This balloon is already popping
        if (isPopped) {
            return;
        }

        isPopped = true;

        currentMessage = getNextMessage();

        // This balloon reveals something only if it carries a character
        startsReveal = passwordIndex !== null;

        // Lock the game immediately, so no other balloon can be
        // popped while this one blasts and the reveal plays
        if (startsReveal) {
            gameState = "revealing";
        }

        popBalloon(balloon);
    });


    // ---------- After the blast animation ends ----------

    balloon.addEventListener("animationend", function (event) {

        // The float animation also fires this event; ignore it
        if (event.animationName !== "blast") {
            return;
        }

        // Remove the popped balloon from the page
        balloon.remove();

        // Show its message.
        // "startsReveal" switches showMessage() to the special mode
        // where the dim stays on until the reveal sequence is finished.
        showMessage(currentMessage, startsReveal);

        // Special pop: start the confetti / character / reveal sequence
        // for THIS balloon's password position
        if (startsReveal) {
            runRevealSequence(passwordIndex);
        }

        // Add one new balloon to replace it
        createBalloon();
    });


    // Put the balloon on the page
    balloonArea.appendChild(balloon);
}


// ======================================================
// POP A BALLOON
// ======================================================

function popBalloon(balloon) {

    // Freeze the balloon where it is right now.
    // (The float animation controls "top", so we save the current
    // value before the blast animation replaces it.)
    balloon.style.top = getComputedStyle(balloon).top;

    // Play the pop sound.
    // cloneNode() lets several pops overlap without cutting off.
    const sound = popSound.cloneNode();

    sound.play().catch(function (error) {
        // Browsers can block sound; the game still works without it
        console.log(error);
    });

    // Start the blast animation (defined in your CSS)
    balloon.classList.add("blast");
}


// ======================================================
// SHOW A MESSAGE
// ======================================================
//
// isSpecialReveal = false -> normal: hides itself after MESSAGE_DURATION
// isSpecialReveal = true  -> no hide timer. The reveal sequence hides
//                            it later, when the character has left.

function showMessage(currentMessage, isSpecialReveal) {

    // Put the text on the page
    messageText.textContent = currentMessage;

    // Pick a random style and apply it.
    // Object.assign copies every property (color, fontFamily, ...)
    // onto the element's inline style.
    Object.assign(messageText.style, getMessageStyle());

    // Remove "show" first so the animation can restart
    message.classList.remove("show");

    // Trick: reading offsetWidth forces the browser to reset
    void messageText.offsetWidth;

    // Show the message
    message.classList.add("show");

    // Cancel the old hide-timer, otherwise a new message
    // could get hidden early by the previous message's timer
    clearTimeout(messageTimer);

    // Special reveal: do NOT start a hide timer.
    // MESSAGE_DURATION must not close the dim while the
    // password sequence is still running.
    if (isSpecialReveal) {
        return;
    }

    // Normal message: hide it after a few seconds
    messageTimer = setTimeout(function () {
        message.classList.remove("show");
    }, MESSAGE_DURATION);
}


// ======================================================
// PASSWORD DISPLAY
// ======================================================

// Builds one empty box per password character.
// Called once at start. It reads PASSWORD, so changing the
// password automatically changes the number of boxes.
function createPasswordDisplay() {

    passwordDisplay.style.top = PASSWORD_DISPLAY_TOP;

    for (let i = 0; i < PASSWORD.length; i++) {

        const slot = document.createElement("span");

        slot.classList.add("password-slot");

        slot.textContent = PASSWORD_PLACEHOLDER;

        passwordSlots.appendChild(slot);
    }

    // If the password should stay secret at first, hide the box
    if (!SHOW_PASSWORD_FROM_START) {
        passwordDisplay.classList.add("hidden");
    }
}


// Makes the password box visible (only matters when
// SHOW_PASSWORD_FROM_START is false). Called when the character
// starts moving, so the box appears as the character arrives.
function showPasswordDisplay() {

    passwordDisplay.classList.remove("hidden");
}


// Reveals the character at ONE specific position.
// Called from runRevealSequence() at the "reveal" moment.
// Changes: fills THAT box with its real letter. Every other box
// (revealed or not) is left exactly as it is.
//
// Example with PASSWORD = "DEEPIKAROYAL21102006":
//   passwordIndex 6  -> box 7 becomes "A":  _ _ _ _ _ _ A _ _ _ ...
//   passwordIndex 0  -> box 1 becomes "D":  D _ _ _ _ _ A _ _ _ ...
function revealPasswordCharacter(passwordIndex) {

    // The box that belongs to this position
    const slot = passwordSlots.children[passwordIndex];

    // Safety: no such box
    if (!slot) {
        return;
    }

    // Fill it with the real letter
    slot.textContent = PASSWORD[passwordIndex];
    revealedCount++;

    // "revealed" = permanent look, "just-revealed" = pop animation
    slot.classList.add("revealed", "just-revealed");

    // Remove the animation class when it finishes; "revealed" stays
    slot.addEventListener(
        "animationend",
        function () {
            slot.classList.remove("just-revealed");
        },
        { once: true }
    );
}


// ======================================================
// CHARACTER
// ======================================================

// A small smiley used only if CHARACTER_IMAGE cannot be loaded
// (so the sequence is testable before you have your own picture)
const CHARACTER_FALLBACK_IMAGE =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
        '<circle cx="50" cy="50" r="46" fill="#ffd166" stroke="#e76f51" stroke-width="4"/>' +
        '<circle cx="35" cy="40" r="6" fill="#333"/>' +
        '<circle cx="65" cy="40" r="6" fill="#333"/>' +
        '<path d="M28 60 Q50 82 72 60" fill="none" stroke="#333" stroke-width="5" stroke-linecap="round"/>' +
        '</svg>'
    );


// Prepares the character image once at start.
// It stays hidden (CSS default) until a reveal needs it.
function setupCharacter() {

    character.src = CHARACTER_IMAGE;

    character.alt = "character";

    character.draggable = false;

    character.classList.add("character");

    character.style.width = CHARACTER_SIZE;

    // If the picture is missing, use the fallback smiley instead
    character.addEventListener(
        "error",
        function () {
            character.src = CHARACTER_FALLBACK_IMAGE;
        },
        { once: true }
    );

    document.body.appendChild(character);
}


// Moves the character from below the screen to just under the
// box at the given password position. Returns when it has arrived.
// Called from runRevealSequence().
async function moveCharacterToPasswordSlot(passwordIndex) {

    // The box the character will point at
    const slot = passwordSlots.children[passwordIndex];

    // Where that box is on screen RIGHT NOW (works on any window size)
    const slotRect = slot.getBoundingClientRect();

    // Horizontal center of the box
    const centerX = slotRect.left + slotRect.width / 2;

    // Vertical stop: just below the password box
    const targetY = slotRect.bottom + CHARACTER_GAP_BELOW_PASSWORD;

    // Line the character up under the box (it is still hidden here)
    character.style.left = centerX + "px";

    // How long the movement should take
    character.style.transitionDuration = CHARACTER_TRAVEL_TIME + "ms";

    // Make it visible; it is still at its off-screen start position
    character.classList.add("visible");

    // Trick: forces the browser to register the start position,
    // otherwise it would skip the animation and jump
    void character.offsetWidth;

    // Change the transform: the CSS transition animates the movement
    character.style.transform = "translate(-50%, " + targetY + "px)";

    await wait(CHARACTER_TRAVEL_TIME);
}


// Small wiggle so the character "reacts" to the reveal.
function makeCharacterReact() {

    character.classList.add("react");
}


// Moves the character back off the bottom of the screen,
// then hides it. Returns when it is completely gone.
async function moveCharacterAway() {

    character.style.transitionDuration = CHARACTER_EXIT_TIME + "ms";

    // Removing the inline transform makes it fall back to the CSS
    // default (far below the screen), and the transition animates it
    character.style.transform = "";

    await wait(CHARACTER_EXIT_TIME);

    hideCharacter();
}


// Puts the character back to "invisible, waiting below the screen".
function hideCharacter() {

    character.classList.remove("visible", "react");

    character.style.transform = "";
}


// ======================================================
// CONFETTI
// ======================================================

// Shoots confetti from both upper corners.
// Called from runRevealSequence().
function launchConfetti() {

    createConfettiFromCorner("left");
    createConfettiFromCorner("right");

    // Safety net: even if some animationend event never fires,
    // wipe everything shortly after the longest possible piece
    // has finished, so nothing can pile up in the page.
    setTimeout(
        clearConfetti,
        CONFETTI_DURATION * 1.2 + CONFETTI_MAX_START_DELAY + 500
    );
}


// Creates all the pieces for ONE corner ("left" or "right").
function createConfettiFromCorner(side) {

    // Left corner sends pieces to the right (+), right corner to the left (-)
    const direction = side === "left" ? 1 : -1;

    for (let i = 0; i < CONFETTI_PIECES_PER_CORNER; i++) {

        const piece = document.createElement("div");

        piece.classList.add("confetti-piece");

        // Start in the chosen corner
        piece.style.left = side === "left" ? "0" : "100%";

        // Random look
        const width = 6 + Math.random() * 6;
        const height = 8 + Math.random() * 8;

        piece.style.width = width + "px";
        piece.style.height = height + "px";

        piece.style.backgroundColor =
            CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

        // Some pieces are round, some rectangular
        if (Math.random() < 0.3) {
            piece.style.borderRadius = "50%";
        }

        // Where the piece ends up (relative to its corner):
        // 15-50% of the screen width toward the center,
        // 40-100% of the screen height downward
        const dx = direction * (15 + Math.random() * 35);
        const dy = 40 + Math.random() * 60;

        // Random spin, clockwise or counter-clockwise
        const spin = (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 720);

        // Each piece flies slightly shorter or longer than the setting
        const duration = CONFETTI_DURATION * (0.8 + Math.random() * 0.4);

        piece.style.setProperty("--dx", dx + "vw");
        piece.style.setProperty("--dy", dy + "vh");
        piece.style.setProperty("--spin", spin + "deg");
        piece.style.setProperty("--confetti-duration", duration + "ms");

        // Staggered start so it looks like a burst, not a block
        piece.style.animationDelay =
            Math.random() * CONFETTI_MAX_START_DELAY + "ms";

        // Remove this piece from the page as soon as it finishes
        piece.addEventListener("animationend", function () {
            piece.remove();
        });

        confettiLayer.appendChild(piece);
    }
}


// Removes every remaining confetti piece.
function clearConfetti() {

    confettiLayer.innerHTML = "";
}


// ======================================================
// THE REVEAL SEQUENCE (the "timeline")
// ======================================================
//
// Why it exists: runs every special step in order, with pauses.
// Called from: the balloon's animationend handler, right after the
//   message has been shown, and only for balloons that carry a
//   password character.
// Receives: passwordIndex = which character/box this balloon owns.
// Changes: shows confetti and the character, updates that one box
//   of the password display, fades the dim away, and finally sets
//   gameState back to "playing".
//
// "async" lets us use "await": each await pauses THIS function until
// that step is done, while the rest of the page keeps running.

async function runRevealSequence(passwordIndex) {

    try {

        // The message is already showing (dim is on)
        await wait(REVEAL_CONFETTI_DELAY);

        // Confetti from the upper corners
        launchConfetti();

        await wait(REVEAL_CHARACTER_DELAY);

        // Character enters and travels to THIS balloon's box
        showPasswordDisplay();
        await moveCharacterToPasswordSlot(passwordIndex);

        // Short pause, then the new character appears
        await wait(REVEAL_PAUSE_BEFORE_REVEAL);
        revealPasswordCharacter(passwordIndex);
        makeCharacterReact();

        // Character stays and reacts for a moment
        await wait(REVEAL_PAUSE_AFTER_REVEAL);

        // Character leaves the screen
        await moveCharacterAway();

        // Everything is done: now (and only now) fade the dim away
        await wait(REVEAL_PAUSE_BEFORE_FADE);
        await fadeOutDim();

    } catch (error) {

        // If anything unexpected goes wrong, clean up so the
        // game can never stay locked forever
        console.log(error);

        hideCharacter();
        clearConfetti();
        message.classList.remove("show");
    }

    // All characters found: lock the game and ask for the password
    if (revealedCount >= PASSWORD.length) {
        gameState = "finished";
        showPasswordPrompt();
        return;
    }

    // Balloons can be popped again
    gameState = "playing";
}


// Removes the "show" class; the CSS transition fades the dim out.
// Returns when the fade has finished.
async function fadeOutDim() {

    message.classList.remove("show");

    await wait(DIM_FADE_TIME);
}


// ======================================================
// PASSWORD POPUP + FINAL VIDEO
// ======================================================

// Shows the "Congratulations" popup with the password box.
function showPasswordPrompt() {

    passwordError.textContent = "";
    passwordInput.value = "";

    passwordPrompt.classList.add("show");

    passwordInput.focus();
}

// Checks what was typed. Upper/lower case does not matter.
function checkPassword() {

    const typed = passwordInput.value.trim().toUpperCase();

    if (typed === PASSWORD) {

        passwordPrompt.classList.remove("show");

        playFinalVideo();

        return;
    }

    // Wrong: funny message, clear the box, try again
    const index = Math.floor(Math.random() * WRONG_PASSWORD_MESSAGES.length);

    passwordError.textContent = WRONG_PASSWORD_MESSAGES[index];

    passwordInput.value = "";
    passwordInput.focus();
}

// Plays the video full screen (sound on, no controls).
// This runs right after a click / Enter key, so the browser allows sound.
function playFinalVideo() {

    finalVideo.src = VIDEO_FILE;

    finalVideo.controls = false;

    videoScreen.classList.add("show");

    finalVideo.addEventListener("ended", showFinalMessage, { once: true });

    // If the video is missing or cannot play, do not get stuck
    finalVideo.addEventListener("error", showFinalMessage, { once: true });

    finalVideo.play().catch(function (error) {
        console.log(error);
        showFinalMessage();
    });
}

// Video finished: show the message, then close the website.
async function showFinalMessage() {

    finalMessage.textContent = FINAL_MESSAGE;

    videoScreen.classList.add("done");

    await wait(FINAL_MESSAGE_TIME);

    // Browsers only allow close() for windows opened by a script,
    // so if it does not close, go to a blank page instead.
    window.close();

    setTimeout(function () {
        window.location.replace("about:blank");
    }, 300);
}

passwordSubmit.addEventListener("click", checkPassword);

passwordInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        checkPassword();
    }
});


// ======================================================
// APPLY SETTINGS THAT LIVE IN CSS
// ======================================================
//
// The dim fade is done by a CSS transition, so JavaScript passes
// DIM_FADE_TIME to the CSS as a variable. This keeps the timing
// in ONE place (this file).

function applySettingsToCss() {

    document.documentElement.style.setProperty(
        "--dim-fade-time",
        DIM_FADE_TIME + "ms"
    );
}


// ======================================================
// START: set everything up and create the first balloons
// ======================================================

applySettingsToCss();

// Must run BEFORE the first balloon is created,
// because every balloon asks for a password position
setupPasswordIndexes();

createPasswordDisplay();

setupCharacter();

// Load all balloon pictures first so they are cached
preloadBalloonImages();

// Called from index.html when the candle is clicked and the lights come back
function startGame() {
    for (let i = 0; i < MAX_VISIBLE_BALLOONS; i++) {
        createBalloon();
    }
}