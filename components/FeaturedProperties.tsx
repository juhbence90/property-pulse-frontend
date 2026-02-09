import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import type { IProperty } from '@/models/Property';
import FeaturedPropertyCard from './FeaturedPropertyCard';

const FeaturedProperties = async () => {
  await connectDB();

  const properties = await PropertyModel.find({
    is_featured: true,
  }).lean<IProperty[]>();

  return properties.length > 0 ? (
    <section className="bg-blue-50 px-4 pt-6 pb-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
          Featured Properties
        </h2>
        <div className="grid gird-cols-1 md:grid-cols-2 gap-6">
          {properties.map((property) => (
            <FeaturedPropertyCard
              key={property._id.toString()}
              property={property}
            />
          ))}
        </div>
      </div>
    </section>
  ) : null;
};

export default FeaturedProperties;
