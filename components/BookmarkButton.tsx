'use client';

import { useState, useEffect } from 'react';
import bookmarkProperty from '@/app/actions/bookmarkProperty';
import checkBookmarkStatus from '@/app/actions/checkBookmarkStatus';
import { toast } from 'react-toastify';
import type { PropertyProps } from '@/models/Property';
import { FaBookmark } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

const BookmarkButton = ({ property }: PropertyProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const id = property._id.toString();

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchBookmarkStatus = async () => {
      try {
        const res = await checkBookmarkStatus(id);

        if (res.error) toast.error(res.error);
        if (res.isBookmarked) setIsBookmarked(res.isBookmarked);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Something went wrong.');
        }
      }
    };

    fetchBookmarkStatus();
  }, [id, userId]);

  const handleClick = async () => {
    if (!userId) {
      toast.error('You need to be signed in to bookmark a listing');
      return;
    }

    try {
      const res = await bookmarkProperty(id);

      setIsBookmarked(res.isBookmarked);
      toast.success(res.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong.');
      }
    }
  };

  return isBookmarked ? (
    <button
      className="bg-green-500 hover:bg-green-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
      onClick={handleClick}
    >
      <FaBookmark className="mr-2" /> Bookmarked
    </button>
  ) : (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
      onClick={handleClick}
    >
      <FaBookmark className="mr-2" /> Bookmark Property
    </button>
  );
};

export default BookmarkButton;
