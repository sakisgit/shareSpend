
import { BrowserRouter as Router, Routes , Route , useLocation} from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from '../homepage/HomePage';
import ShareSpendPage from '../ShareSpendPage/ShareSpendPage';
import LogInPage from '../LogPages/LogInPage';
import MainPage from '../MainPage/MainPage';
import Stats from '../StatsPage/Stats';
import Contact from '../Contact/Contact';
import Help from '../Help/Help';
import Error from '../ErrorPages/Error';

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
              <Route path='/mainpage' element={<MainPage/>}/>
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