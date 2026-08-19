import { useEffect, useState } from "react";

import PropertyRow from "../components/PropertyRow";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("staynest_wishlist")) || [];

    setWishlist(saved);
  }, []);

  return (
    <div className="page-container">
      <div className="page-heading">
        <p className="small-heading">YOUR FAVORITES</p>

        <h1>Wishlist ♥</h1>

        <p>Save the stays you love and come back to them anytime.</p>
      </div>

      <PropertyRow properties={wishlist} />
    </div>
  );
}

export default Wishlist;