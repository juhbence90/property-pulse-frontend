'use server';
import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from '@/config/cloudinary';

export async function addProperty(formData: FormData): Promise<void> {
  await connectDB();
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required');
  }

  const { userId } = sessionUser;

  const amenities = formData.getAll('amenities') as string[];
  const images = formData
    .getAll('images')
    .filter(
      (image): image is File => image instanceof File && image.name !== '',
    );

  const imageUrls: string[] = [];

  for (const imageFile of images) {
    const imageBuffer = await imageFile.arrayBuffer();
    const imageArray = Array.from(new Uint8Array(imageBuffer));
    const imageData = Buffer.from(imageArray);

    // Convert to base64
    const imageBase64 = imageData.toString('base64');

    //Make request to cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBase64}`,
      {
        folder: 'propertypulse',
      },
    );

    imageUrls.push(result.secure_url);
  }

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
    images: imageUrls,
  };

  const newProperty = new PropertyModel(propertyData);
  await newProperty.save();

  revalidatePath('/', 'layout');

  redirect(`/properties/${newProperty._id}`);
}
