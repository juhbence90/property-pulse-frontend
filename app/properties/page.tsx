import PropertyCard from '@/components/PropertyCard';
import Pagination from '@/components/Pagination';
import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import type { IProperty } from '@/models/Property';

type PropertiesPageProps = {
  searchParams: Promise<{ page?: string; pageSize: string }>;
};

const PropertiesPage = async ({ searchParams }: PropertiesPageProps) => {
  await connectDB();
  const { page = '1', pageSize = '9' } = await searchParams;

  const pageNumber = parseInt(page);
  const pageSizeNumber = parseInt(pageSize);

  const skip = (pageNumber - 1) * pageSizeNumber;

  const total = await PropertyModel.countDocuments({});

  const properties = await PropertyModel.find({})
    .skip(skip)
    .limit(pageSizeNumber)
    .lean<IProperty[]>();

  const showPagination = total > pageSizeNumber;

  return (
    <section className="px-4 py-6">
      <div className=" lg:container m-auto px-4 py-6">
        {properties.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id.toString()} property={property} />
            ))}
          </div>
        )}
        {showPagination && (
          <Pagination
            page={pageNumber}
            pageSize={pageSizeNumber}
            totalItems={total}
          />
        )}
      </div>
    </section>
  );
};

export default PropertiesPage;
