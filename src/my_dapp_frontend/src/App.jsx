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
  // 

  return (
    <main>
      <BrowserRouter>
      <Header/>
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