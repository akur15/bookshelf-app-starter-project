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
    title: Judul,
    author: Penulis,
    year: Tahun,
    isComplete: isCompleted,
  }
}

function addBook() {
  const submitButton = document.getElementById('bookSubmit');
  const Judul = document.getElementById('bookFormTitle').value;
  const Penulis = document.getElementById('bookFormAuthor').value;
  const Tahun = parseInt(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;
  let generatedID;

  if (submitButton.hasAttribute('data-bookid')) {
    generatedID = parseInt(submitButton.getAttribute('data-bookid'));
    const bookIndex = bookapps.findIndex(book => book.id === generatedID);
    bookapps[bookIndex] = generateBookObject(generatedID, Judul, Penulis, Tahun, isComplete);
    submitButton.innerText = 'Tambah Buku';
    submitButton.removeAttribute('data-bookid');
  } else {
    generatedID = generateId();
    const bookObject = generateBookObject(generatedID, Judul, Penulis, Tahun, isComplete);
    bookapps.push(bookObject);
  }

  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
  document.getElementById('bookForm').reset();
}

function makeBook(book) {
  const textJudul = document.createElement('h3');
  textJudul.innerText = book.title;
  textJudul.setAttribute('data-testid', 'bookItemTitle');

  const textPenulis = document.createElement('p');
  textPenulis.innerText = `Penulis: ${book.author}`;
  textPenulis.setAttribute('data-testid', 'bookItemAuthor');

  const textTahun = document.createElement('p');
  textTahun.innerText = `Tahun: ${book.year}`;
  textTahun.setAttribute('data-testid', 'bookItemYear');

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textJudul, textPenulis, textTahun);

  const container = document.createElement('div');
  container.classList.add('book_item');
  container.append(textContainer);
  container.setAttribute('id', `book-${book.id}`);
  container.setAttribute('data-bookid', book.id);
  container.setAttribute('data-testid', 'bookItem');

  const actionContainer = document.createElement('div');

  const completeButton = document.createElement('button');
  if (book.isComplete) {
    completeButton.innerText = 'Belum selesai dibaca';
  } else {
    completeButton.innerText = 'Selesai dibaca';
  }
  completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  completeButton.addEventListener('click', function () {
    toggleBookStatus(book.id);
  });

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit Buku';
  editButton.addEventListener('click', function () {
    editBook(book.id);
  });

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
    bookTarget.isComplete = !bookTarget.isComplete;
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
    
  document.getElementById('bookFormTitle').value = bookTarget.title;
  document.getElementById('bookFormAuthor').value = bookTarget.author;
  document.getElementById('bookFormYear').value = bookTarget.year;
  document.getElementById('bookFormIsComplete').checked = bookTarget.isComplete;

  const submitButton = document.getElementById('bookSubmit');
  submitButton.innerText = 'Edit Buku';
  submitButton.setAttribute('data-bookid', bookId);
}

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of bookapps) {
    const bookElement = makeBook(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
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
