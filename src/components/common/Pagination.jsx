import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    itemsPerPage = 10,
    totalItems = 0
}) => {
    const pages = [];
    const maxVisiblePages = 5;

    // Calculate page range to display
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
            <div className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to{' '}
                <span className="font-semibold text-slate-900">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                <span className="font-semibold text-slate-900">{totalItems}</span> results
            </div>

            <div className="pagination">
                {/* Previous Button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* First Page */}
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="pagination-button"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="text-slate-400">...</span>}
                    </>
                )}

                {/* Page Numbers */}
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`pagination-button ${page === currentPage ? 'pagination-button-active' : ''
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Last Page */}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="text-slate-400">...</span>}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="pagination-button"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next Button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
