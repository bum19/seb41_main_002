import React from "react";
import Home from "./Pages/Home";
import MemberPageEdit from "./Pages/MemberPageEdit";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ItemDetail from "./Pages/ItemDetail";
import ShoppingList from "./Pages/ShoppingList";
import ItemsTopList from "./Pages/ItemsTopList";
import ShoppingCart from "./Pages/ShoppingCart";

function App() {
  return (
    <>
      <div className="Browser_Container">
        <div className="Contents_Wrap">
          <BrowserRouter>
            <Routes>
              <Route path="/itemDetail/:itemId" element={<ItemDetail />} />
              <Route path="/" element={<Home />} />
              <Route path="/member/edit" element={<MemberPageEdit />} />
              <Route path="/items-list" element={<ShoppingList />} />
              <Route path="/items-top-list" element={<ItemsTopList />} />
              <Route path="/members/:memberId/carts" element={<ShoppingCart/>}/>
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </>
  );
}

export default App;