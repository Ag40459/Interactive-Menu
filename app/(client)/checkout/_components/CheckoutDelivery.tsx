"use client";
import React from "react";
import type { Address } from "../../catalog/_components/AddressModal";

type Props = {
    mesa: string | null;
    delivery: "balcao" | "endereco" | "mesa" | "";
    setDelivery: (v: "balcao" | "endereco" | "mesa" | "") => void;

    address: Address | null;
    setAddress: (a: Address | null) => void;

    setOpenAddress: (b: boolean) => void;
    addressSnippet: string;
};

export default function CheckoutDelivery({
    mesa,
    delivery,
    setDelivery,
    address,
    setAddress,
    setOpenAddress,
    addressSnippet,
}: Props) {
    return (
        <>
            <h3 className="mt-6 text-lg font-semibold">Forma de Entrega</h3>
            <CheckoutDelivery
                mesa={mesa}
                delivery={delivery}
                setDelivery={setDelivery}
                address={address}
                setAddress={setAddress}
                setOpenAddress={setOpenAddress}
                addressSnippet={addressSnippet}
            />

        </>
    );
}