"use client";

interface ContextMenuProps {
    x: number;
    y: number;
    options: Record<string, any>[];
    onSelect: (value : Record<string, any>) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
    x,
    y,
    options,
    onSelect,
}) => {
    return (
        <div
            className={`absolute flex flex-col bg-gray-900 rounded-md z-[100] w-fit p-2 top-[${y}px] left-[${x}px]`}
        >
            {options.map((option) => (
                <div
                    key={option.value}
                    className="py-2 px-4 hover:bg-gray-800 cursor-pointer text-white min-w-full text-nowrap"
                    onClick={() => onSelect({value : option.value})}
                >
                    {option.label}
                </div>
            ))}
        </div>
    );
};

export default ContextMenu;

