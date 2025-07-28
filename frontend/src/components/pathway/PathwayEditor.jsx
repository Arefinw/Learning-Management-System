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
    return <Loading />;
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Editing: {pathway.title}</h2>
      <p className="mb-4">{pathway.description}</p>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Pathway Items</h3>
        <ul>
          {pathway.items.map((item, index) => (
            <li key={index} className="flex items-center mb-2 py-1 border-b border-neutral-border last:border-b-0">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleCompleted(index)}
                className="mr-2"
              />
              <span>{item.type}: {item.content}</span>
              <div className="ml-auto flex items-center space-x-2">
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="btn btn-danger btn-sm"
                >
                  Remove
                </button>
                {index > 0 && (
                  <button
                    onClick={() => handleMoveItem(index, index - 1)}
                    className="btn btn-secondary btn-sm"
                  >
                    Up
                  </button>
                )}
                {index < pathway.items.length - 1 && (
                  <button
                    onClick={() => handleMoveItem(index, index + 1)}
                    className="btn btn-secondary btn-sm"
                  >
                    Down
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h4 className="text-xl font-semibold mb-3">Add New Item</h4>
        <div className="form-group">
          <label className="form-label" htmlFor="newItemType">Item Type</label>
          <select
            id="newItemType"
            value={newItemType}
            onChange={(e) => setNewItemType(e.target.value)}
            className="form-control"
          >
            <option value="Link">Link</option>
            <option value="Video">Video</option>
            <option value="Document">Document</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="newItemContent">Content</label>
          {newItemType === 'Document' ? (
            <textarea
              id="newItemContent"
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              placeholder="Document Content (Markdown)"
              className="form-control h-32"
            ></textarea>
          ) : (
            <input
              id="newItemContent"
              type="text"
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              placeholder="Content URL or ID"
              className="form-control"
            />
          )}
        </div>
        <button
          onClick={handleAddItem}
          className="btn btn-primary mt-4"
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default PathwayEditor;