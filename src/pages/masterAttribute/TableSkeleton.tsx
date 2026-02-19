const TableSkeleton = ({ rows = 5 }: { rows?: number; }) => {
    return (
        <>
            {[...Array(rows)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                    <td className="p-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div></td>
                    <td className="p-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div></td>
                    <td className="p-3 text-center"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-12 mx-auto"></div></td>
                    <td className="p-3 text-right"><div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto"></div></td>
                </tr>
            ))}
        </>
    );
};

export default TableSkeleton;