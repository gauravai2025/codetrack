import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import { Link } from "react-router-dom";
import "./ContestList.css";
import "./ProblemList.css";
import BackgroundAnimation from "./BackgroundAnimation";

const ContestsList = () => {
  const [contests, setContests] = useState([]);
  const [error, setError] = useState(null);
  const { fetchContests, auth } = useContext(AuthContext);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getContests = async () => {
      try {
        const data = await fetchContests();
        console.log("Fetched contests:");
        // Sort contests by startTime in descending order
        data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        setContests(data);
      } catch (err) {
        setError(err.message);
      }
    };

    getContests();
  }, [fetchContests]);

  const handleRegister = async (contestId) => {
    try {
      if (!auth) {
        alert("Please login to register for a contest");
      } else {
        const userEmail = auth["userEmail"];
        console.log(contestId, userEmail);
        // Check if user is already registered
        const response = await fetch(`${BASE_URL}/checksubmission`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contestId, userEmail }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.exists) {
            console.log("User is already registered for this contest");
            // Handle already registered case
          } else {
            console.log("User is not registered, proceeding with registration");
            // await registerForContest(contestId);
            // Refresh contests list after registration
            const contestsData = await fetchContests();
            contestsData.sort(
              (a, b) => new Date(b.startTime) - new Date(a.startTime)
            );
            setContests(contestsData);
          }
        } else {
          throw new Error("Failed to check registration");
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  // Split contests into upcoming/current and past contests
  const now = new Date();
  const upcomingOrCurrentContests = contests.filter(
    (contest) => new Date(contest.startTime) > now
  );
  const pastContests = contests.filter(
    (contest) =>
      new Date(contest.endTime) < now || new Date(contest.startTime) <= now
  );

  return (
    <>
      <BackgroundAnimation />

      <h1 className="nabla-unique styl">Contests</h1>
      <div className="container mx-auto p-4 ">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-sky-400">
            Upcoming Contests
          </h2>
          {upcomingOrCurrentContests.length === 0 ? (
            <p>No upcoming or current contests</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-auto">
                <thead className="bg-red-950">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gradient-to-b from-transparent to-blue-950 divide-y divide-gray-200 text-teal-50">
                  {upcomingOrCurrentContests.map((contest) => (
                    <tr key={contest._id}>
                      <td className="px-6 py-4">{contest.contestName}</td>
                      <td className="px-6 py-4">{contest.duration}</td>
                      <td className="px-6 py-4">
                        {new Date(contest.startTime).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(contest.endTime).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {contest.createdBy.username}
                      </td>
                      <td className="px-6 py-4">
                        {auth &&
                        auth.userEmail &&
                        contest.registrations.includes(auth.userEmail) ? (
                          <span>You have been registered</span>
                        ) : (
                          <button
                            onClick={() => handleRegister(contest._id)}
                            className="bg-red-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                          >
                            Register
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-white">
            Active / Past Contests
          </h2>
          {pastContests.length === 0 ? (
            <p>No past contests</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-auto">
                <thead className="bg-red-950">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gradient-to-b from-transparent to-blue-950 divide-y divide-gray-200 text-white">
                  {pastContests.map((contest) => (
                    <tr key={contest._id}>
                      <td className="px-6 py-4">{contest.contestName}</td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/view/${contest._id}`}
                          className="underline hover:bg-blue-700 transition duration-300"
                        >
                          View Contest
                        </Link>
                      </td>
                      <td className="px-6 py-4">{contest.duration}</td>
                      <td className="px-6 py-4">
                        {new Date(contest.startTime).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(contest.endTime).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {contest.createdBy.username}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ContestsList;
