

const TableNoRecord = ({ column, message }: { column: number, message?: string; }) => {
    return (
        <tr>
            <td colSpan={column} className="p-8 text-center text-sm text-gray-500 uppercase">
                {message}
            </td>
        </tr>
    );
};

export default TableNoRecord;