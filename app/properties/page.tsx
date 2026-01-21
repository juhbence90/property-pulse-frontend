import PropertyCard from '@/components/PropertyCard';
import properties from '@/properties.json';
import type { Property } from '@/app/types/property';

const propertiesData: Property[] = properties;

const PropertiesPage = () => {
  return (
    <section className="px-4 py-6">
      <div className=" lg:container m-auto px-4 py-6">
        {propertiesData.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {propertiesData.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertiesPage;
