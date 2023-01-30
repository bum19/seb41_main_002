import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Review from "./Pages/Review";
import SignUp from "./Pages/SignUp";
import FindId from "./Pages/FindId";
import FindPw from "./Pages/FindPw";
import ResetPw from "./Pages/ResetPw";
import Checkout from "./Pages/Checkout";
import ItemDetail from "./Pages/ItemDetail";
import MemberPage from "./Pages/MemberPage";
import ItemsTopList from "./Pages/ItemsTopList";
import ShoppingPage from "./Pages/ShoppingPage";
import ShoppingCart from "./Pages/ShoppingCart";
import SkinTestPage from "./Pages/SkinTestPage";
import MemberPageEdit from "./Pages/MemberPageEdit";
import CompletePayment from "./Pages/CompletePayment";
import CompleteRegular from "./Pages/CompleteRegular";
import SubscriptionPage from "./Pages/SubscriptionPage";
import Footer from "./Components/Commons/Footer";
import EventDetail from "./Pages/EventDetail";
import Header from "./Components/Commons/Header";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="Browser_Container">
        <div className="Contents_Wrap">
          <Routes>
            <Route
              path="/members/:memberId/subscribe/complete"
              element={<CompleteRegular />}
            />
            <Route path="/payment/complete" element={<CompletePayment />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/findId" element={<FindId />} />
            <Route path="/findPw" element={<FindPw />} />
            <Route path="/resetPw" element={<ResetPw />} />
            <Route path="/memberPage/:memberId" element={<MemberPage />} />
            <Route path="/itemDetail/:itemId" element={<ItemDetail />} />
            <Route path="/" element={<Home />} />
            <Route path="/member/edit" element={<MemberPageEdit />} />
            <Route
              path="/items-list/:categoryENName"
              element={<ShoppingPage />}
            />
            <Route
              path="/items-top-list/:categoryENName"
              element={<ItemsTopList />}
            />
            <Route path="/members/:memberId/carts" element={<ShoppingCart />} />
            <Route path="/order/checkout" element={<Checkout />} />
            <Route path="/reviews/item/:itemId" element={<Review />} />
            <Route
              path="/members/:memberId/subscribe"
              element={<SubscriptionPage />}
            />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="skin-test/:memberId" element={<SkinTestPage />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
