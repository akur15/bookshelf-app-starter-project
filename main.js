// Bookshelf App JavaScript

const STORAGE_KEY = "BOOKSHELF_APP_BOOKS";

let books = [];

let editingBookId = null;

function saveBooks() {

  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

}

function loadBooks() {

  const data = localStorage.getItem(STORAGE_KEY);

  books = data ? JSON.parse(data) : [];

}

function generateId() {

  return +new Date();

}

function createBookObject(id, title, author, year, isComplete) {

  return { id, title, author, year, isComplete };

}

function clearForm() {

  document.getElementById("bookForm").reset();

  editingBookId = null;

  document.getElementById("bookFormSubmit").innerHTML =

    "Masukkan Buku ke rak <span>Belum selesai dibaca</span>";

}
function renderBooks(filterTitle = "") {

  const incompleteList = document.getElementById("incompleteBookList");

  const completeList = document.getElementById("completeBookList");

  incompleteList.innerHTML = "";

  completeList.innerHTML = "";

  books.forEach((book) => {

    if (

      filterTitle &&

      !book.title.toLowerCase().includes(filterTitle.toLowerCase())

    )

      return;

    const bookDiv = document.createElement("div");

    bookDiv.setAttribute("data-bookid", book.id);

    bookDiv.setAttribute("data-testid", "bookItem");

    const title = document.createElement("h3");

    title.setAttribute("data-testid", "bookItemTitle");

    title.textContent = book.title;

    const author = document.createElement("p");

    author.setAttribute("data-testid", "bookItemAuthor");

    author.textContent = `Penulis: ${book.author}`;

    const year = document.createElement("p");

    year.setAttribute("data-testid", "bookItemYear");

    year.textContent = `Tahun: ${book.year}`;

    const actions = document.createElement("div");

    const completeBtn = document.createElement("button");

    completeBtn.setAttribute("data-testid", "bookItemIsCompleteButton");

    completeBtn.textContent = book.isComplete

      ? "Belum selesai dibaca"

      : "Selesai dibaca";
      const deleteBtn = document.createElement("button");

    deleteBtn.setAttribute("data-testid", "bookItemDeleteButton");

    deleteBtn.textContent = "Hapus Buku";

    const editBtn = document.createElement("button");

    editBtn.setAttribute("data-testid", "bookItemEditButton");

    editBtn.textContent = "Edit Buku";

    actions.append(completeBtn, deleteBtn, editBtn);

    bookDiv.append(title, author, year, actions);

    if (book.isComplete) {

      completeList.appendChild(bookDiv);

    } else {

      incompleteList.appendChild(bookDiv);

    }

  });

}

// Add or Edit Book

const bookForm = document.getElementById("bookForm");

bookForm.addEventListener("submit", function (e) {

  e.preventDefault();

  const title = document.getElementById("bookFormTitle").value.trim();

  const author = document.getElementById("bookFormAuthor").value.trim();

  const year = document.getElementById("bookFormYear").value.trim();

  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (editingBookId) {

    // Edit mode

    const idx = books.findIndex((b) => b.id === editingBookId);

    if (idx !== -1) {

      books[idx] = { ...books[idx], title, author, year, isComplete };

    }

    editingBookId = null;

  } else {
          // Add mode

    const id = generateId();

    books.push(createBookObject(id, title, author, year, isComplete));

  }

  saveBooks();

  renderBooks();

  clearForm();

});

// Book Actions (Complete, Delete, Edit)

document

  .getElementById("incompleteBookList")

  .addEventListener("click", handleBookAction);

document

  .getElementById("completeBookList")

  .addEventListener("click", handleBookAction);

function handleBookAction(e) {

  const bookDiv = e.target.closest("[data-bookid]");

  if (!bookDiv) return;

  const bookId = Number(bookDiv.getAttribute("data-bookid"));

  const idx = books.findIndex((b) => b.id === bookId);

  if (idx === -1) return;

  if (e.target.matches('[data-testid="bookItemIsCompleteButton"]')) {

    books[idx].isComplete = !books[idx].isComplete;

    saveBooks();

    renderBooks();

  } else if (e.target.matches('[data-testid="bookItemDeleteButton"]')) {

    if (confirm("Yakin ingin menghapus buku ini?")) {
        books.splice(idx, 1);

      saveBooks();

      renderBooks();

    }

  } else if (e.target.matches('[data-testid="bookItemEditButton"]')) {

    // Fill form with book data

    document.getElementById("bookFormTitle").value = books[idx].title;

    document.getElementById("bookFormAuthor").value = books[idx].author;

    document.getElementById("bookFormYear").value = books[idx].year;

    document.getElementById("bookFormIsComplete").checked =

      books[idx].isComplete;

    editingBookId = books[idx].id;

    document.getElementById("bookFormSubmit").innerHTML = "Simpan Perubahan";

    window.scrollTo({ top: 0, behavior: "smooth" });

  }

}

// Search Book

const searchForm = document.getElementById("searchBook");

searchForm.addEventListener("submit", function (e) {

  e.preventDefault();

  const searchTitle = document.getElementById("searchBookTitle").value.trim();

  renderBooks(searchTitle);

});

document

  .getElementById("searchBookTitle")

  .addEventListener("input", function () {

    if (!this.value) renderBooks();

  });
document

  .getElementById("searchBookTitle")

  .addEventListener("input", function () {

    if (!this.value) renderBooks();

  });

// Initial load

loadBooks();

renderBooks();
