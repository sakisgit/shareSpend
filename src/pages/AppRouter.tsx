
import { BrowserRouter as Router, Routes , Route , useLocation} from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../components/homepage/HomePage';
import ShareSpendPage from '../components/ShareSpendPage/ShareSpendPage';
import LogInPage from '../components/LogPages/LogInPage';
import MainPage from '../components/MainPage/MainPage';
import Stats from '../components/StatsPage/Stats';
import Contact from '../components/Contact/Contact';
import Help from '../components/Help/Help';
import Error from '../components/ErrorPages/Error';

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        document.title = "HomePage | Share Spend";
        break;
      case '/sharespend':
        document.title = "ShareSpend Page | Share Spend";
        break;
      case '/loginpage':
        document.title = "Log In Page | Share Spend";
        break;
      case '/mainpage':
        document.title = "Main Page | Share Spend";
        break;
      case '/stats':
        document.title = "Statistics | Share Spend";
        break;
      case '/logoutpage':
        document.title = "Log out | Share Spend";
        break;
      case '/contact':
        document.title = "Contact | Share Spend";
        break;
      case '/help':
        document.title = "Help | Share Spend";
        break;
      default:
        document.title = "Error Page| Share Spend";
    }
  }, [location]);

  return null; 
};

const AppRouter = () => {
  return (
    <Router>
      <TitleUpdater/>
          <Routes>
              <Route path='/' element={<HomePage/>}/>
              <Route path='/sharespend' element={<ShareSpendPage/>}/>
              <Route path='/loginpage' element={<LogInPage/>}/>
              
              {/* Προστατευμένη σελίδα */}
              <Route 
                path='/mainpage' 
                element={
                  <ProtectedRoute>
                    <MainPage />
                  </ProtectedRoute>
                } 
              />

              <Route path='/logoutpage' element={<ShareSpendPage/>}/>
              <Route path='/contact' element={<Contact/>}/>
              <Route path='/stats' element={<Stats/>}/>
              <Route path='/help' element={<Help/>}/>
              <Route path='*' element={<Error/>}/>
          </Routes>
    </Router>
  )
}

export default AppRouter