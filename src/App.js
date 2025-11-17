import "./App.css";
import { Home, Products, Cart, NotFound, SingleProduct } from "./components";
import { CartProvider } from "./context/CartContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path="/products/:category" element={<Products />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/:404" element={<NotFound />} />
          <Route path="/admin" element="" />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
