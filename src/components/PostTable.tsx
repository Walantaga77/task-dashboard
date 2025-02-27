import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import CreatePost from "./CreatePost";
import UpdatePost from "./UpdatePost";
import ConfirmModal from "./ConfirmModal";

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
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
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [titleLength, setTitleLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    console.log("Klik hapus untuk ID:", id);
    setPostToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("berhasil menghapus task!", isConfirmModalOpen);
    if (postToDelete !== null) {
      deleteMutation.mutate(postToDelete);
    }
  };

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refresh data
      setIsConfirmModalOpen(false); // Tutup modal setelah sukses
    },
  });

  // Search + Sorting + Filtering

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    return posts
      .filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((post) => post.title.length >= titleLength)
      .sort((a, b) => {
        const valueA = a[sortField as keyof Post] as string | number;
        const valueB = b[sortField as keyof Post] as string | number;
        return sortOrder === "asc"
          ? valueA > valueB
            ? 1
            : -1
          : valueA < valueB
          ? 1
          : -1;
      });
  }, [posts, searchTerm, sortField, sortOrder, titleLength]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
      />
      ;
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
          <p className="ml-3">Mohon tunggu...</p>
        </div>
      ) : isError ? (
        <p className="text-center text-red-500">Error fetching posts!</p>
      ) : (
        <div className="p-5 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-4 text-black">
            Task Management
          </h2>
          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search title..."
              className="border p-2 rounded w-1/3 bg-gray-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />

            {/* Sorting */}
            <select
              className="border p-2 rounded bg-gray-500"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="id">Sort by ID</option>
              <option value="title">Sort by Title</option>
            </select>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "⬆ Ascending" : "⬇ Descending"}
            </button>

            {/* Reset Search */}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => {
                setSearchTerm("");
                setTitleLength(0);
                setSortField("id");
                setSortOrder("asc");
                setCurrentPage(1);
              }}
            >
              Reset
            </button>

            {/* Pagination Dropdown */}
            <select
              className="border p-2 rounded bg-gray-500"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>Show 10</option>
              <option value={25}>Show 25</option>
              <option value={50}>Show 50</option>
            </select>

            {/* Tombol Create Task di sebelah Dropdown */}
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => setIsModalOpen(true)} // ✅ Modal terbuka saat tombol diklik
            >
              + Create Task
            </button>
          </div>
          {/* Modal Pop-up create task */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Create Task</h2>
                <CreatePost onClose={() => setIsModalOpen(false)} />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          // Tampilkan modal UpdatePost
          {isEditModalOpen && selectedPost && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                <UpdatePost
                  post={selectedPost}
                  onClose={() => setIsEditModalOpen(false)}
                />
              </div>
            </div>
          )}
          {/* Table */}
          <table className="w-full border-collapse border border-gray-300 min-h-screen">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border p-3">ID</th>
                <th className="border p-3">Title</th>
                <th className="border p-3">Body</th>
                <th className="border p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="min-h-screen">
              {paginatedPosts.length > 0 ? (
                paginatedPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="text-center hover:bg-gray-100 transition text-black"
                  >
                    <td className="border p-3">{post.id}</td>
                    <td className="border p-3">{post.title}</td>
                    <td className="border p-3">{post.body}</td>
                    <td className="border p-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
                          onClick={() => {
                            setSelectedPost(post);
                            setIsEditModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
                          onClick={() => handleDeleteClick(post.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-red-500 p-3">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${
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
