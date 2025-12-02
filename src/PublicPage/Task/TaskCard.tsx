// import { useState } from "react";
// import axios from "axios";
// import type { Task } from "./Tasks";

// interface TaskCardProps {
//   task: Task;
//   fetchTasks: () => Promise<void>;
// }

// const TaskCard: React.FC<TaskCardProps> = ({ task, fetchTasks }) => {
//   const [status, setStatus] = useState(task.status);
//   const [loadingStatus, setLoadingStatus] = useState(false);

//   const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newStatus = e.target.value;
//     if (!newStatus) return;
//     setStatus(newStatus);
//     setLoadingStatus(true);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No token found");

//       await axios.put(
//         `https://taskatbcknd.wegostation.com/api/user/tasks/${task._id}`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       await fetchTasks();
//     } catch (error) {
//       setStatus(task.status);
//       console.error("Failed to update status:", error);
//     } finally {
//       setLoadingStatus(false);
//     }
//   };

//   const statusColors: Record<string, string> = {
//     pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
//     "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
//     completed: "bg-green-100 text-green-800 border-green-300",
//     cancelled: "bg-red-100 text-red-800 border-red-300",
//   };

//   const statusColor = statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300";

//   return (
//     <div className="p-6 transition-shadow duration-300 border border-gray-200 rounded-lg shadow-md hover:shadow-lg">
//       <div className="flex items-start justify-between mb-4">
//         <h3 className="text-xl font-bold text-gray-800">{task.task_id.name}</h3>
//         <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
//           {status}
//         </span>
//       </div>

//       <div className="space-y-3">
//         <div className="flex items-center">
//           <svg className="w-5 h-5 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//           </svg>
//           <div>
//             <p className="text-sm font-medium text-gray-700">{task.user_id.name}</p>
//             <p className="text-xs text-gray-500">{task.user_id.email}</p>
//           </div>
//         </div>

//         <div className="flex items-center">
//           <span className="text-sm text-gray-700">
//             <span className="font-medium">Role:</span> {task.role}
//           </span>
//         </div>

//         {!task.is_finished && (
//           <select
//             value={status}
//             onChange={handleStatusChange}
//             disabled={loadingStatus}
//             className="px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border rounded-full"
//           >
//             <option value="">Select</option>
//             {status==="pending" &&<option value="in_progress">In Progress</option> }
//             {status==="Pending_edit'" &&<option value="in_progress_edit">In Progress Edit</option> }
//             {(status === "in_progress" || status === "in_progress_edit") && <option value="done">Done</option>}
//             {/* {status === "rejected" && <option value="pending_edit">pending_edit</option>}<option value="done">Done</option> */}
//           </select>
//         )}

//         <div className="flex items-center">
//           {task.is_finished ? (
//             <span className="flex items-center text-sm font-medium text-green-600">Completed</span>
//           ) : (
//             <span className="flex items-center text-sm font-medium text-orange-600">In Progress</span>
//           )}
//         </div>

//         <div className="pt-3 border-t border-gray-100">
//           <p className="text-xs text-gray-500">
//             Created: {new Date(task.createdAt).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskCard;
