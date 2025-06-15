import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import CreatePost from "./CreatePost";
import UpdatePost from "./UpdatePost";
import ConfirmModal from "./ConfirmModal";

interface Post {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  priority: string;
  assignee: { _id: string; name: string; email: string };
}

// ✅ Fetch Tasks (GET Request)
const fetchPosts = async (): Promise<Post[]> => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5002/api/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data task");
  }

  return res.json();
};

const PostTable = () => {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5002/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsConfirmModalOpen(false);
    },
  });

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete !== null) {
      deleteMutation.mutate(postToDelete);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortField("title");
    setSortOrder("asc");
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    return posts
      .filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const valueA =
          typeof a[sortField as keyof Post] === "object"
            ? JSON.stringify(a[sortField as keyof Post])
            : (a[sortField as keyof Post] as string | number);

        const valueB =
          typeof b[sortField as keyof Post] === "object"
            ? JSON.stringify(b[sortField as keyof Post])
            : (b[sortField as keyof Post] as string | number);

        return sortOrder === "asc"
          ? valueA > valueB
            ? 1
            : -1
          : valueA < valueB
          ? 1
          : -1;
      });
  }, [posts, searchTerm, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Modals */}
      {isEditModalOpen && selectedPost && (
        <UpdatePost
          post={selectedPost}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={() =>
            queryClient.invalidateQueries({ queryKey: ["posts"] })
          }
        />
      )}
      {isCreateModalOpen && (
        <CreatePost onClose={() => setIsCreateModalOpen(false)} />
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
      />

      {isLoading ? (
        <p className="text-center">Loading tasks...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Error fetching tasks!</p>
      ) : (
        <div className="p-5 bg-white shadow-md rounded-lg dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-center mb-4 text-black dark:text-white">
            Task Management
          </h2>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              type="text"
              placeholder="Search title..."
              className="border-2 p-2 rounded w-1/3 bg-white text-gray-700"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <select
              className="border-2 p-2 rounded bg-white text-black"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
              <option value="dueDate">Sort by Due Date</option>
            </select>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "⬆ Ascending" : "⬇ Descending"}
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Create Task
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={resetFilters}
            >
              Reset Filter
            </button>
            <label
              htmlFor="itemsPerPage"
              className="text-gray-700 dark:text-white"
            >
              Show Item:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border p-2 rounded bg-gray-700 text-white"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Table */}
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-500 text-white dark:bg-gray-700">
                <th className="border p-3">Title</th>
                <th className="border p-3">Description</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">DueDate</th>
                <th className="border p-3">Priority</th>
                <th className="border p-3">Assignee</th>
                <th className="border p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.length > 0 ? (
                paginatedPosts.map((post) => (
                  <tr
                    key={post._id}
                    className="text-center hover:bg-gray-100 transition text-black dark:text-white dark:hover:bg-gray-700"
                  >
                    <td className="border p-3">{post.title}</td>
                    <td className="border p-3">{post.description}</td>
                    <td className="border p-3">{post.status}</td>
                    <td className="border p-3">
                      {new Date(post.dueDate).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="border p-3">{post.priority}</td>
                    <td className="border p-3">{post.assignee?.name}</td>
                    <td className="border p-3 text-center flex justify-center gap-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => {
                          setSelectedPost(post);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => handleDeleteClick(post._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-red-500 p-3">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Prev
            </button>
            <span className="text-gray-700 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostTable;
