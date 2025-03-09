import React from 'react';

interface RegisterOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterOperatorModal: React.FC<RegisterOperatorModalProps> = ({ isOpen, onClose }) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        alert('Registration submitted! We will review your application.');
        onClose(); // Close the modal after successful submission
        form.reset(); // Reset the form fields
      } else {
        console.log('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.log('Network error. Please check your connection.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>Register Operator</h3>
          <p>Currently, new operator registrations need to be reviewed.</p>
          <form
            id="my-form"
            action="https://formspree.io/f/xrbpzwjn"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" required />
            </div>
            <div className="form-group">
              <label htmlFor="operator-address">Operator Address</label>
              <input type="text" id="operator-address" name="operator-address" required />
            </div>
            <div className="form-group">
              <label htmlFor="operator-email">Contact email</label>
              <input type="email" id="operator-email" name="operator-email" required />
            </div>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};