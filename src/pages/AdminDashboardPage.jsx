import React, { useContext, useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MkdSDK from "../utils/MkdSDK";
import { TableRow } from "../components/TableRow";
import { AuthContext } from "../authContext";
import { useNavigate } from "react-router";

const AdminDashboardPage = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const sdk = new MkdSDK();
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  sdk.setTable("video");
  useEffect(() => {
    const initialize = async () => {
      const payload = {
        page: currentPage,
        limit: 10,
        payload: {},
      };
      await sdk.callRestAPI(payload, "PAGINATE").then((res) => {
        console.log(res);
        setData(res?.list);
        setTotalPages(res.num_pages);
      });
    };
    initialize();
  }, [currentPage]);

  //Change table data to next items
  const handleNextPage = () => {
    if (currentPage === totalPages) {
      setCurrentPage(totalPages);
    }
    setCurrentPage(currentPage + 1);
  };

  //Change table data to previous items
  const handlePreviousPage = () => {
    if (currentPage === 1) {
      setCurrentPage(1);
    }
    setCurrentPage(currentPage - 1);
  };

  // Log out handler
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/admin/login/");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  const moveRow = (fromIndex, toIndex) => {
    const newData = [...data];
    const [movedRow] = newData.splice(fromIndex, 1);
    newData.splice(toIndex, 0, movedRow);
    setData(newData);
  };

  const renderRow = (item, index) => {
    return (
      <>
        <td className="">{item.id}</td>
        <td className="">
          <div className="flex flex-row gap-4 items-center">
            <img
              className="rounded-xl h-24 object-cover object-center w-44"
              src={item.photo}
              alt={item.id}
            />
            <p>{item.title}</p>
          </div>
        </td>
        <td className="">{item.username}</td>
        <td className="">{item.like}</td>
      </>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <>
        {loading ? (
          "Loading..."
        ) : (
          <div className="">
            {/* <div className="w-full flex justify-center items-center text-7xl h-screen text-gray-700 ">
        Dashboard
      </div> */}
            <div className="flex flex-row w-full justify-between">
              <div className="logo">
                <h1 className="text-5xl font-extrabold text-white">App</h1>
              </div>
              <button
                className="app-btn text-sm flex flex-row gap-2 justify-between items-center"
                onClick={handleLogout}
              >
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_5493_273)">
                      <path
                        d="M5 19.9997C5 17.5437 6.991 15.5527 9.447 15.5527H14.553C17.009 15.5527 19 17.5437 19 19.9997"
                        stroke="#696969"
                        stroke-width="1.4824"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.0052 5.2448C16.6649 6.90453 16.6649 9.59548 15.0052 11.2552C13.3455 12.9149 10.6545 12.9149 8.9948 11.2552C7.33507 9.59548 7.33507 6.90453 8.9948 5.2448C10.6545 3.58507 13.3455 3.58507 15.0052 5.2448"
                        stroke="#696969"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_5493_273">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>Logout</div>
              </button>
            </div>

            {/* Dashboard header */}

            <div className="flex flex-row justify-between items-center mt-12">
              <h3 className="text-4xl text-white"> Today's leaderboard</h3>

              <div>
                <div className="header-chip rounded-xl text-gray-200 flex flex-row p-3 px-5 gap-4 items-center">
                  <div className="">
                    <p> 30 May 2022 </p>
                  </div>
                  <div className="inner-chip rounded-lg p-1">
                    SUBMISSION OPEN
                  </div>
                  <div className="">
                    <p>11:34</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table data */}
            <div className="min-w-full relative overflow-x-auto mt-5">
              <table className="app-table min-w-full bg-transparent table-auto w-full md:text-lg text-sm text-left text-gray-500">
                <thead>
                  <tr>
                    <th className="px-5 py-3   text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-5 py-3   text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-5 py-3   text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-5 py-3   text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      Most Liked
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-transparent">
                  {data?.map((item, index) => (
                    <TableRow key={item.id} index={index} moveRow={moveRow}>
                      {renderRow(item, index)}
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION  */}
            <div className="flex flex-row gap-4 mt-5 justify-center items-center">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1 ? true : false}
                className="disabled:opacity-30 app-btn text-lg"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                className="disabled:opacity-30 app-btn text-lg"
                disabled={currentPage === totalPages ? true : false}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </>
    </DndProvider>
  );
};

export default AdminDashboardPage;
