'use server';
import connectDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';

export async function addMessage(
  prevState,
  formData: FormData,
): Promise<{ submitted: boolean; error?: string }> {
  await connectDB();
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required');
  }

  const { userId } = sessionUser;
  const recipient = formData.get('recipient') as string;

  if (userId === recipient) {
    return { submitted: false, error: 'You cannot send a message to yourself' };
  }

  const newMessage = new Message({
    sender: userId,
    recipient,
    property: formData.get('property') as string,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
  });

  await newMessage.save();

  return { submitted: true };
}
