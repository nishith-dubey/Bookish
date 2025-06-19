import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const AdminPanel = () => {
  const { user } = useSelector((state) => state.auth);
  const apiBaseUrl = "http://localhost:8000";
  const apiConfig = { headers: { token: `${localStorage.getItem("token")}` } };

  const [activeTab, setActiveTab] = useState("manage");
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [editingBookId, setEditingBookId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    coverImage: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const inputClasses =
    "w-full mb-4 p-3 bg-white border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium";
  const buttonClasses =
    "border-2 border-black w-full px-6 py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:bg-zinc-400 disabled:shadow-none disabled:cursor-not-allowed";

  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const { data } = await axios.get(`${apiBaseUrl}/books?limit=200`);
      setBooks(data.books);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const clearForm = () => {
    setForm({
      title: "",
      author: "",
      description: "",
      genre: "",
      coverImage: "",
    });
    setEditingBookId(null);
    setFormError("");
    setFormSuccess("");
  };

  const handleEditClick = (book) => {
    setEditingBookId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      description: book.description,
      genre: book.genre,
      coverImage: book.coverImage,
    });
    setActiveTab("add");
  };

  const handleCancelEdit = () => {
    clearForm();
    setActiveTab("manage");
  };

  const handleDeleteClick = async (bookId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this book? This action cannot be undone."
      )
    ) {
      try {
        const res = await axios.delete(`${apiBaseUrl}/books/${bookId}`, apiConfig);
        fetchBooks();
      } catch (err) {
        alert("Failed to delete the book.");
        console.error("Delete error:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormLoading(true);

    const method = editingBookId ? "patch" : "post";
    const url = editingBookId
      ? `${apiBaseUrl}/books/${editingBookId}`
      : `${apiBaseUrl}/books`;

    try {
      await axios[method](url, form, apiConfig);
      setFormSuccess(
        editingBookId
          ? "Book updated successfully!"
          : "Book added successfully!"
      );
      clearForm();
      fetchBooks();
      setTimeout(() => {
        setFormSuccess("");
        setActiveTab("manage");
      }, 2000);
    } catch (err) {
      setFormError(err?.response?.data?.message || "An error occurred.");
    } finally {
      setFormLoading(false);
    }
  };

  if (!user || user.user.role !== "admin") {
    return (
      <div className="bg-amber-50 min-h-screen pt-24 flex items-center justify-center p-4">
        <div className="bg-red-400 border-4 border-black text-black font-bold p-6 text-center shadow-[8px_8px_0px_#000]">
          <p>Unauthorized Access. Only Admins can view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen pt-24 pb-24">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-black mb-8">Admin Dashboard</h1>

        <div className="flex border-b-4 border-black mb-8">
          <button
            onClick={() => setActiveTab("manage")}
            className={`py-2 px-6 font-bold text-lg border-2 border-b-0 border-black ${
              activeTab === "manage" ? "bg-white -mb-px" : "bg-zinc-200"
            }`}
          >
            Manage Books
          </button>
          <button
            onClick={() => {
              setActiveTab("add");
              clearForm();
            }}
            className={`py-2 px-6 font-bold text-lg border-2 border-b-0 border-black ${
              activeTab === "add" ? "bg-white -mb-px" : "bg-zinc-200"
            }`}
          >
            {editingBookId ? "Edit Book" : "Add New Book"}
          </button>
        </div>

        {activeTab === "manage" && (
          <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_#000]">
            <h2 className="text-2xl font-black mb-4">Existing Books</h2>
            {loadingBooks ? (
              <p>Loading books...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-black">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="p-3 text-left">Title</th>
                      <th className="p-3 text-left">Author</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book._id} className="border-b-2 border-black">
                        <td className="p-3 font-semibold">{book.title}</td>
                        <td className="p-3">{book.author}</td>
                        <td className="p-3 text-center space-x-2">
                          <button
                            onClick={() => handleEditClick(book)}
                            className="bg-green-400 font-bold border-2 border-black px-3 py-1 hover:bg-green-500 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(book._id)}
                            className="bg-red-400 font-bold border-2 border-black px-3 py-1 hover:bg-red-500 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "add" && (
          <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000]">
            <h2 className="text-3xl font-black text-black mb-6">
              {editingBookId ? "Update Book Details" : "Add a New Book"}
            </h2>

            {formError && (
              <div className="bg-red-400 border-2 border-black text-black font-bold p-3 mb-4">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="bg-green-400 border-2 border-black text-black font-bold p-3 mb-4">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className={inputClasses}
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                required
                className={inputClasses}
              />
              <input
                type="text"
                name="genre"
                placeholder="Genre"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                required
                className={inputClasses}
              />
              <input
                type="text"
                name="coverImage"
                placeholder="Cover Image URL"
                value={form.coverImage}
                onChange={(e) =>
                  setForm({ ...form, coverImage: e.target.value })
                }
                required
                className={inputClasses}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                rows="3"
                className={inputClasses}
              />

              <div className="flex gap-4">
                {editingBookId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className={`${buttonClasses} bg-zinc-300 hover:bg-zinc-400 w-1/3`}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`${buttonClasses} bg-blue-400 hover:bg-blue-500 w-full`}
                >
                  {formLoading
                    ? editingBookId
                      ? "Updating..."
                      : "Adding..."
                    : editingBookId
                    ? "Update Book"
                    : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
