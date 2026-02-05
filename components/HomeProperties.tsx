import PropertyCard from './PropertyCard';
import Link from 'next/link';
import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import type { IProperty } from '@/models/Property';

const HomeProperties = async () => {
  await connectDB();

  const recentProperties = await PropertyModel.find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .lean<IProperty[]>();

  return (
    <>
      <section className="px-4 py-3">
        <div className=" lg:container m-auto px-4 py-6">
          <h2 className="text-4xl font-bold text-blue-500 mb-8 text-center">
            Recent Properties
          </h2>
          {recentProperties.length === 0 ? (
            <p>No properties found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentProperties.map((property) => (
                <PropertyCard
                  key={property._id.toString()}
                  property={property}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="m-auto max-w-lg my-3 px-6">
        <Link
          href="/properties"
          className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-grey-700"
        >
          View All Properties
        </Link>
      </section>
    </>
  );
};

export default HomeProperties;
