
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import HomePage from '../homepage/HomePage';
import Error from '../ErrorPages/Error';

const AppRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='*' element={<Error/>}/>
        </Routes>
    </Router>
  )
}

export default AppRouter