/**
 * @fileoverview This file contains the PathwayPlayer and PathwayItem components.
 * @description PathwayPlayer renders the details of a pathway, and PathwayItem renders individual items within a pathway.
 */

import React from 'react';

/**
 * @description Renders the pathway title and maps through pathway.items, rendering a PathwayItem component for each.
 * @param {object} props - Component props.
 * @param {object} props.pathway - The pathway object to be displayed.
 * @returns {JSX.Element} - The pathway player component.
 */
const PathwayPlayer = ({ pathway }) => {
  if (!pathway) {
    return <div className="text-gray-600">Select a pathway to play</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{pathway.title}</h2>
      <div>
        {pathway.items.map((item, index) => (
          <PathwayItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

/**
 * @description Renders a single pathway item.
 * @param {object} props - Component props.
 * @param {string} props.item - The pathway item content.
 * @returns {JSX.Element} - The pathway item component.
 */
const PathwayItem = ({ item }) => {
  return (
    <div className="border border-gray-200 p-4 my-2 rounded">
      <p className="text-gray-800">{item}</p>
    </div>
  );
};

export default PathwayPlayer;
