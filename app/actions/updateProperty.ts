'use server';
import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Types } from 'mongoose';

async function updateProperty(propertyId: Types.ObjectId, formData: FormData) {
  await connectDB();
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required');
  }

  const { userId } = sessionUser;

  const existingProperty = await PropertyModel.findById(propertyId);

  // Verify Ownership
  if (existingProperty.owner.toString() !== userId) {
    throw new Error('Current user does not own this property');
  }

  const amenities = formData.getAll('amenities') as string[];

  const propertyData = {
    owner: userId,
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    description: formData.get('description') as string,
    location: {
      street: formData.get('location.street') as string,
      city: formData.get('location.city') as string,
      state: formData.get('location.state') as string,
      zipcode: formData.get('location.zipcode') as string,
    },
    beds: Number(formData.get('beds')),
    baths: Number(formData.get('baths')),
    square_feet: Number(formData.get('square_feet')),
    amenities,
    rates: {
      nightly: Number(formData.get('rates.nightly')) || undefined,
      weekly: Number(formData.get('rates.weekly')) || undefined,
      monthly: Number(formData.get('rates.monthly')) || undefined,
    },
    seller_info: {
      name: formData.get('seller_info.name') as string,
      email: formData.get('seller_info.email') as string,
      phone: formData.get('seller_info.phone') as string,
    },
  };

  const updatedProperty = await PropertyModel.findByIdAndUpdate(
    propertyId,
    propertyData,
  );

  revalidatePath('/', 'layout');

  redirect(`/properties/${updatedProperty._id}`);
}

export default updateProperty;
