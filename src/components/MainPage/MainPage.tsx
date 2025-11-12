
import Footer from "../homepage/Footer/Footer";
import Header from "../homepage/Header/Header";
import MainNavBar from "../NavBar/MainNavBar";
import MainData from "./MainData/MainData";

const MainPage = () => {
  return (
    <>
      <Header NavBarComponent={MainNavBar}/>
      <MainData/>
      <Footer/>
    </>
  )
}

export default MainPage