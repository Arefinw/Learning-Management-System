import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PathwayEditor = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [pathway, setPathway] = useState(null);
  const [newItemType, setNewItemType] = useState('Link');
  const [newItemContent, setNewItemContent] = useState('');

  useEffect(() => {
    if (user) {
      axios
        .get(`/api/pathways/${id}`)
        .then((res) => {
          setPathway(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, id]);

  const handleAddItem = async () => {
    try {
      const res = await axios.post(`/api/pathways/${id}/items`, {
        type: newItemType,
        content: newItemContent,
      });
      setPathway({ ...pathway, items: res.data });
      setNewItemContent('');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleRemoveItem = async (itemIndex) => {
    // This would require a backend endpoint to remove items from a pathway
    // For now, we'll just remove it from the frontend state
    const updatedItems = pathway.items.filter((_, index) => index !== itemIndex);
    setPathway({ ...pathway, items: updatedItems });
    // In a real application, you would send a DELETE request to the backend
  };

  const handleToggleCompleted = (itemIndex) => {
    const updatedItems = pathway.items.map((item, index) =>
      index === itemIndex ? { ...item, completed: !item.completed } : item
    );
    setPathway({ ...pathway, items: updatedItems });
    // In a real application, you would send a PUT request to the backend to update completion status
  };

  const handleMoveItem = (fromIndex, toIndex) => {
    const updatedItems = [...pathway.items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setPathway({ ...pathway, items: updatedItems });
    // In a real application, you would send a PUT request to the backend to update item order
  };

  if (!pathway) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Editing: {pathway.title}</h2>
      <p>{pathway.description}</p>

      <div className="mt-4">
        <h3 className="text-lg font-bold">Pathway Items</h3>
        <ul>
          {pathway.items.map((item, index) => (
            <li key={index} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleCompleted(index)}
                className="mr-2"
              />
              <span>{item.type}: {item.content}</span>
              <button
                onClick={() => handleRemoveItem(index)}
                className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
              {index > 0 && (
                <button
                  onClick={() => handleMoveItem(index, index - 1)}
                  className="ml-2 bg-gray-300 px-2 py-1 rounded"
                >
                  Up
                </button>
              )}
              {index < pathway.items.length - 1 && (
                <button
                  onClick={() => handleMoveItem(index, index + 1)}
                  className="ml-2 bg-gray-300 px-2 py-1 rounded"
                >
                  Down
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <h4 className="text-md font-bold">Add New Item</h4>
          <select
            value={newItemType}
            onChange={(e) => setNewItemType(e.target.value)}
            className="border p-2 mr-2"
          >
            <option value="Link">Link</option>
            <option value="Video">Video</option>
            <option value="Document">Document</option>
          </select>
          {newItemType === 'Document' ? (
            <textarea
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              placeholder="Document Content (Markdown)"
              className="border p-2 w-full h-32"
            ></textarea>
          ) : (
            <input
              type="text"
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              placeholder="Content URL or ID"
              className="border p-2 w-full"
            />
          )}
          <button
            onClick={handleAddItem}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathwayEditor;