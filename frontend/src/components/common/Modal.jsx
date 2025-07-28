/**
 * @file Modal.jsx
 * @description This file implements a reusable Modal component.
 * It provides a customizable overlay for displaying important messages or forms.
 */

import React from 'react';

/**
 * Modal Component
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the modal.
 * @param {string} [props.message] - The message content of the modal.
 * @param {Function} [props.onConfirm] - Callback function when the confirm button is clicked.
 * @param {Function} props.onCancel - Callback function when the cancel button or close button is clicked.
 * @param {string} [props.confirmText='Confirm'] - Text for the confirm button.
 * @param {string} [props.cancelText='Cancel'] - Text for the cancel button.
 * @param {JSX.Element} [props.children] - Children elements to be rendered inside the modal body.
 * @returns {JSX.Element} The Modal component.
 */
const Modal = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  children,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
            &times;
          </button>
        </div>
        <div className="mb-6">
          {message && <p className="text-gray-700 mb-4">{message}</p>}
          {children}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;