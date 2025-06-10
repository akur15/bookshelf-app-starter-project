// Fungsi untuk menyimpan data buku pada localStorage
function saveBooks(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

// Fungsi untuk mengambil data buku dari localStorage
function getBooks() {
  const books = localStorage.getItem("books");
  return books ? JSON.parse(books) : [];
}

// Fungsi untuk menambahkan buku baru
function addBook(title, author, year, isComplete) {
  const books = getBooks();
  const newBook = {
    id: Number(new Date()),
    title,
    author,
    year,
    isComplete
  };
  books.push(newBook);
  saveBooks(books);
}

// Fungsi untuk menampilkan buku pada rak
function displayBooks() {
  const books = getBooks();
  const incompleteBookList = document.getElementById("incompleteBookshelfList");
  const completeBookList = document.getElementById("completeBookshelfList");
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach(book => {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Menangani submit formulir
document.getElementById("inputBook").addEventListener("submit", event => {
  event.preventDefault();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = Number(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  addBook(title, author, year, isComplete);
  displayBooks();
});

// Menangani klik tombol hapus
document.addEventListener("click", event => {
  if (event.target.getAttribute("data-testid") === "bookItemDeleteButton") {
    const bookId = event.target.parentNode.parentNode.getAttribute("data-bookid");
    deleteBook(bookId);
    displayBooks();
  }
});

// Fungsi untuk menghapus buku
function deleteBook(id) {
  const books = getBooks();
  const newBooks = books.filter(book => book.id !== Number(id));
  saveBooks(newBooks);
}

// Menangani klik tombol edit
document.addEventListener("click", event => {
  if (event.target.getAttribute("data-testid") === "bookItemEditButton") {
    const bookId = event.target.parentNode.parentNode.getAttribute("data-bookid");
    const book = getBookById(bookId);
    document.getElementById("inputBookTitle").value = book.title;
    document.getElementById("inputBookAuthor").value = book.author;
    document.getElementById("inputBookYear").value = book.year;
    document.getElementById("inputBookIsComplete").checked = book.isComplete;
    document.getElementById("bookSubmit").textContent = "Edit Buku";
    document.getElementById("bookSubmit").setAttribute("data-bookid", bookId);
  }
});

// Fungsi untuk mendapatkan buku berdasarkan id
function getBookById(id) {
  const books = getBooks();
  return books.find(book => book.id === Number(id));
}

// Menangani submit formulir edit
document.getElementById("inputBook").addEventListener("submit", event => {
  if (document.getElementById("bookSubmit").textContent === "Edit Buku") {
    event.preventDefault();
    const id = document.getElementById("bookSubmit").getAttribute("data-bookid");
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = Number(document.getElementById("inputBookYear").value);
    const isComplete = document.getElementById("inputBookIsComplete").checked;
    editBook(Number(id), title, author, year, isComplete);
    document.getElementById("bookSubmit").textContent = "Masukkan Buku ke rak";
    document.getElementById("bookSubmit").removeAttribute("data-bookid");
    displayBooks();
  }
});

// Fungsi untuk menyimpan data buku pada localStorage
function saveBooks(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

// Fungsi untuk mengambil data buku dari localStorage
function getBooks() {
  const books = localStorage.getItem("books");
  return books ? JSON.parse(books) : [];
}

  
