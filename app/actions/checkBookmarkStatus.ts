'use server';
import connectDB from '@/config/database';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';

type CheckBookmarkStatusResponse = {
  isBookmarked: boolean;
  error?: string;
};

async function checkBookmarkStatus(
  propertyId: string,
): Promise<CheckBookmarkStatusResponse> {
  await connectDB;

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required');
  }

  const { userId } = sessionUser;

  const user = await User.findById(userId);

  const isBookmarked = user.bookmarks.includes(propertyId);

  return { isBookmarked };
}

export default checkBookmarkStatus;
