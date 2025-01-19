'use client';

import { useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { TrashIcon } from '@heroicons/react/24/solid';

import { deleteReservation } from '../_lib/actions';

function DeleteReservation({ bookingId }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm('Are you sure you want to delete this reservation?'))
      startTransition(() => deleteReservation(bookingId));
  }

  return (
    <button
      onClick={handleDelete}
      className='group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900'
    >
      <TrashIcon className='h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors' />
      <span className='mt-1'>{pending ? 'Deleting...' : 'Delete'}</span>
    </button>
  );
}

export default DeleteReservation;
