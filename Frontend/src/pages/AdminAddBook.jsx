import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminAddBook = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", author: "", description: "", genre: "", coverImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Reusable style constants
  const inputClasses = "w-full mb-4 p-3 bg-white border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium";
  const buttonClasses = "border-2 border-black w-full px-6 py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:bg-zinc-400 disabled:shadow-none disabled:cursor-not-allowed";

  if (!user || user.user.role !== 'admin') {
    return (
        <div className="bg-amber-50 min-h-screen pt-24 flex items-center justify-center p-4">
            <div className="bg-red-400 border-4 border-black text-black font-bold p-6 text-center">
                <p>Unauthorized Access. Only Admins can view this page.</p>
            </div>
        </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/books", form, {
        headers: { token: `${localStorage.getItem("token")}` },
      });
      setSuccess("Book added successfully! Redirecting...");
      setForm({ title: "", author: "", description: "", genre: "", coverImage: "" });
      setTimeout(() => navigate("/"), 2000); // Redirect after 2s
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen p-24 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000]">
        <h2 className="text-3xl font-black text-black mb-6">Add a New Book</h2>

        {error && <div className="bg-red-400 border-2 border-black text-black font-bold p-3 mb-4">{error}</div>}
        {success && <div className="bg-green-400 border-2 border-black text-black font-bold p-3 mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required className={inputClasses} />
          <input type="text" name="author" placeholder="Author" value={form.author} onChange={handleChange} required className={inputClasses} />
          <input type="text" name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required className={inputClasses} />
          <input type="text" name="coverImage" placeholder="Cover Image URL" value={form.coverImage} onChange={handleChange} required className={inputClasses} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required rows="5" className={inputClasses} />
          
          <button type="submit" disabled={loading} className={`${buttonClasses} bg-blue-400 hover:bg-blue-500`}>
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddBook;