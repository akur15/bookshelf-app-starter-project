
const bookapps = [];

const RENDER_EVENT = 'render-book';

const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('bookForm');

    submitForm.addEventListener('submit', function (event) {

        event.preventDefault();

        addBook();        

    });

    loadDataFromStorage();

    document.dispatchEvent(new Event(RENDER_EVENT));

});



function generateId() {

    return +new Date();

}

function generateBookObject(id, Judul, Penulis, Tahun, isCompleted) {

    return {

        id,

        Judul,

        Penulis,

        Tahun,

        isCompleted

    }

}

function addBook() {

    const Judul = document.getElementById('bookFormTitle').value;

    const Penulis = document.getElementById('bookFormAuthor').value;

    const Tahun = parseInt(document.getElementById('bookFormYear').value);

    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const generatedID = generateId();

    const bookObject = generateBookObject(generatedID, Judul, Penulis, Tahun, isComplete);

    bookapps.push(bookObject);

    saveData();

    document.dispatchEvent(new Event(RENDER_EVENT));

    document.getElementById('bookForm').reset();

      }
document.addEventListener(RENDER_EVENT, function () {

    const incompleteBookList = document.getElementById('incompleteBookList');

    const completeBookList = document.getElementById('completeBookList');

    // Kosongkan isi rak sebelum render ulang

    incompleteBookList.innerHTML = '';

    completeBookList.innerHTML = '';

    for (const book of bookapps) {

        const bookElement = makeBook(book);

        if (book.isCompleted) {

            completeBookList.append(bookElement);

        } else {

            incompleteBookList.append(bookElement);

        }

    }

});



function makeBook(book) {

    // Buat elemen untuk judul, penulis, dan tahun

    const textJudul = document.createElement('h3');

    textJudul.innerText = book.Judul;

    textJudul.setAttribute('data-tesid', 'bookItemTitle');

    const textPenulis = document.createElement('p');

    textPenulis.innerText = `Penulis: ${book.Penulis}`;

    textJudul.setAttribute('data-tesid', 'bookItemAuthor');

    const textTahun = document.createElement('p');

    textTahun.innerText = `Tahun: ${book.Tahun}`;

    textJudul.setAttribute('data-tesid', 'bookItemYear');

    // Bungkus informasi dalam container

    const textContainer = document.createElement('div');

    textContainer.classList.add('inner');

    textContainer.append(textJudul, textPenulis, textTahun);

    // Bungkus keseluruhan dalam item buku

    const container = document.createElement('div');

    container.classList.add('book_item');

    container.append(textContainer);

    container.setAttribute('id', `book-${book.id}`);

    container.setAttribute('data-bookid',  book.id);

    container.setAttribute('data-tesid', 'bookItem');

    // Tombol toggle

    const actionContainer = document.createElement('div');

    // Selesai dibaca / Belum selesai

    const completeButton = document.createElement('button');

    if (book.isCompleted) {

        completeButton.innerText = 'Belum selesai dibaca';

    } else {

        completeButton.innerText = 'Selesai dibaca';

    }

  completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');

    completeButton.addEventListener('click', function () {

        toggleBookStatus(book.id);

    });



    // Edit

    const editButton = document.createElement('button');

    editButton.innerText = 'Edit Buku';

    editButton.addEventListener('click', function () {

        editBook(book.id);

    });

    // Hapus

    const deleteButton = document.createElement('button');

    deleteButton.innerText = 'Hapus Buku';

    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');

    deleteButton.addEventListener('click', function () {

        deleteBook(book.id);

    });

    actionContainer.append(completeButton, editButton, deleteButton);

    container.append(actionContainer);

    return container;

}

function toggleBookStatus(bookId) {

    const bookTarget = bookapps.find(book => book.id === bookId);

    if (bookTarget != null) {

        bookTarget.isCompleted = !bookTarget.isCompleted;

        document.dispatchEvent(new Event(RENDER_EVENT));

    }

    saveData();

}

function deleteBook(bookId) {

    const bookIndex = bookapps.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {

        bookapps.splice(bookIndex, 1);

        document.dispatchEvent(new Event(RENDER_EVENT));

    }

    saveData();

}
function editBook(bookId) {

    const bookTarget = bookapps.find(book => book.id === bookId);

    if (!bookTarget) return;

    // Isi ulang form dengan data buku

    document.getElementById('bookFormTitle').value = bookTarget.Judul;

    document.getElementById('bookFormAuthor').value = bookTarget.Penulis;

    document.getElementById('bookFormYear').value = bookTarget.Tahun;

    document.getElementById('bookFormIsComplete').checked = bookTarget.isCompleted;

    // Hapus buku lama agar saat disubmit, dianggap sebagai buku baru

    deleteBook(bookId);

}

document.addEventListener(RENDER_EVENT, function () {

    console.log(bookapps);

});

function saveData() {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookapps));

}

function loadDataFromStorage() {

    const serializedData = localStorage.getItem(STORAGE_KEY);

    if (serializedData) {

        const data = JSON.parse(serializedData);

        for (const book of data) {

            bookapps.push(book);

        }

    }

    console.log('Loaded from storage:', bookapps); 

}


