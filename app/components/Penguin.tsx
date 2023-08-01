import Image from "next/image";
import React from "react";

type Props = {
  image: string;
  name: string;
  age: number;
  description: string;
};

function Penguin({ image, name, age, description }: Props) {
  return (
    <div className="flex border rounded-md overflow-hidden shadow-md max-w-xl mb-2">
      <div className="w-1/3 relative">
        <Image src={image} alt={name} fill={true} />
      </div>
      <div className="w-2/3 p-4">
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <p className="text-gray-500 mb-2">Age: {age} years</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}

export default Penguin;
