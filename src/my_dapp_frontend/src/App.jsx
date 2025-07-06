import { useState } from 'react';
import { my_dapp_backend } from 'declarations/my_dapp_backend';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ProductList from './components/Products/ProductList';
import OrderList from './components/Orders/OrderList';
import Homepage from './components/Layout/HomePage';


function App() {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (name, role) => {
    setUserName(name);
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserName('');
    setUserRole(null);
    setIsLoggedIn(false);
  };

  // if (!isLoggedIn) {
  //   return <Login onLogin={handleLogin} />;
  // }

  return (
    <main>
      <BrowserRouter>
      <Header userRole={userRole} userName={userName} onLogout={handleLogout} />
      <Routes>
        <Route path= "/" element= {<Homepage/>}/>
        <Route path= "/dashboard" element= {<Dashboard/>}/>
        <Route path= "/products" element= {<ProductList/>}/>
        <Route path= "/orders" element= {<OrderList/>}/>
      
     </Routes>
     <Footer />
      </BrowserRouter>
     
    </main>
  );
}

export default App;


// <img src="/logo2.svg" alt="DFINITY logo" />
// <br />
// <br />
// <form action="#" onSubmit={handleSubmit}>
//   <label htmlFor="name">Enter your name: &nbsp;</label>
//   <input id="name" alt="Name" type="text" />
//   <button type="submit">Click Me!</button>
// </form>
// <section id="greeting">{greeting}</section>


// const [greeting, setGreeting] = useState('');

  // // function handleSubmit(event) {
  // //   event.preventDefault();
  // //   const name = event.target.elements.name.value;
  // //   my_dapp_backend.greet(name).then((greeting) => {
  // //     setGreeting(greeting);
  // //   });
  // //   return false;
  // // }