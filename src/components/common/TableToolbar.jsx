import React from 'react';
import { Search, Filter, Download, Plus } from 'lucide-react';

const TableToolbar = ({
    searchValue = '',
    onSearchChange,
    onFilterClick,
    onExportClick,
    onAddClick,
    showSearch = true,
    showFilter = false,
    showExport = false,
    showAdd = false,
    addButtonText = 'Add New',
    placeholder = 'Search...',
    children
}) => {
    return (
        <div className="table-toolbar">
            <div className="flex items-center gap-3 flex-1">
                {/* Search */}
                {showSearch && (
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="input pl-11"
                        />
                    </div>
                )}

                {/* Custom Children (e.g., filters, dropdowns) */}
                {children}
            </div>

            <div className="flex items-center gap-2">
                {/* Filter Button */}
                {showFilter && (
                    <button
                        onClick={onFilterClick}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                )}

                {/* Export Button */}
                {showExport && (
                    <button
                        onClick={onExportClick}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                )}

                {/* Add Button */}
                {showAdd && (
                    <button
                        onClick={onAddClick}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {addButtonText}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TableToolbar;
