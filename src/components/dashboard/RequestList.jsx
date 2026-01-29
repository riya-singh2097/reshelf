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
      
      // REFRESH BOTH CACHES
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
    <div className="max-w-2xl mx-auto w-full bg-base-100 shadow-xl rounded-xl overflow-hidden border border-base-300">
      <div className="p-4 border-b border-base-300 bg-base-200/50">
        <h1 className="text-xl font-bold text-base-content">Borrow Requests</h1>
      </div>

      <div className="divide-y divide-base-300">
        {requests.length === 0 ? (
          <p className="p-10 text-center text-base-content/50">No requests yet.</p>
        ) : (
          requests.map((req) => {
            const isIncoming = req.receiver?._id === dbUser?._id || req.receiver === dbUser?._id;
            const displayUser = isIncoming ? req.sender : req.receiver;
            const isPending = req.status === "pending";
            const convoId = req.conversationId?._id || req.conversationId;

            return (
              <div
                key={req._id}
                className={`flex items-center p-4 hover:bg-base-200/50 transition-colors ${convoId ? "cursor-pointer" : ""}`}
                onClick={() => convoId && selectedConversation(convoId)}
              >
                <div className="flex-shrink-0">
                  <img
                    src={displayUser?.profilePhotoURL || "https://via.placeholder.com/150"}
                    alt="avatar"
                    className="w-16 h-16 object-cover rounded-lg border border-base-300 shadow-sm"
                  />
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex flex-col">
                    <span className="text-primary font-bold hover:underline cursor-pointer">
                      {displayUser?.username}
                    </span>
                    <span className="text-sm text-base-content/70">
                      {isIncoming ? `wants to borrow` : `You requested from ${displayUser?.username}`}
                    </span>
                    <span className="text-sm font-medium text-base-content italic">
                      "{req.bookId?.bookTitle}"
                    </span>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  {isIncoming && isPending ? (
                    <>
                      <button
                        onClick={(e) => handleStatusUpdate(e, req._id, "accepted")}
                        disabled={mutation.isPending}
                        className="btn btn-primary btn-sm normal-case shadow-md"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={(e) => handleStatusUpdate(e, req._id, "rejected")}
                        disabled={mutation.isPending}
                        className="btn btn-ghost btn-sm border-base-300 normal-case"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                      req.status === 'pending' ? 'bg-warning/20 text-warning border-warning/30' : 
                      req.status === 'accepted' ? 'bg-success/20 text-success border-success/30' : 
                      'bg-error/20 text-error border-error/30'
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