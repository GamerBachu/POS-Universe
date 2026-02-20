const TableSkeleton = ({ rows = 5, column = 4 }: { rows?: number; column?: number; }) => {
    return (
        <>
            {[...Array(rows)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                    {[...Array(column)].map((_, j) => (
                        <td key={j} className="p-3">
                            <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${j === 2 ? 'w-12 mx-auto rounded-full' : j === column - 1 ? 'w-20 ml-auto' : 'w-3/4'}`}></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};

export default TableSkeleton;
