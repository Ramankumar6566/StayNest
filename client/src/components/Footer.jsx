 import { Link } from "react-router-dom";

 function Footer() {
   return (
     <footer className="footer">
       <div className="footer-inner">
         <div className="footer-about">
           <Link to="/" className="footer-brand">
             <span>⌂</span>
             StayNest
           </Link>

           <p>
             Find beautiful places to stay, explore new destinations and create
             unforgettable memories.
           </p>
         </div>

         <div>
           <h4>Explore</h4>

           <Link to="/">Home</Link>

           <Link to="/search">Explore Stays</Link>

           <Link to="/wishlist">Wishlist</Link>
         </div>

         <div>
           <h4>Host</h4>

           <Link to="/host">Become a Host</Link>

           <Link to="/login">Login</Link>

           <Link to="/register">Register</Link>
         </div>

         <div>
           <h4>Support</h4>

           <a href="mailto:support@staynest.com">Contact Us</a>

           <a href="/">Help Center</a>

           <a href="/">Safety</a>
         </div>
       </div>

       <div className="footer-bottom">
         © {new Date().getFullYear()} StayNest · All rights reserved.
       </div>
     </footer>
   );
 }

 export default Footer;
