import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthForm from './components/auth/form';
import Layout from './components/layout/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import ConflictMode from './pages/ConflictMode';
import Dashboard from './pages/Dashboard';
import DebateMode from './pages/DebateMode';
import NotFound from './pages/NotFound';
import RpgMode from './pages/RpgMode';
import StoryMode from './pages/StoryMode';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="story" element={<StoryMode />} />
            <Route path="rpg" element={<RpgMode />} />
            <Route path="conflict" element={<ConflictMode />} />
            <Route path="debate" element={<DebateMode />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path='/auth' element={<AuthForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;