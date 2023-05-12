// Classes
class Book {
    constructor(title = "",
                author = "",
                pages = 0,
                readStatus = false) {
        this._title = title;
        this._author = author;
        this._pages = pages;
        this._readStatus = readStatus;
    }

    get title() {
        return this._title;
    }

    get author() {
        return this._author;
    }

    get pages() {
        return this._pages;
    }

    set readStatus(value) {
        this._readStatus = value;
    }

    get readStatus() {
        return this._readStatus;
    }
}

class Library {

    constructor() {
        this._books = [];
    }

    get books() {
        return this._books;
    }

    addBook(newBook) {
        // Adds the new Book if it is not already in the Library
        if (!this.checkBookExists(newBook.title)) this._books.push(newBook);
    }

    deleteBook(title) {
        this._books = this._books.filter((book) => book.title !== title);
    }

    findBook(title) {
        return this._books.find((book) => book.title === title);
    }

    checkBookExists(title) {
        return this._books.some((book) => book.title === title);
    }
}

// Variables


// Constants
const classActive = "active";

const library = new Library();

const gridBooks = document.getElementById('gridBooks');
const btnAddBook = document.getElementById('btnAddBook');
const overlay = document.getElementById('overlay');

const modalAddBook = document.getElementById('modalAddBook');
const formAddBook = document.getElementById('formAddBook');

// Functions
function openModalAddBook() {
    formAddBook.reset();
    overlay.classList.add(classActive);
    modalAddBook.classList.add(classActive);
}

function closeAllModals() {
    modalAddBook.classList.remove(classActive);
    overlay.classList.remove(classActive);
}

function addCardBook() {
    const inputTitle = document.getElementById('inputTitle').value;
    const inputAuthor = document.getElementById('inputAuthor').value;
    const inputPages = document.getElementById('inputPages').value;
    const inputReadStatus = document.getElementById('inputReadStatus').checked;

    const newBook = new Book(inputTitle, inputAuthor, inputPages, inputReadStatus);

    library.addBook(newBook);
    createCardBook(newBook);
}

function deleteCardBook(bookTitle) {
    library.deleteBook(bookTitle);

    const deletedCard = document.getElementById(bookTitle);

    deletedCard ? deletedCard.remove() : console.log('Element Not Found');
}

function toggleReadStatus(bookTitle) {
    const selectedBook = library.findBook(bookTitle);

    const selectedBtnStatus =
        document.getElementById(bookTitle).querySelector('.status');

    selectedBook.readStatus = !selectedBook.readStatus;

    if (selectedBook.readStatus) {
        selectedBtnStatus.textContent = "Completed";
        selectedBtnStatus.classList.remove("red");
    }
    else {
        selectedBtnStatus.textContent = "Did Not Read";
        selectedBtnStatus.classList.add("red");
    }
}

function createCardBook(book) {
    // Card Elements
    const divCard = document.createElement('div');
    const divInfo = document.createElement('div');
    const divDetails = document.createElement('div');
    const h3Title = document.createElement('h3');
    const pAuthor = document.createElement('p');
    const pPages = document.createElement('p');
    const btnTrash = document.createElement('button');
    const divTrashIcon = document.createElement('div');
    const btnStatus = document.createElement('button');

    // Elements Styling
    divCard.classList.add("card");
    divInfo.classList.add("info");
    divDetails.classList.add("details");
    h3Title.classList.add("title");
    pAuthor.classList.add("author");
    pPages.classList.add("pages");
    btnTrash.classList.add("trash");
    divTrashIcon.classList.add("icon");
    btnStatus.classList.add("status");
    if (!book.readStatus)
        btnStatus.classList.add("red");

    // Elements Data
    divCard.id = book.title;
    h3Title.textContent = book.title;
    pAuthor.textContent = book.author;
    pPages.textContent = book.pages;
    btnStatus.textContent = book.readStatus ? "Completed" : "Did Not Read";

    // Elements Event Listeners
    btnTrash.addEventListener('click', (evt) => {
        deleteCardBook(evt.target.parentNode.parentNode.firstChild.firstChild.textContent);
    });
    btnStatus.addEventListener('click', (evt) => {
        toggleReadStatus(evt.target.parentNode.firstChild.firstChild.firstChild.textContent);
    });

    // Appending the Elements for the Card
    divDetails.appendChild(h3Title);
    divDetails.appendChild(pAuthor);
    divDetails.appendChild(pPages);
    divInfo.appendChild(divDetails);

    btnTrash.appendChild(divTrashIcon);
    divInfo.appendChild(btnTrash);

    divCard.appendChild(divInfo);
    divCard.appendChild(btnStatus);

    gridBooks.appendChild(divCard);
}

// TODO - Save to Local Storage

// Event Listeners
btnAddBook.addEventListener('click', openModalAddBook);
overlay.addEventListener('click', closeAllModals);
formAddBook.addEventListener('submit', (evt) => {
    // Prevent Default Submit Behaviour
    evt.preventDefault();

    const inputTitle = document.getElementById('inputTitle').value;

    if (!library.checkBookExists(inputTitle)) {
        addCardBook();
        closeAllModals();
    } // TODO - Show Error Msg
});
window.addEventListener('keydown', (evt) => {
    if (evt.key === "Escape") closeAllModals();
});
