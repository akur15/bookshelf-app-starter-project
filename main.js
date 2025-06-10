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

// Initial load

loadBooks();

renderBooks();

  
