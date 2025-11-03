
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import HomePage from '../homepage/HomePage';
import ShareSpendPage from '../ShareSpendPage/ShareSpendPage';
import Error from '../ErrorPages/Error';

const AppRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/shareSpend' element={<ShareSpendPage/>}/>
            <Route path='*' element={<Error/>}/>
        </Routes>
    </Router>
  )
}

export default AppRouter