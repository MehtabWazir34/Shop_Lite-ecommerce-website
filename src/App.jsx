
import { useEffect, useState } from "react";
import "./index.css";
import Header from "./Comp/Header";
import Footer from "./Comp/Footer";
import { Route, Routes, useLocation, BrowserRouter } from "react-router-dom";
import MainBody from "./Comp/MainBody";
import Login from "./Account/Login";
import SignUp from "./Account/Signup";
import CartBox from "./Comp/CartBox";
import MyCart from "./Comp/MyCart";
import Hero from "./Comp/Hero";
import About from "./Comp/About";
import Shop from "./Comp/Shop";
import products from "./Comp/ProductList";
import { BsCartCheck } from 'react-icons/bs';
import { BsCartX } from 'react-icons/bs';
import CategoryFilterButton from "./MiniParts/CategoryFilterButton";
import ProfilePage from "./Account/ProfilePage";
import UserDetail from "./Account/UserDetail";
import ProPicture from "./Account/ProPicture";
import Contact from "./Comp/ContactForm";
import FeaturedQuality from "./Comp/FeaturedQuality";
import FeaturedPro from "./Comp/FeaturedPro";
import Logo from "./Comp/Logo";
import { AuthProvider, useAuth } from "./Auth/AuthContext";
import ItemDetails from "./Comp/ItemDetails";
import AccountOptions from "./Account/AccountOptions";
import MobileMenu from "./Comp/MobileMenu";
import { AnimatePresence, motion } from "framer-motion";
import OrderDetails from "./Comp/OrderDetails";
import OrderHistory from "./Account/OrderHistory";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import FeedBackForm from "./Account/FeedBackForm";
import VerifyEmail from "./Account/VerifyEmailPage";
import VerifyEmailPending from "./Account/VerifyEmailPending";
import OAuthSuccess from "./Auth/AuthSucces";
import OAuthFail from "./Auth/AuthFail";
import CreateProduct from "./Account/CreateProduct";
import CreatedProducts from "./Comp/CreatedProducts";
import { DataBases } from "./Auth/Config";
import CartOrder from "./Comp/CartOrder";

function AppContent() {
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [searching, searchItems] = useState('');
  const [filterOutItems, setFilterItems] = useState(products);
  const [categoryButton, setCateButton] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  let location = useLocation();

  const seeDetailsFun = (ItemID) => {
    return products.find((eachItem) => eachItem.id === ItemID);
  };

  useEffect(() => {
    let p = products;
    if (searching.trim() !== '') {
      p = p.filter((eachItems) =>
        eachItems.title.toLocaleLowerCase().includes(searching.toLocaleLowerCase())
      );
    }
    if (categories.length > 0) {
      p = p.filter((item) => categories.includes(item.cate));
    }
    setFilterItems(p);
  }, [searching, categories]);

  const addToCart = (item) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      window.location.href = '/login';
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  useEffect(() => {
    setLoading(true);
    let timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [location]);

  const [accountOpts, setAccountOpts] = useState(false);
  const [mobileMenuOpn, setMobileMenu] = useState(false);

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };


    const [manualProducts, setManualProducts] = useState([]);  // your static products
  const [userProducts, setUserProducts] = useState([]);
  

  const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
  const myProductsTable = import.meta.env.VITE_APPWRITE_MyProductsTable_ID;

  function mapProduct(doc) {
    return {
      id: doc.$id,
      title: doc.title,
      price: doc.price,
      img: doc.ImgLink,
      detail: doc.description,
      cate: doc.category,
    };
  }

  async function fetchUserProducts() {
    try {
      const res = await DataBases.listDocuments(databaseId, myProductsTable);
      setUserProducts(res.documents.map(mapProduct));
      setManualProducts(filterOutItems)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserProducts();
  }, );

  // ✅ Combine Manual + User Uploaded
  const allProducts = [...manualProducts, ...userProducts];

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark
        ? 'bg-gradient-to-b  from-[#070F2B] to-[#1B1A55]'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }`}>
      {loading && (
        <div className={`w-full min-h-screen inset-0 z-50 fixed flex items-center justify-center ${isDark ? 'bg-gradient-to-b  from-[#070F2B] to-[#1B1A55]' : ''
          }`}>
          <Logo />
        </div>
      )}

      <main className="w-full min-h-screen flex flex-col gap-2">
        <Header
          btnText={openCart ? <BsCartX /> : <BsCartCheck />}
          searching={searching}
          searchItems={searchItems}
          ontoggle={() => setOpenCart(!openCart)}
          currentItems={cartItems.length}
          setCateButton={() => setCateButton(!categoryButton)}
          AccountOptBtn={() => setAccountOpts(!accountOpts)}
          mobileMenu={() => setMobileMenu(!mobileMenuOpn)}
          toggleDarkMode={toggleTheme}
          darkMode={isDark}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex-1"
          >
            <Routes>
              <Route path="/" element={<Hero addToCart={addToCart} />} />
              <Route path="/login" element={<Login isDark={isDark} />} />
              <Route path="/signup" element={<SignUp isDark={isDark} />} />
              <Route path="/profilepage" element={<ProfilePage isDark={isDark} />} />
              <Route path="/userdetail" element={<UserDetail />} />
              <Route path="/propicture" element={<ProPicture />} />
              <Route path="/contactform" element={<Contact />} />
              <Route path="/featuredquality" element={<FeaturedQuality />} />
              <Route path="/about" element={<About />} />
              <Route path="/shop" element={<Shop seeDetails={seeDetailsFun} onAdd={addToCart} products={allProducts} />} />
              <Route path="/itemdetails/:id" element={<ItemDetails isDark={isDark} addToCart={addToCart} product={seeDetailsFun} />} />
              <Route path="/cartbox" element={<CartBox cartItems={cartItems} setCartItems={setCartItems} />} />
              <Route path="/orderdetails/:id" element={<OrderDetails isDark={isDark} />} />
              <Route path="/yourorders" element={<OrderHistory isDark={isDark} />} />
              <Route path="/feedbackform" element={<FeedBackForm />} />

              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/verify-email-pending" element={<VerifyEmailPending />} />
 
              <Route path="/oauth-success" element={<OAuthSuccess />} />
              <Route path="/oauth-fail" element={<OAuthFail/>} /> 
              <Route path="createproduct" element={<CreateProduct isDark={isDark}/>}/>
              <Route path="cart-checkout" element={<CartOrder />}/>

            </Routes>
          </motion.div>
        </AnimatePresence>

        <Footer darkMode={isDark} />

        {categoryButton && (
          <CategoryFilterButton onFilterChange={setCategories} />
        )}

        {openCart && (
          <MyCart darkMode={isDark} cartItems={cartItems} setCartItems={setCartItems} />
        )}

        {accountOpts && (
          <AccountOptions isDark={isDark} setOpts={setAccountOpts} />
        )}

        {mobileMenuOpn && (
          <MobileMenu
            AccountOptBtn={() => setAccountOpts(!accountOpts)}
            setOpts={setMobileMenu}
            toggleMode={toggleTheme}
            darkMode={isDark}
          />
        )}
      </main>
    </div>
  );
}

// ✅ Main App Component
function App() {
  return (
    <BrowserRouter> 
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;