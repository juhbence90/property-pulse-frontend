'use server';
import cloudinary from '@/config/cloudinary';
import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';

async function deleteProperty(propertyId: string) {
  await connectDB();
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required');
  }

  const { userId } = sessionUser;

  const property = await PropertyModel.findById(propertyId);

  if (!property) throw new Error('Property Not Found');

  // Verify ownership
  if (property.owner.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  // Extract public ID from image URLs
  const publicIds = property.images.map((imageUrl: string) => {
    const parts = imageUrl.split('/');
    return parts.at(-1)!.split('.').at(0);
  });

  // Delete images from Cloudinary
  if (publicIds.length > 0) {
    for (const publicId of publicIds) {
      await cloudinary.uploader.destroy('propertypulse/' + publicId);
    }
  }

  await property.deleteOne();

  revalidatePath('/', 'layout');
}

export default deleteProperty;
