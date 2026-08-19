 import PropertyCard from "./PropertyCard";

 function PropertyRow({ properties }) {
   if (!properties.length) {
     return (
       <div className="empty-properties">
         <div>⌂</div>

         <h3>No stays found</h3>

         <p>Try another destination or category.</p>
       </div>
     );
   }

   return (
     <div className="property-grid">
       {properties.map((property) => (
         <PropertyCard key={property._id || property.id} property={property} />
       ))}
     </div>
   );
 }

 export default PropertyRow;
