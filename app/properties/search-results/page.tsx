import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import PropertySearchForm from '@/components/PropertySearchForm';
import connectDB from '@/config/database';
import type { QueryFilter } from 'mongoose';
import type { IProperty } from '@/models/Property';
import PropertyModel from '@/models/Property';
import { convertToSerializableObject } from '@/utils/convertToObject';
import { FaArrowAltCircleLeft } from 'react-icons/fa';

interface SearchParams {
  location?: string;
  propertyType?: string;
}

interface SearchResultsPageProps {
  searchParams: Promise<SearchParams>;
}

const SearchResultsPage = async ({ searchParams }: SearchResultsPageProps) => {
  await connectDB();
  const { location, propertyType } = await searchParams;

  const query: QueryFilter<IProperty> = {};

  if (location) {
    const locationPattern = new RegExp(location, 'i');

    query.$or = [
      { name: locationPattern },
      { description: locationPattern },
      { 'location.street': locationPattern },
      { 'location.city': locationPattern },
      { 'location.state': locationPattern },
      { 'location.zipcode': locationPattern },
    ];
  }

  if (propertyType && propertyType !== 'All') {
    const typePattern = new RegExp(propertyType, 'i');
    query.type = typePattern;
  }

  const propertiesQueryResults =
    await PropertyModel.find(query).lean<IProperty[]>();
  const properties: IProperty[] = propertiesQueryResults.map((doc) =>
    convertToSerializableObject<IProperty>(doc),
  );

  return (
    <>
      <section className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <PropertySearchForm />
        </div>
      </section>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <Link
            href="/properties"
            className="flex items-center text-blue-500 hover:underline mb-3"
          >
            <FaArrowAltCircleLeft className="mr-2 mb-1" />
            Back To Properties
          </Link>
          <h1 className="text-2xl mb-4">Search Results</h1>
          {properties.length === 0 ? (
            <p>No search results</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id.toString()}
                  property={property}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchResultsPage;
