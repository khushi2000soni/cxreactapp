
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ROLES } from '../Config/Constants';
import { VALIDATION_MESSAGES } from '../Config/ValidationMessage';

interface Props {
  onUserAdded: () => void;
}

const UserForm: React.FC<Props> = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    profile_image: null as File | null,
    role_id: 1, // Default to Admin
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profile_image: e.target.files[0] });
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, role_id: Number(e.target.value) });
  };

  const validateForm = () => {
    const validationErrors: Record<string, string> = {};
    
    // Validate Name
    if (!formData.name) {
      validationErrors.name = VALIDATION_MESSAGES.required;
    } else if (formData.name.length < 3) {
      validationErrors.name = VALIDATION_MESSAGES.nameTooShort;
    }

    // Validate Email
    if (!formData.email) {
      validationErrors.email = VALIDATION_MESSAGES.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = VALIDATION_MESSAGES.invalidEmail;
    }

    // Validate Phone
    if (!formData.phone) {
      validationErrors.phone = VALIDATION_MESSAGES.required;
    } else if (formData.phone.length !== 10) {
      validationErrors.phone = VALIDATION_MESSAGES.phoneLength;
    }

    // Validate Description
    if (!formData.description) {
      validationErrors.description = VALIDATION_MESSAGES.required;
    } else if (formData.description.length < 10) {
      validationErrors.description = VALIDATION_MESSAGES.descriptionTooShort;
    }

    // Validate Profile Image (if required)
    if (!formData.profile_image) {
      validationErrors.profile_image = VALIDATION_MESSAGES.invalidImage;
    }

    // Validate Role
    if (!formData.role_id) {
      validationErrors.role_id = VALIDATION_MESSAGES.roleRequired;
    }

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const requestData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      requestData.append(key, value as string | Blob);
    });

    try {
      await axios.post('http://127.0.0.1:8000/api/users', requestData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('User added successfully!');
      setFormData({ name: '', email: '', phone: '', description: '', profile_image: null, role_id: 1 });
      onUserAdded(); // Trigger table refresh
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error('Something went wrong!');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>
      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>
      <div>
        <label>Profile Image</label>
        <input
          type="file"
          name="profile_image"
          onChange={handleFileChange}
        />
        {errors.profile_image && <span className="error">{errors.profile_image}</span>}
      </div>
      <div>
        <label>Role</label>
        <select name="role_id" value={formData.role_id} onChange={handleRoleChange}>
          {ROLES.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        {errors.role_id && <span className="error">{errors.role_id}</span>}
      </div>
      <button type="submit">Add User</button>
    </form>
  );
};

export default UserForm;