"use client";

import Input from "@/app/components/inputs/input";
import { User } from "@prisma/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface SearchUserBoxProps {
    items: User[];
    setFilteredItems: (value: User[]) => void;
}

const SearchUserBox: React.FC<SearchUserBoxProps> = ({
    items,
    setFilteredItems,
}) => {
    const { register, watch } = useForm();

    const searchInput = watch("search");

    useEffect(() => {
        if (!searchInput) {
            setFilteredItems(items);
            return;
        }
        const filtered = items.filter(
            (item) =>
                item.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
                item.email
                    ?.toLocaleLowerCase()
                    .includes(searchInput.toLowerCase())
        );

        setFilteredItems(filtered);
    }, [searchInput, items, setFilteredItems]);

    return (
        <>
            <Input
                label="Search"
                id="search"
                type="text"
                register={register}
                errors={{}}
                required={false}
            />
        </>
    );
};

export default SearchUserBox;
