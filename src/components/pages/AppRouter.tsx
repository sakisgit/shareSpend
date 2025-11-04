
import { BrowserRouter as Router, Routes , Route , useLocation} from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from '../homepage/HomePage';
import ShareSpendPage from '../ShareSpendPage/ShareSpendPage';
import Error from '../ErrorPages/Error';

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        document.title = "HomePage | Share Spend";
        break;
      case '/ShareSpend':
        document.title = "ShareSpend Page | Share Spend";
        break;
      case '/LogInPage':
        document.title = "ShareSpend Page | Share Spend";
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
              <Route path='/shareSpend' element={<ShareSpendPage/>}/>
              <Route path='*' element={<Error/>}/>
          </Routes>
    </Router>
  )
}

export default AppRouter