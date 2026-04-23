import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import SearchPage from './pages/SearchPage';
import SearchResultPage from './pages/SearchResultPage';
import SubstituteComparisonPage from './pages/SubstituteComparisonPage';
import MedicineDetailPage from './pages/MedicineDetailPage';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/search-results" element={<SearchResultPage />} />
        <Route path="/substitute" element={<SubstituteComparisonPage />} />
        <Route path="/medicine/:id" element={<MedicineDetailPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <ScrollToTop />
    </Router>
  );
}

export default App;
