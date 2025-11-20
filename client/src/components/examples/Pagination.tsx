import Pagination from '../Pagination';
import { useState } from 'react';

export default function PaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Pagination 
        currentPage={currentPage} 
        totalPages={24} 
        onPageChange={(page) => {
          setCurrentPage(page);
          console.log('Page changed to:', page);
        }} 
      />
    </div>
  );
}
