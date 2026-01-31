import PropertyEditForm from '@/components/PropertyEditForm';
import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import { convertToSerializableObject } from '@/utils/convertToObject';
import { notFound } from 'next/navigation';

const PropertyEditPage = async ({ params }: { params: { id: string } }) => {
  await connectDB();
  const { id } = await params;

  const propertyDoc = await PropertyModel.findById(id).lean();

  if (!propertyDoc) {
    notFound();
  }

  const property = convertToSerializableObject(propertyDoc);

  return (
    <section className="bg-blue-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md m-4 md:m-0">
          <PropertyEditForm property={property} />
        </div>
      </div>
    </section>
  );
};

export default PropertyEditPage;
