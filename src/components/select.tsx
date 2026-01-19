interface SelectProps {
    sizeSelect: string;
    nombreSelect: string;
}

function Select({ sizeSelect, nombreSelect }: SelectProps) {
    return (
        <div className="max-w-2xl mx-auto py-3">
            <select className={`cursor-pointer bg-[#FAF5F5] border-b p-2 text-sm focus:outline-none focus:border-b-black block font-sans ${sizeSelect}`}>
                <option selected>{nombreSelect}</option>
                <option>United States</option>
                <option>Canada</option>
            </select>
        </div>
    )
}

export default Select
