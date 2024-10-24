"use client";

import Input from "@/app/components/inputs/input";
import { FullConversationType } from "@/app/types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface SearchBoxProps {
    items: FullConversationType[];
    setFilteredItems: (value: FullConversationType[]) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ items, setFilteredItems }) => {
    const { register, watch } = useForm();

    const searchInput = watch("search");

    useEffect(() => {
        if (!searchInput) {
            setFilteredItems(items);
            return;
        }
        const filtered = items.filter((item) =>
            item.users.some((user) =>
                user.name?.toLowerCase().includes(searchInput.toLowerCase())
            )
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

export default SearchBox;
