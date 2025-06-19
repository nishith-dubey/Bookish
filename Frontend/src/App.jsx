import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import SubmitReview from './pages/SubmitReview';
import RegisterUser from './components/RegisterUser.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './components/Navbar.jsx';
import AdminAddBook from './pages/AdminAddBook.jsx';
import Footer from './components/Footer.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/users/profile" element={<ProfilePage />} />
        <Route path="/books/:id/review" element={<SubmitReview />} />
        <Route path="/auth" element={<RegisterUser />} />
        <Route path="/admin/add-book" element={<AdminAddBook />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <Footer/>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
