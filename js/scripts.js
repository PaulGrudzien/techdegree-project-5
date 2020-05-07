const apiUrl = "https://randomuser.me/api/?results=12&nat=au,br,ca,ch,de,es,fi,gb,ie,nl,nz,us"
const gallery = document.getElementById("gallery")
const searchContainer = document.querySelector("div.search-container")
var people

/****************
 *              *
 * GLOBAL TOOLS *
 *              *
 ****************/

/**
 * Fetch an API request and extract JSON
 * @param  {string}  url - The url of the API request
 * @result {promise}     - The promise attatch to this request
 */
async function getJSON(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        throw error;
    };
};

/***********
 *         *
 * GALLERY *
 *         *
 ***********/

/**
 * Remove all the cards present on the gallery
 */
function clearGallery() {
    Array.from(gallery.children).forEach(child => {child.remove()});
};

/**
 * Make and show the card associated to a person
 * @param  {object}  person - The object containing the info of the person
 */
function makeCard(person) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-img-container">
            <img class="card-img" src="${person.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location.city}, ${person.location.country}</p>
        </div>`;
   gallery.appendChild(card);
   card.addEventListener("click", (event) => {showModal(person, card)});
};

/**
 * Execute the request to provide 12 profils
 * @result {promise}     - The promise attatch to this request
 */
async function getPeople() {
    people = await getJSON(apiUrl);
    return people
};

getPeople()
    .then((data) => {data.results.forEach(makeCard)})
    .catch( error => {
        gallery.innerHTML = '<h3>There is a problem!</h3>';
        console.error(error)
    });

/***************
 *             *
 * SHOW MODALS *
 *             *
 ***************/

/**
 * Close the opened modal
 */
function closeModal() {
    document.querySelector("div.modal-container").remove();
};

/**
 * Close the opened modal and open the previous modal (if exists)
 * @param  {object}  card - The card at the origin of this modal
 */
function prevModal(card) {
    const prevCard = card.previousElementSibling;
    if (prevCard !== null) {
        closeModal()
        prevCard.click();
    };
};

/**
 * Close the opened modal and open the next modal (if exists)
 * @param  {object}  card - The card at the origin of this modal
 */
function nextModal(card) {
    const nextCard = card.nextElementSibling;
    if (nextCard !== null) {
        closeModal()
        nextCard.click();
    };
};

/**
 * Close the opened modal and open the next modal (if exists)
 * @param  {object}  person - The object containing the info of the person
 * @param  {object}  card   - The clicked card
 */
function showModal(person, card) {
    const modal = document.createElement('div');
    modal.className = "modal-container";
    modal.innerHTML = `
    <div class="modal">
        <button type="button" onclick="closeModal()" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${person.picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="modal-text">${person.email}</p>
            <p class="modal-text cap">${person.location.city}</p>
            <hr>
            <p class="modal-text">${person.cell}</p>
            <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.state} ${person.location.postcode}</p>
            <p class="modal-text">Birthday: ${person.dob.date.replace(/^[0-9]{2}([0-9]{2})-([0-9]{2})-([0-9]{2}).*$/, "$2/$3/$1")}</p>
        </div>
    </div>
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>`;
    gallery.appendChild(modal);
    const btnPrev = document.getElementById("modal-prev");
    const btnNext = document.getElementById("modal-next");
    btnPrev.addEventListener("click", () => {prevModal(card)});
    btnNext.addEventListener("click", () => {nextModal(card)});
    document.body.appendChild(modal);
};

/**************
 *            *
 * SEARCH-BAR *
 *            *
 **************/

/**
 * Search profil by name and show their cards
 */
function searchProfil(event) {
    event.preventDefault();
    const name = document.getElementById("search-input").value;
    const regExp = new RegExp(name, 'i');
    clearGallery()
    people.results
        .filter(person => regExp.test(person.name.first) || regExp.test(person.name.last))
        .forEach(makeCard);
};

searchContainer.innerHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;

searchContainer.addEventListener("submit", searchProfil)
document.getElementById("search-input").addEventListener("keyup", searchProfil)
