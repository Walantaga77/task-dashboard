import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface CreatePostProps {
  onClose: () => void;
}

const CreatePost = ({ onClose }: CreatePostProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignee, setAssignee] = useState("");

  const queryClient = useQueryClient();
  console.log("Assignee", assignee);
  const createPostMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5002/api/tasks",
        {
          title,
          description,
          status,
          dueDate,
          priority,
          assignee,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      // TODO: add event for update status websocket
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
    onError: (error) => {
      console.error("❌ Error creating post:", error);
      alert("Gagal membuat post, periksa kembali input!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 dark:bg-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700 dark:text-white">
          Create New Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <input
            type="date"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-500"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <select
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-500"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="text"
            placeholder="Assignee (User ID)"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-500"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            required
          />
          <div className="flex justify-between">
            <button
              type="button"
              className="w-1/2 bg-red-500 text-white py-3 rounded-md hover:bg-red-700 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 bg-green-500 text-white py-3 rounded-md hover:bg-green-700 transition"
              disabled={createPostMutation.isPending}
            >
              {createPostMutation.isPending ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
