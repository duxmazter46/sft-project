import { useState, useEffect } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import axios from "axios";

interface UserProps {
  username: string;
  name: string;
  role: string | null;
  email: string;
  status: boolean | null; // `null` for pending, `true` for active, `false` for inactive
}

const ApproveUser = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null); // Track which user is being edited
  const [editFormData, setEditFormData] = useState<UserProps | null>(null); // Form data for the user being edited
  const [confirmAction, setConfirmAction] = useState<{ action: string; user: UserProps | null }>({ action: "", user: null }); // State for confirmation dialog

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/users`, { withCredentials: true });
        setUsers(response.data); // Set the users data from the API
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // Fetch the users when the component mounts
  }, []);

  const handleEditClick = (user: UserProps) => {
    setEditingUser(user.username);
    setEditFormData(user); // Pre-fill the form with the user's existing data
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!editFormData) return;

    try {
      await axios.patch(`${import.meta.env.VITE_APP_API_URL}/users/update/${editFormData.username}`, {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
      }, { withCredentials: true });

      alert(`User ${editFormData.username} updated successfully!`);
      setEditingUser(null); // Exit edit mode
      setEditFormData(null); // Reset form data

      // Update the local state with the edited user data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === editFormData.username ? editFormData : user
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const approveUser = async (username: string) => {
    try {
      await axios.patch(`${import.meta.env.VITE_APP_API_URL}/users/setStatus`, {
        username: username,
      }, { withCredentials: true });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === username ? { ...user, status: true } : user
        )
      );
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const rejectUser = (username: string) => {
    const user = users.find(u => u.username === username) || null;
    setConfirmAction({ action: "delete", user });
  };
  
  const inactivateUser = (username: string) => {
    const user = users.find(u => u.username === username) || null;
    setConfirmAction({ action: "inactivate", user });
  };
  
  const activateUser = (username: string) => {
    const user = users.find(u => u.username === username) || null;
    setConfirmAction({ action: "activate", user });
  };
  

  // Confirm action dialog logic
  const handleConfirm = async () => {
    if (!confirmAction.user) return;

    const { action, user } = confirmAction;
    if (action === "delete") {
      try {
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}/users/delete`, {
          data: { username: user.username },
          withCredentials: true,
        });
        setUsers(users.filter(u => u.username !== user.username));
        alert("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } else if (action === "inactivate") {
      try {
        await axios.patch(`${import.meta.env.VITE_APP_API_URL}/users/setStatus`, { username: user.username }, { withCredentials: true });
        setUsers(users.map(u => (u.username === user.username ? { ...u, status: false } : u)));
        alert("User inactivated successfully");
      } catch (error) {
        console.error("Error inactivating user:", error);
      }
    } else if (action === "activate") {
      try {
        await axios.patch(`${import.meta.env.VITE_APP_API_URL}/users/setStatus`, { username: user.username }, { withCredentials: true });
        setUsers(users.map(u => (u.username === user.username ? { ...u, status: true } : u)));
        alert("User activated successfully");
      } catch (error) {
        console.error("Error activating user:", error);
      }
    }
    setConfirmAction({ action: "", user: null }); // Reset confirmation dialog
  };

  const handleCancel = () => {
    setConfirmAction({ action: "", user: null }); // Cancel confirmation
  };

  // Filter users by status and exclude 'admin' role
  const usersToApprove = users.filter((user) => user.status === null && user.role !== 'admin');
  const activeUsers = users.filter((user) => user.status === true && user.role !== 'admin');
  const inactiveUsers = users.filter((user) => user.status === false && user.role !== 'admin');

  return (
    <div className="">
      <h3 className="text-[18px] font-semibold mb-2 text-gray-800">Approve Users</h3>

      {usersToApprove.length > 0 ? (
        usersToApprove.map((user, index) => (
          <div
            key={index}
            className="flex flex-row items-center  bg-white shadow-lg rounded-lg p-4 mb-4 hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src="../../../assets/Leadingelement.png"
              alt="User"
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
            />
            <div className="flex-1 ml-6">
              <h4 className="font-bold text-[16px] text-gray-800">{user.name}</h4>
              <p className="text-[14px] text-gray-500">No role assigned</p>
            </div>
            <div className="flex space-x-4">
              {/* Reject Button */}
              <button
                onClick={() => rejectUser(user.username)}
                className="flex items-center justify-center px-4 py-1 bg-red-500 hover:bg-red-600 text-white text-[14px] font-medium rounded-full transition duration-300 ease-in-out"
              >
                <AiOutlineClose className="mr-2" />
                Reject
              </button>

              {/* Approve Button */}
              <button
                onClick={() => approveUser(user.username)}
                className="flex items-center justify-center px-4 py-1 bg-green-500 hover:bg-green-600 text-white text-[14px] font-medium rounded-full transition duration-300 ease-in-out"
              >
                <AiOutlineCheck className="mr-2" />
                Approve
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-[16px] text-gray-500 pl-4 pb-2">No users pending approval.</p>
      )}


      <h3 className="text-[18px] font-semibold mb-2 text-gray-800">Active Users</h3>
      {activeUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="text-[14px] min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Name</th>
                <th className="text-left p-4 font-medium text-gray-600">Email</th>
                <th className="text-left p-4 font-medium text-gray-600">Role</th>
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map((user, index) => (
                <tr key={index} className="border-t border-gray-200">
                  {/* Name Column */}
                  <td className="p-4 text-[14px]">
                    {editingUser === user.username ? (
                      <input
                        type="text"
                        name="name"
                        value={editFormData?.name || ""}
                        onChange={handleInputChange}
                        className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="Name"
                      />
                    ) : (
                      <div className="flex items-center">
                        <img
                          src="../../../assets/Leadingelement.png"
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 mr-4"
                        />
                        <span className="font-semibold text-gray-800">{user.name}</span>
                      </div>
                    )}
                  </td>
                  
                  {/* Email Column */}
                  <td className="p-4 text-[14px]">
                    {editingUser === user.username ? (
                      <input
                        type="email"
                        name="email"
                        value={editFormData?.email || ""}
                        onChange={handleInputChange}
                        className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="Email"
                      />
                    ) : (
                      <span className="text-gray-600">{user.email}</span>
                    )}
                  </td>
                  
                  {/* Role Column */}
                  <td className="p-4 text-[14px]">
                    {editingUser === user.username ? (
                      <select
                        name="role"
                        value={editFormData?.role || ""}
                        onChange={handleInputChange}
                        className="px-2 py-1 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                      </select>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-gray-100  text-gray-600">
                        {user.role}
                      </span>
                    )}
                  </td>
                  
                  {/* Actions Column */}
                  <td className="p-4 text-[14px]">
                    <div className="flex space-x-4">
                      {editingUser === user.username ? (
                        <>
                          {/* Save Button */}
                          <button
                            onClick={handleUpdateUser}
                            className="px-3 py-1 rounded-full bg-green-600 text-white font-medium  hover:bg-green-700 transition duration-300"
                          >
                            Save
                          </button>
                          {/* Cancel Button */}
                          <button
                            onClick={() => setEditingUser(null)}
                            className="px-3 py-1 rounded-full bg-gray-500 text-white font-medium  hover:bg-gray-600 transition duration-300"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Inactivate Button */}
                          <button
                            onClick={() => inactivateUser(user.username)}
                            className="px-3 py-1 rounded-full text-[14px] bg-red-500 text-white font-medium  hover:bg-red-600 transition duration-300"
                          >
                            Inactivate
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditClick(user)}
                            className="px-3 py-1 rounded-full text-[14px] bg-blue-500 text-white font-medium  hover:bg-blue-600 transition duration-300"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[16px] text-gray-500 pl-4 pb-2">No active users available.</p>
      )}

      <h3 className="text-[18px] font-semibold mb-2">Inactive Users</h3>
      {inactiveUsers.length > 0 ? (
        <div className="overflow-x-auto text-[14px]">
          <table className="min-w-full bg-white shadow-md rounded-lg ">
            <thead>
              <tr>
                <th className="text-left p-4 font-medium text-gray-600 text-[14px]">Name</th>
                <th className="text-left p-4 font-medium text-gray-600 text-[14px]">Status</th>
                <th className="text-left p-4 font-medium text-gray-600 text-[14px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inactiveUsers.map((user, index) => (
                <tr key={index} className="border-t border-gray-200">
                  {/* Name Column */}
                  <td className="p-4 flex items-center">
                    <img
                      src="../../../assets/Leadingelement.png"
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 mr-4"
                    />
                    <span className="font-semibold text-gray-800">{user.name}</span>
                  </td>
                  
                  {/* Status Column */}
                  <td className="p-4 text-gray-600">Inactive User</td>
                  
                  {/* Actions Column */}
                  <td className="p-4">
                    <div className="flex space-x-4">
                      {/* Activate Button */}
                      <button
                        onClick={() => activateUser(user.username)}
                        className="px-3 py-1 rounded-full text-[14px] bg-green-500 text-white font-medium hover:bg-green-600 transition duration-300"
                      >
                        Activate
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => rejectUser(user.username)}
                        className="px-3 py-1 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[16px] text-gray-500 pl-4 pb-2">No inactive users available.</p>
      )}


      {/* Confirmation Dialog */}
      {confirmAction.user && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {confirmAction.action === "delete"
                ? `Are you sure you want to delete ${confirmAction.user.name}?`
                : confirmAction.action === "inactivate"
                ? `Are you sure you want to inactivate ${confirmAction.user.name}?`
                : `Are you sure you want to activate ${confirmAction.user.name}?`}
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Confirm
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveUser;
