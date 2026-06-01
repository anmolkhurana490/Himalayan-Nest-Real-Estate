import React from 'react'
import { useRouter } from 'next/navigation';
import APP_CONFIG from '@/config/app.config';

const Pagination = ({ values }) => {
  const router = useRouter();
  const { currPage, totalPages, limit } = values;

  const onLimitChange = (newLimit) => {
    router.push(`?page=${currPage}&limit=${newLimit}`);
  }

  const onPrevious = () => {
    if (currPage > 1) router.push(`?page=${currPage - 1}&limit=${limit}`);
  }

  const onNext = () => {
    if (currPage < totalPages) router.push(`?page=${currPage + 1}&limit=${limit}`);
  }

  return (
    <div className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6 mb-4 px-2 sm:px-4'>
      <button
        className={'px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed'}
        disabled={currPage === 1}
        onClick={onPrevious}
      >
        Previous
      </button>

      <span className='text-gray-700'>
        Page {currPage} of {totalPages}
      </span>

      <button
        className={'px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed'}
        disabled={currPage === totalPages}
        onClick={onNext}
      >
        Next
      </button>

      <select
        value={limit}
        onChange={(e) => onLimitChange(e.target.value)}
        className='ml-2 sm:ml-4 px-2 py-1 border rounded'
      >
        {APP_CONFIG.LIMIT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option} per page
          </option>
        ))}
      </select>
    </div>
  )
}

export default Pagination;