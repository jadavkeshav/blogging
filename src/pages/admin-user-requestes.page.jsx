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
} from "@mui/material";
import { Toaster, toast } from "react-hot-toast";

const UserRequests = () => {
  const { userAuth } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchRequests();
  }, [userAuth]);

  const handleApprove = (id) => {
    // Implement approve request logic here
    toast.success("Request approved!");
  };

  const handleDecline = (id) => {
    // Implement decline request logic here
    toast.error("Request declined!");
  };

  const handleShowProfile = (userId) => {
    // Implement show profile logic here
    toast.info(`Show profile for user ID: ${userId}`);
  };

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return (
    <>
      <Toaster />
      <Container component="main" maxWidth="lg">
        <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            User Requests
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.fullname}</TableCell>
                    <TableCell>{request.username}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{request.message}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprove(request._id)}
                        sx={{ marginRight: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDecline(request._id)}
                        sx={{ marginRight: 1 }}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleShowProfile(request.userId)}
                      >
                        Show Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </>
  );
};

export default UserRequests;
    