import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
  name: string;
  image: string;
  detailsLink: string;
}

const Card: React.FC<CardProps> = ({ name, image, detailsLink }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
      <img src={image} alt={name} className="w-24 h-24 mb-4" />
      <h2 className="text-lg font-semibold capitalize mb-2">{name}</h2>
      <Link to={detailsLink} className="text-blue-500 hover:underline mt-2">
        View Details →
      </Link>
    </div>
  );
};

export default Card;
