import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  TableSortLabel,
} from "@mui/material";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader.component";

const UserRequests = () => {

  const navigate = useNavigate();

  const { userAuth } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "fullname", direction: "asc" });


  const fetchRequests = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/get-request",
        {},
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      );
      setRequests(response.data.requests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests.");
      setLoading(false);
    }
  };

  useEffect(() => {


    fetchRequests();
  }, [userAuth]);


  console.log("req : ", requests);

  const handleApprove = (uid, username) => {
    // Implement approve request logic here
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/approve-request", { uid, username }, {
      headers: {
        Authorization: `Bearer ${userAuth.access_token}`,
      }
    })
      .then((response) => {
        console.log(response.data);
        toast.success("Request approved!");
        fetchRequests();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to approve request.");
      });
  };

  const handleDecline = (uid, username) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/reject-request", { uid, username }, {
      headers: {
        Authorization: `Bearer ${userAuth.access_token}`,
      }
    })
      .then((response) => {
        console.log(response.data);
        toast.success("Request Rejected!");
        fetchRequests();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to approve request.");
      });
  };

  const handleShowProfile = (username) => {
    navigate(`/user/${username}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((value, key) => value[key], obj);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredRequests = requests.filter((request) => {
    const searchQueryLower = searchQuery.toLowerCase();
    return (
      request.fullname.toLowerCase().includes(searchQueryLower) ||
      request.email.toLowerCase().includes(searchQueryLower) ||
      request.username.toLowerCase().includes(searchQueryLower) ||
      request.message.toLowerCase().includes(searchQueryLower)
    );
  });

  const sortedRequests = sortData(filteredRequests);

  if (loading) {
    return <Loader />; // Or any loading indicator you prefer
  }

  return (
    <>
      <Toaster />
      <div className="flex flex-col items-center justify-center p-4 text-gray-800 w-[100%]">

        <div className="w-full mb-4 bg-slate-100 rounded-full">
          <TextField
            type="search"
            label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{ style: { borderRadius: '9999px', backgroundColor: 'inherit' } }}
            className="rounded-full"
          />
        </div>
        <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'fullname'}
                    direction={sortConfig.direction}
                    onClick={() => handleSort('fullname')}
                  >
                    Full Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'username'}
                    direction={sortConfig.direction}
                    onClick={() => handleSort('username')}
                  >
                    Username
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'email'}
                    direction={sortConfig.direction}
                    onClick={() => handleSort('email')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.fullname}</TableCell>
                  <TableCell>{request.username}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.message}</TableCell>
                  <TableCell  >
                    <div className="flex gap-4">
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprove(request.userId, request.username)}
                        sx={{ marginRight: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDecline(request.userId, request.username)}
                        sx={{ marginRight: 1 }}
                      >
                        Decline
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleShowProfile(request.username)}
                      >
                        Show Profile
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default UserRequests;
