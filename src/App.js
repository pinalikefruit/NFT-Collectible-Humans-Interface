import { Routes, Route } from"react-router-dom";
import Home from"./views/home";
import Punks from "./views/punks";
import Punk from "./views/punk";
// import { useEffect } from "react";
// import Web3 from "web3";
import MainLayout from "./layouts/main";

function App() {
  // useEffect(() => {
  //   if( window.ethereum ) {
  //     // window.ethereum
  //     // .request({
  //     //   method:"eth_requestAccounts",
  //     // })
  //     // .then((accounts) => console.log(accounts))

  //     const web3 = new Web3(window.ethereum);
  //     web3.eth.requestAccounts().then(console.log);
  //   }

  // },[]);
  return (
    <>
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/humans" element={<Punks/>} />
        <Route path="/humans/:tokenId" element={<Punk/>} />
      </Routes>
    </MainLayout>
    </>
  );
}

export default App;