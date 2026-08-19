function CategoryNav({ categories = [], selected, onSelect }) {
  const icons = {
    All: "⌂",
    Apartment: "▦",
    Villa: "⌂",
    Cabin: "△",
    Beach: "◒",
    City: "▥",
    Farm: "♧",
    Lake: "◉",
    Budget: "₹",
  };

  return (
    <div className="category-nav">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`category ${selected === category ? "active" : ""}`}
          onClick={() => onSelect?.(category)}
        >
          <span>{icons[category] || "✦"}</span>
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryNav;