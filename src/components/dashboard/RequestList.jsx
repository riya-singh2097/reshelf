import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios.js";
import { useFirebase } from "../../context/FirebaseContext.jsx";
import { useUserContext } from "../../context/UserContext.jsx"; 
import { toast } from "react-toastify";

const RequestList = ({ selectedConversation }) => {
  const { user } = useFirebase();
  const { dbUser } = useUserContext();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["requests", dbUser?._id],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await api.get("/request/my-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data || [];
    },
    enabled: !!user && !!dbUser,
  });

  const mutation = useMutation({
    mutationFn: async ({ requestId, newStatus }) => {
      const token = await user.getIdToken();
      return api.patch(
        "/request/update-status",
        { requestId, newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: (res, variables) => {
      toast.success(`Request ${variables.newStatus}`);
      queryClient.invalidateQueries(["requests"]); 
      queryClient.invalidateQueries(["conversations"]); 
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error updating request");
    },
  });

  const handleStatusUpdate = (e, requestId, newStatus) => {
    e.stopPropagation();
    mutation.mutate({ requestId, newStatus });
  };

  if (isLoading) return <div className="p-10 text-center"><span className="loading loading-dots loading-lg text-primary"></span></div>;

  return (
    <div className="w-full max-w-2xl mx-auto bg-base-100 shadow-xl rounded-xl overflow-hidden border border-base-300">
      <div className="p-4 border-b border-base-300 bg-base-200/50">
        <h1 className="text-lg md:text-xl font-bold text-base-content uppercase tracking-tight">Borrow Requests</h1>
      </div>

      <div className="divide-y divide-base-300">
        {requests.length === 0 ? (
          <p className="p-10 text-center text-base-content/50 italic">No requests yet.</p>
        ) : (
          requests.map((req) => {
            const isIncoming = req.receiver?._id === dbUser?._id || req.receiver === dbUser?._id;
            const displayUser = isIncoming ? req.sender : req.receiver;
            const isPending = req.status === "pending";
            const convoId = req.conversationId?._id || req.conversationId;

            return (
              <div
                key={req._id}
                className={`flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4 hover:bg-base-200/50 transition-colors ${convoId ? "cursor-pointer" : ""}`}
                onClick={() => convoId && selectedConversation(convoId, displayUser?.username,displayUser?.profilePhotoURL )}
              >
                {/* Avatar & User Info Group */}
                <div className="flex items-center w-full sm:w-auto flex-1">
                  <div className="flex-shrink-0">
                    <img
                      src={displayUser?.profilePhotoURL || "https://via.placeholder.com/150"}
                      alt="avatar"
                      className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full border border-base-300 shadow-sm"
                    />
                  </div>

                  <div className="ml-3 flex-1">
                    <div className="flex flex-col leading-tight">
                      <span className="text-primary font-bold text-sm md:text-base">
                        @{displayUser?.username}
                      </span>
                      <span className="text-xs text-base-content/60">
                        {isIncoming ? `wants to borrow` : `You requested from ${displayUser?.username}`}
                      </span>
                      <span className="text-sm font-semibold text-base-content mt-1 line-clamp-1">
                        "{req.bookId?.bookTitle}"
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Group: Stacks on mobile */}
                <div className="w-full sm:w-auto flex justify-end items-center gap-2 pt-2 sm:pt-0 border-t border-base-200 sm:border-none">
                  {isIncoming && isPending ? (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={(e) => handleStatusUpdate(e, req._id, "accepted")}
                        disabled={mutation.isPending}
                        className="btn btn-primary btn-sm flex-1 sm:flex-none"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={(e) => handleStatusUpdate(e, req._id, "rejected")}
                        disabled={mutation.isPending}
                        className="btn btn-outline btn-sm flex-1 sm:flex-none"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ml-auto ${
                      req.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' : 
                      req.status === 'accepted' ? 'bg-success/10 text-success border-success/20' : 
                      'bg-error/10 text-error border-error/20'
                    }`}>
                      {req.status}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RequestList;