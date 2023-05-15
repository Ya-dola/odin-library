// CLASSES
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

    set books(value) {
        this._books = value;
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

// VARIABLES

// CONSTANTS
const classActive = "active";
const errorMsgTitle = " - Book Already Exists";
const statusReadTrue = "Completed";
const statusReadFalse = "Did Not Read";
const keyLocalStorage = 'library';

const library = new Library();

const gridBooks = document.getElementById('gridBooks');
const btnAddBook = document.getElementById('btnAddBook');
const overlay = document.getElementById('overlay');

const modalAddBook = document.getElementById('modalAddBook');
const formAddBook = document.getElementById('formAddBook');

const inputTitle = document.getElementById('inputTitle');
const inputAuthor = document.getElementById('inputAuthor');
const inputPages = document.getElementById('inputPages');
const inputReadStatus = document.getElementById('inputReadStatus');

// FUNCTIONS
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
    const newBook = new Book(inputTitle.value, inputAuthor.value,
                             inputPages.value, inputReadStatus.checked);

    library.addBook(newBook);
    createCardBook(newBook);

    saveData();
}

function deleteCardBook(bookTitle) {
    library.deleteBook(bookTitle);

    const deletedCard = document.getElementById(bookTitle);
    deletedCard ? deletedCard.remove() : console.log('Element Not Found');

    saveData();
}

function toggleReadStatus(bookTitle) {
    const selectedBook = library.findBook(bookTitle);
    const selectedBtnStatus =
        document.getElementById(bookTitle).querySelector('.status');

    selectedBook.readStatus = !selectedBook.readStatus;

    if (selectedBook.readStatus) {
        selectedBtnStatus.textContent = statusReadTrue;
        selectedBtnStatus.classList.remove("red");
    }
    else {
        selectedBtnStatus.textContent = statusReadFalse;
        selectedBtnStatus.classList.add("red");
    }

    saveData();
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
    btnStatus.textContent = book.readStatus ? statusReadTrue : statusReadFalse;

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

function resetGridBooks() {
    // Reset Books Grid in case previous invalid data exists
    gridBooks.innerHTML = "";
}

// Data Management
function saveData() {
    saveDataLocal();
}

function displaySavedData() {
    resetGridBooks();

    for (let book of library.books) createCardBook(book);
}

// Local Storage
function saveDataLocal() {
    localStorage.setItem(keyLocalStorage, JSON.stringify(library.books));
}

function restoreDataLocal() {
    const savedBooks = JSON.parse(localStorage.getItem(keyLocalStorage));

    if (savedBooks) {
        library.books = savedBooks.map(
            (savedBook) => new Book(savedBook._title, savedBook._author,
                                    savedBook._pages, savedBook._readStatus));
    }
    else library.books = [];
}

// EVENT LISTENERS
btnAddBook.addEventListener('click', openModalAddBook);
overlay.addEventListener('click', closeAllModals);

formAddBook.addEventListener('submit', (evt) => {
    // Prevent Default Submit Behaviour
    evt.preventDefault();

    if (!library.checkBookExists(inputTitle.value)) {
        addCardBook();
        closeAllModals();
    }
});

inputTitle.addEventListener('blur', () => {
    const inputTitleLabel = document.getElementById('inputTitleLabel');

    if (!library.checkBookExists(inputTitle.value)) {
        inputTitleLabel.classList.remove('error');
        inputTitleLabel.textContent = "Title";
    }
    else {
        inputTitleLabel.classList.add('error');
        inputTitleLabel.textContent += errorMsgTitle;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    restoreDataLocal();
    displaySavedData();
});

window.addEventListener('keydown', (evt) => {
    if (evt.key === "Escape") closeAllModals();
});
