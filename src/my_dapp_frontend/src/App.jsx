import { useState } from 'react';
import { my_dapp_backend } from 'declarations/my_dapp_backend';
import Header from './components/Layout/Header';
import NavBar from './components/Layout/NavBar';
import Footer from './components/Layout/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import ProductList from './components/Products/ProductList';
import OrderList from './components/Orders/OrderList';

function App() {
  const [greeting, setGreeting] = useState('');

  // function handleSubmit(event) {
  //   event.preventDefault();
  //   const name = event.target.elements.name.value;
  //   my_dapp_backend.greet(name).then((greeting) => {
  //     setGreeting(greeting);
  //   });
  //   return false;
  // }

  return (
    <main>
      <Header>Supply Chain Dapp</Header>
      <NavBar />
      <Dashboard />
      <ProductList />
      <OrderList />
      <Footer />
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