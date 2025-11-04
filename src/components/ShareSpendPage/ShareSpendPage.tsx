
import Header from "../homepage/Header/Header"
import ShareNavBar from "../NavBar/ShareNavBar";
import LogOutPage from '../LogPages/LogOutPage'

const ShareSpendPage = () => {
  return (
    <>
        <Header NavBarComponent={ShareNavBar}/>
        <LogOutPage/>
    </>
  )
}

export default ShareSpendPage