document.addEventListener('DOMContentLoaded', function () {
  const books = [];
  const RENDER_EVENT = 'render-books';

  const submitBook = document.getElementById('inputBook');
  submitBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  })

  function addBook() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generatedid();
    const bookObject = generateBookObject(generatedID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete)
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generatedid() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    }
  }

  document.addEventListener(RENDER_EVENT, function () {
    console.log(books)
  })

    function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p')
    textYear.innerText = 'Tahun: ' + bookObject.year;


    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(textTitle, textAuthor, textYear);

    const action = document.createElement('div');
    action.classList.add('action')
    article.append(action);

    if (bookObject.isComplete) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('green')
      undoButton.innerText = "Belum selesai di Baca";

      undoButton.addEventListener('click', function () {
        undoBookFromCompleted(bookObject.id);
      })

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.innerText = "Hapus buku";

      deleteButton.addEventListener('click', function () {
        removeBookFromCompleted(bookObject.id);
      })

      action.append(undoButton, deleteButton);


    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('green');
      checkButton.innerText = "Selesai dibaca";

      checkButton.addEventListener('click', function () {
        addBookToCompleted(bookObject.id)
      })

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.innerText = "Hapus buku";

      deleteButton.addEventListener('click', function () {
        removeBookFromCompleted(bookObject.id);
      })
      action.append(checkButton, deleteButton);
    }


    return article;
  }

  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';


    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete) {
        uncompletedBOOKList.append(bookElement);
      } else {
        completedBOOKList.append(bookElement);
      }
    }
  });

  function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    } 
  }

  const SAVED_EVENT = 'saved-book';
  const STORAGE_KEY = 'BOOK_APPS';

  function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung');
      return false;
    }
    return true;
  }

  document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
  })

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

