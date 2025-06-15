import { useState } from "react";
import axios from "axios";

interface UpdatePostProps {
  post: {
    _id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    priority: string;
    assignee?: { _id: string; name: string; email: string };
  };
  onClose: () => void;
  onUpdate: () => void;
}

const UpdatePost: React.FC<UpdatePostProps> = ({ post, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    ...post,
    dueDate: post.dueDate?.split("T")[0] || "", // Format ulang tanggal
    assignee: post.assignee?._id || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5002/api/tasks/${post._id}`,
        formData, // Tidak mengirim assignee
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Task updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-gray-700">
        <h2 className="text-lg font-bold mb-4 text-blue-400 dark:text-white">
          Update Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded dark:bg-gray-500"
            />
          </label>

          <label className="block">
            Description
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded dark:bg-gray-500"
            />
          </label>

          <label className="block">
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-500"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </label>

          <label className="block">
            Due Date
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-500"
            />
          </label>

          <label className="block">
            Priority
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <label className="block">
            Assignee
            <input
              type="text"
              name="assignee"
              value={formData.assignee || ""}
              onChange={(e) =>
                setFormData({ ...formData, assignee: e.target.value })
              }
              placeholder="Masukkan ID Assignee"
              className="w-full p-2 border rounded dark:bg-gray-500"
            />
          </label>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
